# @zopio/caching

Modular caching system for Zopio core packages. Supports custom TTL, namespacing, and pluggable providers.

## Features

- `get`, `set`, `del` operations
- `getOrLoad()` fallback mechanism
- Namespace flushing (`flushNamespace`)
- Configurable TTL per entry
- Swappable providers (`memory`, `redis`, `mock`)

## Usage

```ts
import { cache } from '@zopio/caching';

await cache.set('auth:session:abc', { userId: '123' }, { ttl: 300 });
const session = await cache.get('auth:session:abc');
await cache.del('auth:session:abc');

await cache.getOrLoad('feature-flag:dark-ui', async () => {
  return fetchFlagFromDB();
}, { ttl: 60 });
```