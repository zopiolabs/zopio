# @repo/security

## Overview

The `@repo/security` package provides security utilities for Zopio applications, integrating Arcjet for bot detection, rate limiting, and shield protection, along with Nosecone for security headers. This package helps protect your application from common web vulnerabilities and attacks.

## Module Categories

### Core Security

- **Arcjet Integration**: Bot detection and shield protection
- **Nosecone Headers**: Security headers configuration for Next.js applications

## Usage Guidelines

### Basic Usage

```typescript
import { secure } from '@repo/security';
import { NextResponse } from 'next/server';

// In your API route
export async function POST(request: Request) {
  // Allow specific bot categories
  await secure(['googlebot', 'bingbot'], request);
  
  // Your API logic here
  return NextResponse.json({ success: true });
}
```

### Security Headers with Nosecone

```typescript
import { noseconeMiddleware, noseconeOptions } from '@repo/security/middleware';
import { NextResponse } from 'next/server';

// In your middleware.ts file
export const middleware = noseconeMiddleware(noseconeOptions);
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/security
```

## Environment Variables

| Variable | Description | Required | Format |
|----------|-------------|----------|--------|
| `ARCJET_KEY` | API key for Arcjet services | Yes | Starts with `ajkey_` |

## Development Guidelines

### Project Structure

```
security/
├── index.ts        # Main exports and Arcjet configuration
├── middleware.ts   # Nosecone middleware and security headers
├── keys.ts         # Environment variable validation
└── package.json    # Package dependencies
```

### Dependencies

- `@arcjet/next`: Arcjet integration for Next.js applications
- `@nosecone/next`: Security headers for Next.js applications
- `@t3-oss/env-nextjs`: Environment variable validation
- `@repo/observability`: Logging utilities

### Best Practices

1. **Environment Variables**: Always validate environment variables using the provided `keys` function.
2. **Development Mode**: In development mode, Arcjet Shield runs in `DRY_RUN` mode to avoid blocking requests.
3. **Bot Detection**: Use the `secure` function with appropriate bot categories to allow legitimate bots.
4. **Security Headers**: Use Nosecone middleware to apply security headers to your application.

## Integration Examples

### API Route Protection

```typescript
// app/api/protected/route.ts
import { secure } from '@repo/security';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Protect the API route with Arcjet
  await secure(['googlebot'], request);
  
  // Your API logic here
  return NextResponse.json({ message: 'Protected endpoint' });
}
```

### Application Middleware

```typescript
// middleware.ts
import { noseconeMiddleware, noseconeOptionsWithToolbar } from '@repo/security/middleware';

// Apply security headers to all routes
export const middleware = noseconeMiddleware(noseconeOptionsWithToolbar);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Content Security Policy

While CSP is disabled by default (as noted in the middleware.ts file), you can enable and configure it based on your application's needs:

```typescript
// middleware.ts
import { noseconeMiddleware, noseconeOptions } from '@repo/security/middleware';

const customOptions = {
  ...noseconeOptions,
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", 'https://trusted-cdn.com'],
      // Add other directives as needed
    }
  }
};

export const middleware = noseconeMiddleware(customOptions);
```

## Documentation References

- [Arcjet Documentation](https://docs.arcjet.com/)
- [Nosecone Documentation](https://docs.arcjet.com/nosecone/quick-start)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure all environment variables are properly validated.
3. Add appropriate error handling for security-related functions.
4. Write tests for new security features.
5. Document any new security features or changes to existing ones.

## License

MIT
