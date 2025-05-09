
import { redis } from "./client"

export async function getCache<T = any>(key: string): Promise<T | null> {
  const result = await redis.get(key)
  return result ? JSON.parse(result) : null
}

export async function setCache(key: string, value: any, ttl: number): Promise<void> {
  await redis.set(key, JSON.stringify(value), { ex: ttl })
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key)
}
