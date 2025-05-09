
# Zopio Caching Package

This package provides a basic abstraction over Upstash Redis for common caching operations:

## Functions

- `getCache<T>(key: string): Promise<T | null>`
- `setCache(key: string, value: any, ttl: number): Promise<void>`
- `deleteCache(key: string): Promise<void>`

## Environment Variables

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
