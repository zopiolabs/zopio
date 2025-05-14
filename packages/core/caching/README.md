# @zopio/caching

Modular caching system for Zopio core packages. Supports custom TTL, namespacing, and pluggable providers.

## Features

- Simple, consistent API for all cache providers
- Multiple storage backends (Memory, Redis)
- TTL support (Time-To-Live)
- Namespace-based cache invalidation
- Convenient `getOrLoad` pattern for cache-aside operations

## Installation

The package is included in the Zopio monorepo and can be imported directly:

```ts
import { cache } from '@repo/caching';
```

## Basic Usage

```ts
import { cache } from '@repo/caching';

// Get a value from the cache
const value = await cache.get('key');

// Set a value in the cache
await cache.set('key', value, { ttl: 60 }); // TTL in seconds

// Delete a value from the cache
await cache.del('key');

// Delete all keys with a specific prefix
await cache.flushNamespace('user:123:');
```

## Cache-Aside Pattern

The package provides a convenient `getOrLoad` method for implementing the cache-aside pattern:

```ts
import { cache } from '@repo/caching';

async function getUserProfile(userId: string) {
  return cache.getOrLoad(
    `user:${userId}:profile`,
    async () => {
      // This function only runs if the data isn't in the cache
      const profile = await db.getUserProfile(userId);
      return profile;
    },
    { ttl: 3600 } // Cache for 1 hour
  );
}
```

## Switching Cache Providers

By default, the package uses an in-memory cache. You can switch to Redis or another provider:

```ts
import { setCacheProvider, RedisCache } from '@repo/caching';

// Switch to Redis cache
setCacheProvider(RedisCache);
```

## Redis Configuration

To use Redis, ensure you have the following environment variables set:

```env
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

A sample `.env.example` file is included in the package for reference.

## Custom Cache Providers

You can implement your own cache provider by implementing the `CacheProvider` interface:

```ts
import { CacheProvider, setCacheProvider } from '@repo/caching';

const MyCustomCache: CacheProvider = {
  async get(key) { /* ... */ },
  async set(key, value, options) { /* ... */ },
  async del(key) { /* ... */ },
  async flushNamespace(prefix) { /* ... */ }
};

setCacheProvider(MyCustomCache);