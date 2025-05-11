# @zopio/runtime-adapter

Abstraction layer for runtime-specific logic in Zopio applications.

## Features

- Provides unified interface for accessing cookies, headers, IPs and request context.
- Supports different environments (Next.js, Node.js, etc.) via pluggable adapters.
- Allows writing portable modules without coupling to framework internals.

## Usage

```ts
import { getRuntimeAdapter } from '@zopio/runtime-adapter';

const adapter = getRuntimeAdapter();
const ip = adapter.getIp();
const session = adapter.getCookie('zpsid');
```