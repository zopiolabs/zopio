# @zopio/auth-tokens

Stateless microservice-safe token signing and verification.

## Features

- `signToken(payload)` - sign a JWT with a shared secret
- `verifyToken(token)` - verify incoming token and decode payload
- `getTokenFromHeader(req)` - extract bearer token from header