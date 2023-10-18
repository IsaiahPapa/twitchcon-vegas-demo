import { Redis } from '@upstash/redis'

export const throwNoENV = (key: string) => {
  throw new Error(`No ENV not found for ${key}`)
}

const RedisCached: { connection: Redis | undefined } = {
  connection: undefined
}

export async function createRedisInstance() {
  try {
    if (RedisCached.connection) return RedisCached.connection

    const redis = new Redis({
      url: process.env.UPSTASH_URL ?? throwNoENV('UPSTASH_URL'),
      token: process.env.UPSTASH_TOKEN ?? throwNoENV('UPSTASH_TOKEN')
    })

    RedisCached.connection = redis
    return RedisCached.connection
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`)
  }
}
