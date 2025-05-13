# @zopio/auth-rbac

Role-Based Access Control (RBAC) utilities using CASL, integrated with Clerk authentication.

## Features

- CASL-based ability definitions
- Static and conditional role support
- Seamless integration with Clerk authentication
- Support for role-based permissions from Clerk's user metadata

## Integration with Clerk

This package is designed to work with Clerk authentication. It uses the roles stored in Clerk's `publicMetadata.roles` field to determine user permissions based on predefined role abilities.

## Available Roles

The following roles are defined in the system:

- `guest`: Basic read access to public resources
- `user`: Standard user permissions for personal resources
- `developer`: Extended permissions for development features
- `admin`: Full system access

## Usage with Clerk

```tsx
import { createAbilityFor } from '@zopio/auth-rbac';
import { currentUser } from '@repo/auth/server';

// In a server component
async function ProtectedComponent() {
  const user = await currentUser();
  
  // Create ability instance based on Clerk user
  const ability = createAbilityFor(user);
  
  // Check permissions
  const canManageUsers = ability.can('read', 'User');
  const canAccessDashboard = ability.can('read', 'Dashboard');
  
  return (
    <div>
      {canAccessDashboard && <DashboardComponent />}
      {canManageUsers && <UserManagementComponent />}
    </div>
  );
}
```

## Adding New Permissions

To add new permissions, update the `roles.ts` file with new subjects and role abilities:

```ts
// Add new subject type
export type Subjects = 
  | 'Dashboard'
  | 'Profile'
  | 'NewFeature'  // New subject
  | 'all';

// Add permissions for roles
export const roleAbilities = {
  user: [
    // Existing permissions...
    { action: 'read', subject: 'NewFeature' }
  ],
  admin: [
    { action: 'manage', subject: 'all' }
  ]
};
```