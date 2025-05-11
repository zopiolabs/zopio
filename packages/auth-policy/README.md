# @repo/auth-policy

Lightweight policy engine for access control decisions in Zopio applications.

## Features

- Register rules for actions using simple async functions
- Context-aware policies combining roles and resources
- Mockable with `allowAll`, `denyAll` helpers for testing

## Example

```ts
import { can } from '@repo/auth-policy';

const allowed = await can({
  user: { id: 'u1', roles: ['admin'] },
  action: 'plugin.install'
});

if (allowed) {
  // allow plugin installation
}
```