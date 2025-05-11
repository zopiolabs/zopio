export interface CacheOptions {
  ttl?: number; // in seconds
}

export interface CacheProvider {
  get: (key: string) => Promise<any | undefined>;
  set: (key: string, value: any, options?: CacheOptions) => Promise<void>;
  del: (key: string) => Promise<void>;
  flushNamespace?: (prefix: string) => Promise<void>;
}