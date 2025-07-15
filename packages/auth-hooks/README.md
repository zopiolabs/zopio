# @repo/auth-hooks

## Overview

The `@repo/auth-hooks` package provides a collection of React hooks for integrating authorization into client components. These hooks make it easy to implement permission checks in your UI, enabling dynamic rendering based on user permissions and access rights.

## Module Categories

### Core Hooks

- **useAccess**: Primary hook for checking permissions based on resource, action, and context
- **usePermission**: Simplified hook for basic permission checks
- **useFieldAccess**: Hook for field-level permission checks

### Utilities

- **Type Definitions**: TypeScript types for hook parameters and return values
- **Context Providers**: React context providers for authorization state

## Usage Guidelines

### Basic Permission Checks

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';
import { useUser } from '@repo/auth/client';

export function AdminPanel() {
  const { user } = useUser();
  const { can, loading, reason } = useAccess({
    resource: 'admin',
    action: 'access',
    context: {
      userId: user?.id,
      role: user?.role || 'user',
      tenantId: user?.tenantId,
    },
  });
  
  if (loading) return <div>Checking permissions...</div>;
  
  if (!can) {
    return (
      <div className="text-red-500">
        Access denied: {reason || 'Insufficient permissions'}
      </div>
    );
  }
  
  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin panel content */}
    </div>
  );
}
```

### Conditional Rendering

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';

export function DataTable({ data }) {
  const { can: canCreate } = useAccess({
    resource: 'records',
    action: 'create',
  });
  
  const { can: canExport } = useAccess({
    resource: 'records',
    action: 'export',
  });
  
  return (
    <div>
      <div className="flex justify-between">
        <h2>Records</h2>
        <div className="flex gap-2">
          {canCreate && (
            <button className="btn btn-primary">Create New</button>
          )}
          {canExport && (
            <button className="btn btn-secondary">Export</button>
          )}
        </div>
      </div>
      
      <table>{/* Table content */}</table>
    </div>
  );
}
```

### Field-Level Access Control

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';

export function UserForm({ user, onSubmit }) {
  const { can: canEditRole } = useAccess({
    resource: 'users',
    action: 'update',
    field: 'role',
    record: user,
  });
  
  const { can: canEditBilling } = useAccess({
    resource: 'users',
    action: 'update',
    field: 'billingInfo',
    record: user,
  });
  
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Name</label>
        <input name="name" defaultValue={user.name} />
      </div>
      
      {canEditRole && (
        <div>
          <label>Role</label>
          <select name="role" defaultValue={user.role}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      )}
      
      {canEditBilling && (
        <fieldset>
          <legend>Billing Information</legend>
          {/* Billing fields */}
        </fieldset>
      )}
      
      <button type="submit">Save</button>
    </form>
  );
}
```

### With Custom Context

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';
import { useUser } from '@repo/auth/client';

export function ProjectActions({ project }) {
  const { user } = useUser();
  
  // Include additional context attributes beyond the standard ones
  const { can: canManage } = useAccess({
    resource: 'projects',
    action: 'manage',
    record: project,
    context: {
      userId: user?.id,
      role: user?.role || 'user',
      tenantId: user?.tenantId,
      // Additional context attributes
      department: user?.department,
      isProjectMember: project.members.includes(user?.id),
      isProjectOwner: project.ownerId === user?.id,
    },
  });
  
  return (
    <div>
      {canManage && (
        <button className="btn btn-primary">Manage Project</button>
      )}
    </div>
  );
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/auth-hooks
```

## Related Packages

The `@repo/auth-hooks` package works with other authentication packages in the Zopio ecosystem:

- **@repo/auth**: Core authentication package
- **@repo/auth-rbac**: Role-based access control system
- **@repo/auth-abac**: Attribute-based access control system
- **@repo/auth-runner**: Runtime authorization evaluation engine
- **@repo/auth-log**: Logging system for authorization decisions

## Development Guidelines

### Creating Custom Hooks

To create custom authorization hooks:

```tsx
import { useAccess } from '@repo/auth-hooks';
import { useUser } from '@repo/auth/client';

export function useProjectAccess(project, action) {
  const { user } = useUser();
  
  return useAccess({
    resource: 'projects',
    action,
    record: project,
    context: {
      userId: user?.id,
      role: user?.role || 'user',
      tenantId: user?.tenantId,
      isProjectMember: project?.members?.includes(user?.id) ?? false,
      isProjectOwner: project?.ownerId === user?.id,
    },
  });
}
```

### Performance Optimization

For performance-sensitive components:

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';
import { useMemo } from 'react';

export function DataGrid({ data }) {
  // Batch permission checks to reduce evaluations
  const permissions = useAccess([
    { resource: 'data', action: 'create' },
    { resource: 'data', action: 'update' },
    { resource: 'data', action: 'delete' },
    { resource: 'data', action: 'export' },
  ]);
  
  // Memoize permissions to prevent unnecessary re-renders
  const { canCreate, canUpdate, canDelete, canExport } = useMemo(() => ({
    canCreate: permissions[0].can,
    canUpdate: permissions[1].can,
    canDelete: permissions[2].can,
    canExport: permissions[3].can,
  }), [permissions]);
  
  return (
    <div>
      {/* Use permissions for rendering */}
    </div>
  );
}
```

## Integration Examples

### With Next.js App Router

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';
import { useUser } from '@repo/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const { can, loading } = useAccess({
    resource: 'protected-page',
    action: 'view',
    context: {
      userId: user?.id,
      role: user?.role || 'user',
      tenantId: user?.tenantId,
    },
  });
  
  useEffect(() => {
    // Redirect if user doesn't have permission
    if (isLoaded && !loading && !can) {
      router.push('/access-denied');
    }
  }, [can, isLoaded, loading, router]);
  
  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }
  
  if (!can) {
    return null; // Will redirect in the effect
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      {/* Protected page content */}
    </div>
  );
}
```

### With Form Libraries

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(10),
  published: z.boolean(),
});

export function PostForm({ post, onSubmit }) {
  const { can: canPublish } = useAccess({
    resource: 'posts',
    action: 'publish',
  });
  
  // Dynamically modify the schema based on permissions
  const schema = canPublish 
    ? formSchema 
    : formSchema.omit({ published: true });
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: post,
  });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      
      {canPublish && (
        <div>
          <label>
            <input type="checkbox" {...form.register('published')} />
            Publish immediately
          </label>
        </div>
      )}
      
      <button type="submit">Save</button>
    </form>
  );
}
```

## Documentation References

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [React Context API](https://react.dev/reference/react/useContext)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
