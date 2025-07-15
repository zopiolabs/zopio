# @repo/auth-rbac

## Overview

The `@repo/auth-rbac` package provides a comprehensive role-based access control system for Zopio applications. It enables fine-grained permission management based on user roles, allowing you to control access to resources, actions, and fields throughout your application.

## Module Categories

### Core Components

- **Access Engine**: Core permission evaluation logic
- **Permission Rules**: Configurable rule definitions for resources and actions
- **Middleware**: Authorization middleware for Next.js routes and API endpoints

### Adapters

- **Clerk Adapter**: Integration with Clerk authentication for user roles and permissions

### Utilities

- **Type Definitions**: TypeScript types for permissions, rules, and context
- **Access Hooks**: React hooks for checking permissions in client components

## Usage Guidelines

### Basic Setup

1. Define your permission rules:

```tsx
// In your config/rules.ts
import { defineRules } from '@repo/auth-rbac';

export const rules = defineRules([
  {
    resource: 'posts',
    action: 'create',
    roles: ['admin', 'editor'],
  },
  {
    resource: 'posts',
    action: 'update',
    roles: ['admin', 'editor'],
    fields: {
      published: ['admin'],
    },
  },
  {
    resource: 'users',
    action: 'delete',
    roles: ['admin'],
  },
]);
```

2. Use the authorization middleware:

```tsx
// In your API route
import { withAuthorization } from '@repo/auth-rbac';

export const POST = withAuthorization({
  resource: 'posts',
  action: 'create',
})(async (req) => {
  // This code only runs if the user has permission
  return Response.json({ success: true });
});
```

### Client-Side Authorization

```tsx
'use client';

import { useAccess } from '@repo/auth-rbac';

export function AdminPanel() {
  const { can, loading } = useAccess({
    resource: 'users',
    action: 'manage',
  });
  
  if (loading) return <div>Checking permissions...</div>;
  
  if (!can) return <div>Access denied</div>;
  
  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin panel content */}
    </div>
  );
}
```

### Server-Side Authorization

```tsx
import { evaluateAccess } from '@repo/auth-rbac';

export async function GET(request: Request) {
  const result = evaluateAccess({
    rules: rules,
    context: {
      userId: 'user-123',
      role: 'editor',
      tenantId: 'tenant-456',
    },
    resource: 'posts',
    action: 'update',
    field: 'title',
  });
  
  if (!result.can) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Process authorized request
  return Response.json({ success: true });
}
```

### Field-Level Permissions

```tsx
'use client';

import { useAccess } from '@repo/auth-rbac';

export function PostEditor({ post }) {
  const { can: canUpdatePublished } = useAccess({
    resource: 'posts',
    action: 'update',
    field: 'published',
    record: post,
  });
  
  return (
    <form>
      <input name="title" defaultValue={post.title} />
      <textarea name="content" defaultValue={post.content} />
      
      {canUpdatePublished && (
        <div>
          <label>
            <input type="checkbox" name="published" defaultChecked={post.published} />
            Published
          </label>
        </div>
      )}
      
      <button type="submit">Save</button>
    </form>
  );
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/auth-rbac
```

## Related Packages

The `@repo/auth-rbac` package works with other authentication packages in the Zopio ecosystem:

- **@repo/auth**: Core authentication package
- **@repo/auth-abac**: Attribute-based access control system
- **@repo/auth-hooks**: React hooks for authorization
- **@repo/auth-runner**: Runtime authorization evaluation engine
- **@repo/auth-log**: Logging system for authorization decisions

## Development Guidelines

### Adding New Resources

To add a new resource type:

1. Update your rules configuration with the new resource
2. Add type definitions for the resource's actions
3. Implement any custom conditions if needed

### Creating Custom Adapters

To create a custom adapter for a different authentication provider:

1. Create a new adapter file in the `adapters` directory
2. Implement the required interface for extracting user roles and permissions
3. Export the adapter for use in your application

## Integration Examples

### With Next.js Middleware

```tsx
// middleware.ts
import { authMiddleware } from '@repo/auth';
import { withRbacProtection } from '@repo/auth-rbac/middleware';

// Combine auth and RBAC middleware
export default authMiddleware({
  publicRoutes: ['/sign-in', '/sign-up'],
  afterAuth: (auth, req) => {
    return withRbacProtection({
      protectedRoutes: [
        {
          path: '/admin/:path*',
          resource: 'admin',
          action: 'access',
        },
        {
          path: '/dashboard',
          resource: 'dashboard',
          action: 'view',
        },
      ],
    })(auth, req);
  },
});
```

### With Clerk Webhooks

```tsx
// app/api/webhooks/clerk/route.ts
import { clerkClient } from '@clerk/nextjs';
import { syncUserRoles } from '@repo/auth-rbac/adapters/clerk';

export async function POST(request: Request) {
  const payload = await request.json();
  
  // Process user creation or update events
  if (payload.type === 'user.created' || payload.type === 'user.updated') {
    await syncUserRoles(payload.data, clerkClient);
  }
  
  return new Response('Webhook processed', { status: 200 });
}
```

## Documentation References

- [Role-Based Access Control (RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Clerk Documentation](https://clerk.com/docs)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
