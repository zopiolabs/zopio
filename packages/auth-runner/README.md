# @repo/auth-runner

## Overview

The `@repo/auth-runner` package serves as the unified runtime evaluation engine for Zopio's authorization system. It combines role-based access control (RBAC) and attribute-based access control (ABAC) into a single, consistent evaluation mechanism that can be used across both client and server environments.

## Module Categories

### Core Components

- **Evaluation Engine**: Central logic for evaluating access permissions
- **Rule Combination**: System for merging RBAC and ABAC rules
- **Logging Integration**: Automatic logging of access decisions

### Exports

- **evaluateAccess**: Main function for checking permissions
- **Engine Submodule**: Low-level evaluation utilities
- **Rules Submodule**: Combined rule definitions

## Usage Guidelines

### Basic Usage

```tsx
import { evaluateAccess } from '@repo/auth-runner';

// Check if a user has permission
const result = evaluateAccess({
  context: {
    userId: 'user-123',
    role: 'editor',
    tenantId: 'tenant-456',
    // Additional context attributes can be included
  },
  resource: 'documents',
  action: 'edit',
  record: {
    id: 'doc-789',
    ownerId: 'user-123',
    title: 'Project Proposal',
  },
  field: 'content', // Optional field-level check
});

if (result.can) {
  // User has permission
  console.log('Access granted');
} else {
  // User does not have permission
  console.log(`Access denied: ${result.reason}`);
}
```

### Server-Side Integration

```tsx
// In your API route
import { auth } from '@repo/auth/server';
import { evaluateAccess } from '@repo/auth-runner';
import { prisma } from '@repo/db';

export async function PUT(
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
  
  // Get user details for context
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, tenantId: true },
  });
  
  // Check if user has permission to edit this document
  const result = evaluateAccess({
    context: {
      userId,
      role: user?.role || 'user',
      tenantId: user?.tenantId || '',
    },
    resource: 'documents',
    action: 'edit',
    record: document,
  });
  
  if (!result.can) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Process the update
  const data = await request.json();
  const updatedDocument = await prisma.document.update({
    where: { id: params.id },
    data,
  });
  
  return Response.json(updatedDocument);
}
```

### Client-Side Integration

```tsx
'use client';

import { useUser } from '@repo/auth/client';
import { useAccess } from '@repo/auth-hooks';

export function DocumentEditor({ document }) {
  const { user } = useUser();
  
  // The useAccess hook internally uses evaluateAccess from auth-runner
  const { can, loading } = useAccess({
    resource: 'documents',
    action: 'edit',
    record: document,
    context: {
      userId: user?.id,
      role: user?.role || 'user',
      tenantId: user?.tenantId || '',
    },
  });
  
  if (loading) return <div>Checking permissions...</div>;
  
  if (!can) {
    return <div>You don't have permission to edit this document.</div>;
  }
  
  return (
    <div>
      <h1>Edit Document</h1>
      {/* Editor form */}
    </div>
  );
}
```

### Custom Rule Sets

```tsx
import { evaluateAccess } from '@repo/auth-runner/engine/evaluate';
import { myCustomRules } from './my-custom-rules';

// Use the lower-level engine directly with custom rules
const result = evaluateAccess({
  rules: myCustomRules,
  context: {
    userId: 'user-123',
    role: 'editor',
    tenantId: 'tenant-456',
  },
  resource: 'documents',
  action: 'edit',
  record: {
    id: 'doc-789',
    ownerId: 'user-123',
  },
});
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/auth-runner
```

## Related Packages

The `@repo/auth-runner` package works with other authentication packages in the Zopio ecosystem:

- **@repo/auth**: Core authentication package
- **@repo/auth-rbac**: Role-based access control system
- **@repo/auth-abac**: Attribute-based access control system
- **@repo/auth-hooks**: React hooks for authorization
- **@repo/auth-log**: Logging system for authorization decisions

## Development Guidelines

### Adding Custom Rule Types

To extend the rule evaluation system with custom rule types:

1. Define your custom rule type in a new file
2. Implement the evaluation logic for your rule type
3. Add your rules to the combined rules array

```tsx
// In your custom-rules.ts
import type { AccessRule } from '@repo/auth-rbac/types';

export const myCustomRules: AccessRule[] = [
  // Your custom rules
];

// In your combined-rules.ts
import { rules as rbacRules } from '@repo/auth-rbac';
import { abacRules } from '@repo/auth-abac';
import { myCustomRules } from './custom-rules';

export const combinedRules = [...rbacRules, ...abacRules, ...myCustomRules];
```

### Testing Authorization Logic

```tsx
// In your test file
import { evaluateAccess } from '@repo/auth-runner';

describe('Document access control', () => {
  test('Document owner can edit their document', () => {
    const result = evaluateAccess({
      context: {
        userId: 'user-123',
        role: 'user',
        tenantId: 'tenant-456',
      },
      resource: 'documents',
      action: 'edit',
      record: {
        id: 'doc-789',
        ownerId: 'user-123',
        title: 'My Document',
      },
    });
    
    expect(result.can).toBe(true);
  });
  
  test('Non-owner cannot edit document', () => {
    const result = evaluateAccess({
      context: {
        userId: 'user-456',
        role: 'user',
        tenantId: 'tenant-456',
      },
      resource: 'documents',
      action: 'edit',
      record: {
        id: 'doc-789',
        ownerId: 'user-123',
        title: 'My Document',
      },
    });
    
    expect(result.can).toBe(false);
  });
  
  test('Admin can edit any document', () => {
    const result = evaluateAccess({
      context: {
        userId: 'user-456',
        role: 'admin',
        tenantId: 'tenant-456',
      },
      resource: 'documents',
      action: 'edit',
      record: {
        id: 'doc-789',
        ownerId: 'user-123',
        title: 'My Document',
      },
    });
    
    expect(result.can).toBe(true);
  });
});
```

## Integration Examples

### With Middleware

```tsx
// In your middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { evaluateAccess } from '@repo/auth-runner';

export async function middleware(request) {
  const { userId, user } = auth();
  
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // Check if user has access to the admin section
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const result = evaluateAccess({
      context: {
        userId,
        role: user?.role || 'user',
        tenantId: user?.tenantId || '',
      },
      resource: 'admin',
      action: 'access',
    });
    
    if (!result.can) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### With API Endpoints

```tsx
// In your API handler
import { createApiHandler } from '@repo/api';
import { auth } from '@repo/auth/server';
import { evaluateAccess } from '@repo/auth-runner';

export const handler = createApiHandler({
  beforeHandle: async (req) => {
    const { userId, user } = auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }
    
    const result = evaluateAccess({
      context: {
        userId,
        role: user?.role || 'user',
        tenantId: user?.tenantId || '',
      },
      resource: 'api',
      action: 'access',
      // Additional context can be included
      record: {
        endpoint: req.url,
        method: req.method,
      },
    });
    
    if (!result.can) {
      throw new Error(`Forbidden: ${result.reason}`);
    }
  },
  
  handle: async (req) => {
    // Process the request
    return { success: true };
  },
});
```

## Documentation References

- [Access Control Models](https://csrc.nist.gov/projects/access-control-policy-and-implementation-guides)
- [NIST Guide to ABAC](https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-162.pdf)
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
