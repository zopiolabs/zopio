# Authentication Package

This package provides authentication capabilities for the Zopio application using [Clerk](https://clerk.com/).

## Overview

The authentication system is built around Clerk, which provides a complete authentication and user management solution that integrates seamlessly with Next.js applications.

## Components

- **AuthProvider**: A wrapper around Clerk's `ClerkProvider` that includes theme support and customization options.
- **SignIn/SignUp Components**: Pre-built components for authentication flows.
- **Server Utilities**: Functions for server-side authentication checks and user data access.

## Integration with Other Packages

The authentication system integrates with two other packages:

1. **auth-policy**: Provides policy-based authorization using user roles from Clerk.
2. **auth-rbac**: Provides role-based access control using CASL.

## Usage

### Client-side

```tsx
import { useUser, SignedIn, SignedOut } from '@repo/auth/client';

const MyComponent = () => {
  const { user } = useUser();
  
  return (
    <>
      <SignedIn>
        <p>Welcome, {user.firstName}!</p>
      </SignedIn>
      <SignedOut>
        <p>Please sign in</p>
      </SignedOut>
    </>
  );
};
```

### Server-side

```tsx
import { auth, currentUser, getUserRoles } from '@repo/auth/server';

const ServerComponent = async () => {
  const user = await currentUser();
  const roles = getUserRoles(user);
  
  if (!user) {
    // Handle unauthenticated user
  }
  
  return <div>Hello, {user.firstName}!</div>;
};
```

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: URL for sign in page (e.g., "/sign-in")
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: URL for sign up page (e.g., "/sign-up")
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: Redirect URL after sign in (e.g., "/dashboard")
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Redirect URL after sign up (e.g., "/onboarding")
- `CLERK_WEBHOOK_SECRET`: Secret for Clerk webhooks (optional)
