# @repo/auth-hooks

React hooks for access control logic in the Zopio framework.

## Features

- `useCan()` hook for permission check
- `useHasRole()` and `usePermission()` hooks
- Lightweight and composable

## Usage

```tsx
import { useCan } from "@repo/auth-hooks";

const { can, loading } = useCan("post", "edit", "editor");

if (!can && !loading) {
  return <p>You do not have access.</p>;
}
```
