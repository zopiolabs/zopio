# @repo/auth-policy

Lightweight policy engine for access control decisions in Zopio applications, integrated with Clerk authentication.

## Features

- Register rules for actions using simple async functions
- Context-aware policies combining roles and resources from Clerk
- Mockable with `allowAll`, `denyAll` helpers for testing
- Seamless integration with Clerk's user structure and roles

## Integration with Clerk

This package is designed to work with Clerk authentication. It uses the roles stored in Clerk's `publicMetadata.roles` field to make authorization decisions.

## Example

```ts
import { can, createPolicyUser } from '@repo/auth-policy';
import { currentUser } from '@repo/auth/server';

// In a server component or API route
async function checkAccess() {
  const clerkUser = await currentUser();
  const policyUser = createPolicyUser(clerkUser);
  
  const allowed = await can({
    user: policyUser,
    action: 'plugin.install',
    resource: { id: 'plugin-123' }
  });
  
  if (allowed) {
    // allow plugin installation
  }
}
```

## Adding New Policies

To add a new policy rule:

1. Create a new file in the `rules` directory
2. Implement your policy rule function
3. Register it in the `registry` object in `engine.ts`

```ts
// rules/myFeature.ts
import type { PolicyRule } from '../types';

export const canAccessMyFeature: PolicyRule = ({ user }) => {
  return user.roles.includes('admin') || user.roles.includes('developer');
};

// Then in engine.ts
const registry: PolicyRegistry = {
  'plugin.install': canInstallPlugin,
  'myFeature.access': canAccessMyFeature
};
```