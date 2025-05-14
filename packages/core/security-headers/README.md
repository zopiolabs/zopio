# @zopio/security-headers

Next.js 13+ security middleware inspired by best practices in Next Forge and Helmet.

## Usage

```ts
// middleware.ts
import { withSecurityHeaders } from '@zopio/security-headers';

export const middleware = withSecurityHeaders((req) => {
  return NextResponse.next();
});
```

This middleware injects common security headers:
- Cross-Origin headers
- Referrer Policy
- HSTS
- X-* legacy protections

Ideal for projects using Next.js 13–15.