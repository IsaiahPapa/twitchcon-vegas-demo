/** @format */
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { nanoid } from '@/lib/utils'
import { Redis } from '@upstash/redis/nodejs'
import { throwNoENV } from '@/lib/redis'
import Models, { AiVoiceSchema } from '@/lib/models'
import OpenAI from 'openai'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const redis = new Redis({
  url: process.env.UPSTASH_URL ?? throwNoENV('UPSTASH_URL'),
  token: process.env.UPSTASH_TOKEN ?? throwNoENV('UPSTASH_TOKEN')
})

// const openai = new OpenAIApi(configuration)

const fireworks = new OpenAI({
  baseURL: 'https://api.fireworks.ai/inference/v1',
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(req: Request) {
  try {
    const voice: AiVoiceSchema = await req.json()
    const prompt = Models.find(model => model.id === voice?.model_id)?.prompt
    if (!prompt) {
      return new Response('No prompt found', {
        status: 502
      })
    }
    console.log(`test`)
    const res = await fireworks.chat.completions.create({
      model: 'accounts/fireworks/models/llama-v2-7b-chat',
      stream: false,
      max_tokens: 1000,
      temperature: 0.75,
      messages: [
        {
          content: String(
            Models.find(model => model.id === voice.model_id)?.prompt
          ),
          role: 'system'
        },
        { content: 'Tell me about yourself!', role: 'user' }
      ],
      top_p: 1
    })
    console.log(`response:`)
    console.log(res)

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
          content: String(
            Models.find(model => model.id === voice.model_id)?.prompt
          ),
          role: 'system'
        },
        { content: 'Tell me about yourself!', role: 'user' },
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
  } catch (e) {
    console.log(e)
    return new Response('There was an error processing your request', {
      status: 552
    })
  }
}
