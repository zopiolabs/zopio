# @repo/rate-limit

## Overview

The `@repo/rate-limit` package provides distributed rate limiting capabilities for Zopio applications using Upstash Redis. It offers a simple interface for creating and managing rate limiters to protect your APIs and services from abuse.

## Module Categories

### Rate Limiting

- **Rate Limiter Creation**: Utilities for creating customizable rate limiters
- **Sliding Window Algorithm**: Implementation of the sliding window rate limiting algorithm

## Usage Guidelines

```typescript
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';

// Create a rate limiter with default settings (10 requests per 10 seconds)
const rateLimiter = createRateLimiter({
  prefix: 'my-api',
});

// Create a rate limiter with custom settings
const customRateLimiter = createRateLimiter({
  prefix: 'custom-api',
  limiter: slidingWindow(5, '1 m'), // 5 requests per minute
});

// Usage in an API route
async function handleRequest(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { success, limit, reset, remaining } = await rateLimiter.limit(ip);
  
  if (!success) {
    return res.status(429).json({
      error: 'Too many requests',
      limit,
      remaining,
      reset,
    });
  }
  
  // Continue with the request handling
}
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/rate-limit
```

## Environment Variables

| Variable | Description | Required | Format |
|----------|-------------|----------|--------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL | Yes | URL format |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token | Yes | String |

## Development Guidelines

### Project Structure

```plaintext
rate-limit/
├── src/
│   ├── index.ts    # Main exports with rate limiter creation
│   └── keys.ts     # Environment variable validation
├── index.ts        # Re-export from src
└── package.json    # Package dependencies
```

### Dependencies

- `@upstash/ratelimit`: Core rate limiting functionality
- `@upstash/redis`: Redis client for Upstash
- `@t3-oss/env-nextjs`: Environment variable validation
- `zod`: Schema validation

### Best Practices

1. **Environment Variables**: Always validate environment variables using the provided `keys` function.
2. **Prefix Naming**: Use descriptive prefixes for rate limiters to avoid key collisions.
3. **Appropriate Limits**: Choose rate limits appropriate for your API's usage patterns.
4. **Error Handling**: Implement proper error handling for rate limit responses.
5. **Client Identification**: Use reliable methods to identify clients (IP, API key, user ID).

## Integration Examples

### Next.js API Route Protection

```typescript
// app/api/protected/route.ts
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
import { NextResponse } from 'next/server';

// Create a rate limiter for this API route
const rateLimiter = createRateLimiter({
  prefix: 'api-protected',
  limiter: slidingWindow(5, '1 m'), // 5 requests per minute
});

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success, limit, reset, remaining } = await rateLimiter.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      },
      { status: 429 }
    );
  }
  
  return NextResponse.json({
    message: 'Protected data',
    rateLimit: { limit, remaining },
  });
}
```

### Authentication Rate Limiting

```typescript
// app/api/auth/login/route.ts
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
import { NextResponse } from 'next/server';

// Create a stricter rate limiter for login attempts
const loginRateLimiter = createRateLimiter({
  prefix: 'login-attempts',
  limiter: slidingWindow(3, '5 m'), // 3 attempts per 5 minutes
});

export async function POST(request: Request) {
  const { email } = await request.json();
  
  // Rate limit by email to prevent brute force attacks
  const { success } = await loginRateLimiter.limit(email);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }
  
  // Continue with authentication logic
  // ...
  
  return NextResponse.json({ success: true });
}
```

### Middleware Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';

// Create a global rate limiter
const globalRateLimiter = createRateLimiter({
  prefix: 'global',
  limiter: slidingWindow(100, '1 m'), // 100 requests per minute
});

export async function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success, limit, remaining, reset } = await globalRateLimiter.limit(ip);
  
  // Set rate limit headers
  const response = success
    ? NextResponse.next()
    : NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
  
  // Add rate limit headers to all responses
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

## Documentation References

- [Upstash Rate Limit Documentation](https://github.com/upstash/ratelimit)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure all environment variables are properly validated.
3. Add appropriate error handling for rate limiting operations.
4. Document any new rate limiting features or changes to existing ones.

## License

MIT
