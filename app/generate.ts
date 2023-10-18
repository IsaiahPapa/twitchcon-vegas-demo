'use server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { nanoid } from '@/lib/utils'
import { Redis } from '@upstash/redis/nodejs'
import { throwNoENV } from '@/lib/redis'
import Models, { AiVoiceSchema } from '@/lib/models'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const redis = new Redis({
  url: process.env.UPSTASH_URL ?? throwNoENV('UPSTASH_URL'),
  token: process.env.UPSTASH_TOKEN ?? throwNoENV('UPSTASH_TOKEN')
})

const openai = new OpenAIApi(configuration)

const GenerateCharacterChat = async (voice: AiVoiceSchema) => {
  const prompt = Models.find(model => model.id === voice.model_id)?.prompt
  if (!prompt) {
    console.log(
      `Unable to find prompt. Voice ID: ${voice.model_id}, ${voice.name}`
    )
    return
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        content: String(
          Models.find(model => model.id === voice.model_id)?.prompt
        ),
        role: 'system'
      },
      {
        content: 'Introduce yourself!',
        role: 'user'
      }
    ],
    temperature: 0.7,
    stream: true
  })
  const id = nanoid()
  const stream = OpenAIStream(res, {
    async onToken(token) {
      console.log(`token`, token)
    },
    async onCompletion(completion) {
      console.log(`Completed!`)
      const title = `Chat with ${voice.name}!`
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
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await redis.hmset(`chat:${id}`, payload)
      await redis.zadd(`user:chat:${'DEMO'}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })
  
}

export default GenerateCharacterChat
