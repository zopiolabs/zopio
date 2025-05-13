import type { CacheProvider, CacheOptions } from './types';
import { MemoryCache } from './adapters/memory';

let activeCache: CacheProvider = MemoryCache;

export const setCacheProvider = (provider: CacheProvider) => {
  activeCache = provider;
};

export const cache = {
  get: activeCache.get,
  set: activeCache.set,
  del: activeCache.del,
  flushNamespace: activeCache.flushNamespace,
  async getOrLoad<T>(key: string, loader: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const existing = await activeCache.get(key);
    if (existing !== undefined) {
      return existing;
    }
    const value = await loader();
    await activeCache.set(key, value, options);
    return value;
  },
};