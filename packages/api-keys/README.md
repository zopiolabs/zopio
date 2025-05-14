# @core/api-keys

API key management module for Zopio framework.

## Features

- Secure API key generation and hashing
- Key validation and revocation
- Modular and edge-compatible

## Usage

```ts
const key = await createKey('user_123', ['read', 'write']);
const isValid = await validateKey(key);
await revokeKey(key);
```
