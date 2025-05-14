# Auth Core

Core authentication utilities that integrate all auth modules while allowing developers to use only what they need.

## Overview

The `@repo/auth-core` package provides a standardized interface for working with authentication and authorization across Zopio applications. It serves as a bridge between the basic authentication functionality and more advanced authorization features.

## Key Features

- Standardized user representation with roles, permissions, and metadata
- Core utility functions for common auth checks
- Seamless integration with other auth modules

## Usage

### Basic Usage

For basic authentication with role-based access control:

```typescript
import { createAuthUser, hasRole } from '@repo/auth-core';
import { currentUser } from '@repo/auth/server';
import { createAbilityFromRoles } from '@repo/auth-rbac';

// In a server component or API route
async function checkAccess() {
  const clerkUser = await currentUser();
  const authUser = createAuthUser(clerkUser);
  
  // Simple role check
  if (hasRole(authUser, 'admin')) {
    // Allow admin access
  }
  
  // RBAC check using auth-rbac
  const ability = createAbilityFromRoles(authUser.id, authUser.roles);
  if (ability.can('manage', 'User')) {
    // Allow user management
  }
}
```

### Advanced Usage

For more advanced authorization with policy-based access control:

```typescript
import { createAuthUser, hasPermission } from '@repo/auth-core';
import { currentUser } from '@repo/auth/server';
import { can, createPolicyUser } from '@repo/auth-policy';

// In a server component or API route
async function checkAdvancedAccess() {
  const clerkUser = await currentUser();
  const authUser = createAuthUser(clerkUser);
  
  // Permission check
  if (hasPermission(authUser, 'users.manage')) {
    // Allow user management
  }
  
  // Policy-based check
  const policyUser = createPolicyUser(clerkUser);
  const canManageUsers = await can({
    user: policyUser,
    action: 'users.manage',
    resource: 'user',
    context: { organizationId: authUser.organizationId }
  });
  
  if (canManageUsers) {
    // Allow user management
  }
}
```

## Integration with Other Auth Modules

- `@repo/auth`: Base authentication with Clerk
- `@repo/auth-rbac`: Role-based access control using CASL
- `@repo/auth-policy`: Policy-based authorization
- `@repo/auth-hooks`: React hooks for auth checks
- `@repo/auth-ui`: UI components for auth flows
