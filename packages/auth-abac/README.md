# @repo/auth-abac

## Overview

The `@repo/auth-abac` package provides an attribute-based access control system for Zopio applications. It extends beyond simple role-based permissions by allowing access decisions based on attributes of the user, resource, action, and environment context. This enables highly dynamic and contextual permission rules that can adapt to complex business requirements.

## Module Categories

### Core Components

- **ABAC Rules Engine**: Evaluates permission rules based on attributes and conditions
- **Condition Builders**: Helper functions for creating common condition patterns
- **Rule Definitions**: Type-safe rule creation utilities

### Utilities

- **Type Definitions**: TypeScript types for ABAC rules, conditions, and contexts
- **Integration Helpers**: Tools for integrating with the broader auth ecosystem

## Usage Guidelines

### Basic Setup

1. Define your ABAC rules:

```tsx
// In your config/abac-rules.ts
import { defineAbacRules } from '@repo/auth-abac';

export const abacRules = defineAbacRules([
  {
    resource: 'documents',
    action: 'view',
    condition: (context, resource) => {
      // Allow if user is the owner
      return context.userId === resource.ownerId;
    },
  },
  {
    resource: 'projects',
    action: 'update',
    condition: (context, resource) => {
      // Allow if user is a member of the project's team
      return resource.teamMembers?.includes(context.userId) ?? false;
    },
  },
  {
    resource: 'invoices',
    action: 'approve',
    condition: (context, resource) => {
      // Only allow if invoice amount is within user's approval limit
      // and user is in the finance department
      return (
        context.department === 'finance' &&
        (resource.amount <= context.approvalLimit)
      );
    },
  },
]);
```

2. Use the ABAC rules with the auth-runner:

```tsx
// In your API route
import { evaluateAccess } from '@repo/auth-runner';

export async function POST(request: Request) {
  const { userId } = auth();
  const document = await getDocument(request.params.id);
  
  const result = evaluateAccess({
    context: {
      userId,
      role: 'user',
      tenantId: 'tenant-123',
      // Additional context attributes
      department: 'marketing',
    },
    resource: 'documents',
    action: 'edit',
    record: document,
  });
  
  if (!result.can) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Process authorized request
  return Response.json({ success: true });
}
```

### Using Condition Builders

```tsx
import { conditions } from '@repo/auth-abac';

const { isOwner, hasAttribute, inList } = conditions;

export const abacRules = defineAbacRules([
  {
    resource: 'documents',
    action: 'view',
    condition: isOwner('ownerId'),
  },
  {
    resource: 'projects',
    action: 'update',
    condition: inList('teamMembers', 'userId'),
  },
  {
    resource: 'settings',
    action: 'manage',
    condition: hasAttribute('role', ['admin', 'system-admin']),
  },
]);
```

### Combining RBAC and ABAC

```tsx
// In your auth-runner configuration
import { rules as rbacRules } from '@repo/auth-rbac';
import { abacRules } from './abac-rules';

// Combined rules are processed in order, with the first matching rule taking precedence
export const combinedRules = [...rbacRules, ...abacRules];
```

### Time-Based Access Control

```tsx
import { conditions } from '@repo/auth-abac';

const { duringBusinessHours } = conditions;

export const abacRules = defineAbacRules([
  {
    resource: 'admin-panel',
    action: 'access',
    condition: (context) => {
      return (
        context.role === 'admin' && 
        duringBusinessHours(new Date())
      );
    },
  },
]);
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/auth-abac
```

## Related Packages

The `@repo/auth-abac` package works with other authentication packages in the Zopio ecosystem:

- **@repo/auth**: Core authentication package
- **@repo/auth-rbac**: Role-based access control system
- **@repo/auth-hooks**: React hooks for authorization
- **@repo/auth-runner**: Runtime authorization evaluation engine
- **@repo/auth-log**: Logging system for authorization decisions

## Development Guidelines

### Creating Custom Conditions

To create reusable condition functions:

```tsx
// In your custom-conditions.ts
import type { ConditionFn } from '@repo/auth-abac';

export const hasMinimumAccountAge = (minDays: number): ConditionFn => {
  return (context) => {
    if (!context.accountCreatedAt) return false;
    
    const accountAge = Date.now() - new Date(context.accountCreatedAt).getTime();
    const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
    
    return daysSinceCreation >= minDays;
  };
};
```

### Testing ABAC Rules

```tsx
// In your test file
import { evaluateAccess } from '@repo/auth-runner';
import { abacRules } from './abac-rules';

describe('Document access rules', () => {
  test('Owner can view document', () => {
    const result = evaluateAccess({
      rules: abacRules,
      context: {
        userId: 'user-123',
        role: 'user',
        tenantId: 'tenant-456',
      },
      resource: 'documents',
      action: 'view',
      record: {
        id: 'doc-789',
        ownerId: 'user-123',
        title: 'Confidential Report',
      },
    });
    
    expect(result.can).toBe(true);
  });
  
  test('Non-owner cannot view document', () => {
    const result = evaluateAccess({
      rules: abacRules,
      context: {
        userId: 'user-456',
        role: 'user',
        tenantId: 'tenant-456',
      },
      resource: 'documents',
      action: 'view',
      record: {
        id: 'doc-789',
        ownerId: 'user-123',
        title: 'Confidential Report',
      },
    });
    
    expect(result.can).toBe(false);
  });
});
```

## Integration Examples

### With Next.js API Routes

```tsx
// app/api/documents/[id]/route.ts
import { auth } from '@repo/auth/server';
import { evaluateAccess } from '@repo/auth-runner';
import { prisma } from '@repo/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const document = await prisma.document.findUnique({
    where: { id: params.id },
  });
  
  if (!document) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Check if user has permission to view this document
  const result = evaluateAccess({
    context: {
      userId,
      role: 'user', // Get from user profile
      tenantId: 'tenant-123',
    },
    resource: 'documents',
    action: 'view',
    record: document,
  });
  
  if (!result.can) {
    return new Response('Forbidden', { status: 403 });
  }
  
  return Response.json(document);
}
```

### With React Client Components

```tsx
'use client';

import { useAccess } from '@repo/auth-hooks';
import { useUser } from '@repo/auth/client';

export function DocumentActions({ document }) {
  const { user } = useUser();
  
  const { can: canEdit } = useAccess({
    resource: 'documents',
    action: 'edit',
    record: document,
    context: {
      userId: user?.id,
      role: user?.role,
      tenantId: user?.tenantId,
    },
  });
  
  const { can: canDelete } = useAccess({
    resource: 'documents',
    action: 'delete',
    record: document,
    context: {
      userId: user?.id,
      role: user?.role,
      tenantId: user?.tenantId,
    },
  });
  
  return (
    <div className="flex gap-2">
      {canEdit && <button className="btn btn-primary">Edit</button>}
      {canDelete && <button className="btn btn-danger">Delete</button>}
    </div>
  );
}
```

## Documentation References

- [Attribute-Based Access Control (ABAC)](https://en.wikipedia.org/wiki/Attribute-based_access_control)
- [NIST Guide to ABAC](https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-162.pdf)
- [XACML Standard](https://en.wikipedia.org/wiki/XACML)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
