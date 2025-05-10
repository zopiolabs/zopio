# @zopio/caching

High-performance Redis-backed caching utility.
Used to optimize session access, tenant resolution, and general data TTL-based caching.

## Features

- ✅ `getCache(key)` — Retrieve cached value by key
- ✅ `setCache(key, value, ttl)` — Set value with expiration (in seconds)
- ✅ `deleteCache(key)` — Remove key from cache
- ✅ Built-in Redis support (ioredis, upstash, or node-redis compatible)

## Usage Examples

### Session Caching

```ts
import { getCache, setCache } from '@zopio/caching';

export async function getServerUserWithCache(sessionId: string) {
  const cached = await getCache(`session:${sessionId}`);
  if (cached) return cached;

  const user = await fetchUserFromDatabaseOrProvider(sessionId);
  await setCache(`session:${sessionId}`, user, 60); // Cache for 60s
  return user;
}
```

### Tenant Lookup Caching

```ts
export async function getTenant(tenantId: string) {
  const cached = await getCache(`tenant:${tenantId}`);
  if (cached) return cached;

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (tenant) await setCache(`tenant:${tenantId}`, tenant, 300); // 5min TTL
  return tenant;
}
```

## Environment

Ensure you set `REDIS_URL` or compatible Redis client configuration in `.env`.

## Roadmap

- [ ] Optional namespace support
- [ ] Redis cluster compatibility
- [ ] In-memory fallback for dev