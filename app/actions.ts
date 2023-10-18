'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { type Chat } from '@/lib/types'
import { Redis } from '@upstash/redis'

const throwNoENV = (key: string) => {
  throw new Error(`No ENV not found for ${key}`)
}
const redis = new Redis({
  url: process.env.UPSTASH_URL ?? throwNoENV('UPSTASH_URL'),
  token: process.env.UPSTASH_TOKEN ?? throwNoENV('UPSTASH_TOKEN')
})

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = redis.pipeline()

    //Check cache
    const chats: string[] = await redis.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }
    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    console.log(`getChats Error:`, error)
    return []
  }
}

export async function getChat(id: string, userId: string) {
  try {
    //@ts-ignore
    const chat: Chat = await redis.hgetall(`chat:${id}`)
    console.log(chat)
    if (!chat || (userId && chat.userId !== userId)) {
      return null
    }

    return chat
  } catch (error) {
    console.log(`getChat Error:`, error)
  }
}

export async function removeChat({
  id,
  userId,
  path
}: {
  id: string
  userId: string
  path: string
}) {
  try {
    await redis.del(`chat:${id}`)
    await redis.zrem(`user:chat:${userId}`, `chat:${id}`)

    revalidatePath('/')
    return revalidatePath(path)
  } catch (error) {
    console.log(`removeChat Error:`, error)
  }
}

export async function clearChats() {
  const chats: string[] = await redis.zrange(`user:chat:${"DEMO"}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = redis.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${"DEMO"}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  try {
    //@ts-ignore
    const chat: Chat = await redis.hgetall(`chat:${id}`)

    if (!chat || !chat.sharePath) {
      return null
    }

    return chat
  } catch (error) {
    console.log(`getSharedChat Error:`, error)
    return
  }
}

export async function shareChat(chat: Chat) {
  try {
    const payload = {
      ...chat,
      sharePath: `/share/${chat.id}`
    }

    await redis.hmset(`chat:${chat.id}`, payload)

    return payload
  } catch (error) {
    console.log(`shareChat Error:`, error)
    return
  }
}
