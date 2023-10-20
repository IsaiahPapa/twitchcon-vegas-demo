/** @format */
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { nanoid } from '@/lib/utils'
import { Redis } from '@upstash/redis/nodejs'
import { throwNoENV } from '@/lib/redis'
import Models, { AiVoiceSchema } from '@/lib/models'

export const runtime = 'edge'

export const maxDuration = 300;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const redis = new Redis({
  url: process.env.UPSTASH_URL ?? throwNoENV('UPSTASH_URL'),
  token: process.env.UPSTASH_TOKEN ?? throwNoENV('UPSTASH_TOKEN')
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const voice: AiVoiceSchema = await req.json()
  const prompt = Models.find(model => model.id === voice?.model_id)?.prompt
  if (!prompt) {
    return new Response('No prompt found', {
      status: 502
    })
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        content: String(
          Models.find(model => model.id === voice.model_id)?.prompt
        ),
        role: 'system'
      }
      // {
      //   content: 'Introduce yourself!',
      //   role: 'user'
      // }
    ],
    temperature: 0.7,
    stream: false
  })

  const title = `Chat with ${voice.name}!`
  const id = nanoid(16)
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = {
    id,
    title,
    modelId: voice.model_id,
    userId: 'DEMO',
    createdAt,
    path,
    messages: [
      {
        content: `Hey, I'm ${voice.name}! Ask me anything.`,
        role: 'assistant'
      }
    ]
  }

  await redis.hmset(`chat:${id}`, payload)
  await redis.zadd(`user:chat:${'DEMO'}`, {
    score: createdAt,
    member: `chat:${id}`
  })

  return new Response(
    JSON.stringify({
      id: id,
      path: `/chat/${id}`
    }),
    {
      status: 200
    }
  )
}
