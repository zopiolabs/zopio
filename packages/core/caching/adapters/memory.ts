import type { CacheProvider, CacheOptions } from '../types';

const store = new Map<string, { value: any; expiresAt?: number }>();

export const MemoryCache: CacheProvider = {
  async get(key) {
    const item = store.get(key);
    if (!item) return undefined;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      store.delete(key);
      return undefined;
    }
    return item.value;
  },

  async set(key, value, options?: CacheOptions) {
    const expiresAt = options?.ttl ? Date.now() + options.ttl * 1000 : undefined;
    store.set(key, { value, expiresAt });
  },

  async del(key) {
    store.delete(key);
  },

  async flushNamespace(prefix) {
    for (const key of store.keys()) {
      if (key.startsWith(prefix)) {
        store.delete(key);
      }
    }
  }
};