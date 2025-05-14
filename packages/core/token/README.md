# @zopio/token

Minimal stateless token creation and verification utilities.

## Features

- `createToken(payload, { expiresIn })`: creates a base64-url encoded token
- `verifyToken(token)`: parses and validates the token with expiration check

## Usage

```ts
import { createToken, verifyToken } from '@zopio/token';

const token = createToken({ purpose: 'invite', email: 'hi@zopio.dev' }, { expiresIn: 600 });
const payload = verifyToken(token); // throws if expired
```

## Notes

This is not a cryptographic JWT – it's a base64-url encoded object.
Use for temporary, verifiable and non-sensitive data transport.