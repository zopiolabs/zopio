# @zopio/auth-sessions

Core session management utilities for server functions and middleware in Zopio apps.

## Features

- `getServerUser(req)` — extract user from headers (e.g., x-user)
- `requireSession(req)` — enforce login, return 401 if not present
- `getTokenFromHeader(req)` — extract bearer token from Authorization header

## Usage

```ts
import { getServerUser, requireSession } from '@zopio/auth-sessions';

const user = await requireSession(req);
// or:
const user = await getServerUser(req);
```