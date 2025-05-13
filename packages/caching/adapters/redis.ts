import type { CacheProvider, CacheOptions } from '../types';
import { redis } from '../client';

export const RedisCache: CacheProvider = {
  async get(key) {
    const value = await redis.get(key);
    return value === null ? undefined : value;
  },

  async set(key, value, options?: CacheOptions) {
    if (options?.ttl) {
      await redis.set(key, value, { ex: options.ttl });
    } else {
      await redis.set(key, value);
    }
  },

  async del(key) {
    await redis.del(key);
  },

  async flushNamespace(prefix) {
    // Get all keys with the prefix
    const keys = await redis.keys(`${prefix}*`);
    
    // Delete all keys if there are any
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
};
