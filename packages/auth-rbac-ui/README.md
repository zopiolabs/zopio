# @zopio/auth-rbac-ui

This package provides frontend role-based access control (RBAC) components and hooks for Zopio applications. It integrates with the core `@zopio/auth-rbac` backend module.

## Features

- `usePermission(permission: string)`: Hook to check specific permission
- `useRole(role: string)`: Hook to check for roles
- `<Can access="perm">`: Conditionally render children by permission
- `<CanAny access={["perm1", "perm2"]} mode="permission|role">`: Conditional OR rendering

## Usage

```tsx
import { Can } from '@zopio/auth-rbac-ui';

<Can access="admin.dashboard.view">
  <Dashboard />
</Can>
```

Wrap your app with `AuthRbacProvider` to provide permission checking logic.
