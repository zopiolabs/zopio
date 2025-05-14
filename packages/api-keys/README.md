# @core/api-keys

API key management module for Zopio framework.

## Features

- **Secure API key generation and hashing**: Creates cryptographically secure API keys with SHA-256 hashing
- **Key validation and revocation**: Validate API keys against stored hashed values and revoke them when needed
- **Scoped permissions**: Assign specific permission scopes to each API key
- **Next.js integration**: Built-in utilities for Next.js API routes
- **Rate limiting**: Optional integration with rate limiting
- **Database persistence**: Prisma schema for storing API keys

## Installation

```bash
npm install @core/api-keys
```

## Usage

### Creating an API Key

```ts
import { createKey } from '@core/api-keys';

// Create a new API key for a user with specific scopes
const apiKey = createKey('user_123', ['read', 'write']);
console.log(`Your API key: ${apiKey}`);
// Output: Your API key: zpk_a1b2c3d4e5f6...
```

### Validating an API Key

```ts
import { validateKey } from '@core/api-keys';

// Check if an API key is valid
const isValid = validateKey('zpk_a1b2c3d4e5f6...');
if (isValid) {
  // Proceed with the API request
} else {
  // Return unauthorized response
}
```

### Revoking an API Key

```ts
import { revokeKey } from '@core/api-keys';

// Revoke an API key
revokeKey('zpk_a1b2c3d4e5f6...');
```

### Next.js Integration

```ts
import { fromApiKey } from '@core/api-keys';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const user = fromApiKey(req);
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return Response.json({ 
    userId: user.userId,
    scopes: user.scopes
  });
}
```

## Development

```bash
# Build the package
npm run build

# Run in development mode with watch
npm run dev

# Run tests
npm run test

# Run linting
npm run lint
```

## Security Considerations

- API keys are hashed using SHA-256 before being stored in the database
- The original API key is only returned once during creation and never stored in plain text
- Keys can be revoked at any time, immediately invalidating them
- Scopes can be used to limit the permissions of each API key

## Documentation

For more detailed documentation, see the [API Keys documentation](../../docs/packages/api-keys.mdx).
