import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { nanoid } from '@/lib/utils'
import { Redis } from '@upstash/redis/nodejs'
import { throwNoENV } from '@/lib/redis'

export const runtime = 'edge'

export const maxDuration = 300

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const redis = new Redis({
  url: process.env.UPSTASH_URL ?? throwNoENV('UPSTASH_URL'),
  token: process.env.UPSTASH_TOKEN ?? throwNoENV('UPSTASH_TOKEN')
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = 'DEMO'

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await redis.hmset(`chat:${id}`, payload)
      await redis.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}
