# @zopio/auth-rbac

Role-Based Access Control (RBAC) utilities for Zopio Framework using CASL.

## Features

- CASL-based ability definitions
- Static and conditional role support
- Framework-agnostic (works with any auth provider)

## Usage

```ts
import { createAbilityFor } from '@zopio/auth-rbac';

const ability = createAbilityFor(user);
if (ability.can('read', 'Dashboard')) {
  // allow access
}
```