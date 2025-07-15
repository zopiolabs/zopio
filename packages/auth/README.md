# @repo/auth

## Overview

The `@repo/auth` package provides a unified authentication layer for Zopio applications using Clerk as the primary authentication provider. It abstracts away the implementation details of Clerk, making it easier to integrate authentication into your applications and potentially switch providers in the future.

## Module Categories

### Core Components

- **AuthProvider**: A React component that wraps your application to enable authentication with proper theming support
- **SignIn/SignUp**: Pre-styled authentication components for sign-in and sign-up flows

### Client Utilities

- **User Management**: Functions and hooks for managing user state and authentication
- **Session Handling**: Tools for managing authentication sessions
- **Organization Management**: Utilities for handling multi-tenant organization access

### Server Utilities

- **Authentication Middleware**: Middleware for protecting routes and API endpoints
- **Token Verification**: Utilities for verifying authentication tokens
- **User Context**: Server-side access to user information

## Usage Guidelines

### Basic Setup

1. Add your Clerk API keys to your environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

2. Wrap your application with the AuthProvider:

```tsx
// In your root layout.tsx
import { AuthProvider } from '@repo/auth/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider
          privacyUrl="/privacy"
          termsUrl="/terms"
          helpUrl="/help"
        >
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

3. Protect your routes with the auth middleware:

```tsx
// In your middleware.ts
import { authMiddleware } from '@repo/auth';

export default authMiddleware({
  publicRoutes: ['/sign-in', '/sign-up', '/api/public'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### Client-Side Authentication

```tsx
'use client';

import { useUser, SignOutButton } from '@repo/auth/client';

export function UserProfile() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <SignOutButton />
    </div>
  );
}
```

### Server-Side Authentication

```tsx
import { auth } from '@repo/auth/server';

export async function GET(request: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Process authenticated request
  return Response.json({ userId });
}
```

### Custom API Authentication

```tsx
import { clerkAuthMiddleware } from '@repo/auth';

export async function POST(request: Request) {
  // Authenticate the request
  const authenticatedRequest = await clerkAuthMiddleware(request);
  
  // If authentication failed, authenticatedRequest will be a Response
  if (authenticatedRequest instanceof Response) {
    return authenticatedRequest;
  }
  
  // Access the authenticated user
  const { user } = authenticatedRequest;
  
  return Response.json({ userId: user.id });
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/auth
```

## Related Packages

The `@repo/auth` package is part of a suite of authentication-related packages:

- **@repo/auth-rbac**: Role-based access control system
- **@repo/auth-abac**: Attribute-based access control system
- **@repo/auth-hooks**: React hooks for authorization
- **@repo/auth-runner**: Runtime authorization evaluation engine
- **@repo/auth-log**: Logging system for authorization decisions

## Development Guidelines

### Adding Custom Themes

To customize the authentication UI theme:

```tsx
// Create a custom theme
const customTheme = {
  variables: {
    colorPrimary: 'var(--color-primary)',
    // Add more variables
  },
  elements: {
    formButtonPrimary: 'bg-primary text-primary-foreground',
    // Add more element styles
  },
};

// Use it in your AuthProvider
<AuthProvider appearance={{ baseTheme: customTheme }}>
  {children}
</AuthProvider>
```

### Environment Configuration

The package uses `@t3-oss/env-nextjs` for type-safe environment variable handling. To add new environment variables:

1. Update the `keys.ts` file with your new variables
2. Add proper Zod validation
3. Use the keys in your components or utilities

## Documentation References

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JOSE Documentation](https://github.com/panva/jose)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
