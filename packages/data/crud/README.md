# @repo/crud

A comprehensive CRUD (Create, Read, Update, Delete) operations package for Next.js route handlers in the Zopio framework. This package provides type-safe, reusable handlers for building RESTful APIs with proper error handling, validation, and extensibility.

## Features

- **Type-safe**: Full TypeScript support with generics for model types
- **Validation**: Built-in Zod schema validation
- **Extensible**: Hooks for pre-processing and post-processing data
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Pagination**: Built-in support for pagination, filtering, and sorting
- **Soft Delete**: Support for soft deletion of records

## Installation

```bash
pnpm add @repo/crud
```

## Usage Examples

### Creating a New Record

```ts
// app/api/users/route.ts
import { createHandler } from '@repo/crud';
import { prisma } from '@repo/database';
import { userSchema } from '@/schemas/user';

// Define a handler for creating users
export const POST = createHandler({
  model: prisma.user,
  schema: userSchema,
  beforeHook: (data, req) => {
    // Add additional fields or transform data before saving
    return {
      ...data,
      createdBy: req.headers.get('x-user-id') || 'anonymous',
    };
  },
  afterHook: (user) => {
    // Transform the response data
    const { password, ...rest } = user;
    return rest;
  },
});
```

### Reading a Single Record

```ts
// app/api/users/[id]/route.ts
import { readHandler } from '@repo/crud';
import { prisma } from '@repo/database';

// Define a handler for retrieving a single user
export const GET = readHandler({
  model: prisma.user,
  include: {
    posts: true,
    profile: true,
  },
  afterHook: (user) => {
    // Transform the response data
    const { password, ...rest } = user;
    return rest;
  },
});
```

### Reading Multiple Records with Pagination

```ts
// app/api/users/route.ts
import { readManyHandler } from '@repo/crud';
import { prisma } from '@repo/database';
import { parseBoolean } from '@repo/crud';

// Define a handler for retrieving multiple users with pagination
export const GET = readManyHandler({
  model: prisma.user,
  include: {
    profile: true,
  },
  defaultLimit: 20,
  maxLimit: 100,
  filterHook: (params) => {
    // Build filter conditions based on query parameters
    const filters = {};
    
    if (params.name) {
      filters.name = { contains: params.name };
    }
    
    if (params.role) {
      filters.role = params.role;
    }
    
    // Handle soft-deleted records
    if (!parseBoolean(params.includeDeleted)) {
      filters.deletedAt = null;
    }
    
    return filters;
  },
});
```

### Updating a Record

```ts
// app/api/users/[id]/route.ts
import { updateHandler } from '@repo/crud';
import { prisma } from '@repo/database';
import { userUpdateSchema } from '@/schemas/user';

// Define a handler for updating a user
export const PUT = updateHandler({
  model: prisma.user,
  schema: userUpdateSchema,
  beforeHook: (data, req) => {
    // Add additional fields or transform data before saving
    return {
      ...data,
      updatedBy: req.headers.get('x-user-id') || 'anonymous',
      updatedAt: new Date(),
    };
  },
});
```

### Deleting a Record

```ts
// app/api/users/[id]/route.ts
import { deleteHandler } from '@repo/crud';
import { prisma } from '@repo/database';

// Define a handler for deleting a user (soft delete)
export const DELETE = deleteHandler({
  model: prisma.user,
  softDelete: true, // Use soft deletion instead of hard deletion
});
```

## Advanced Usage

### Custom Validation

```ts
// schemas/user.ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']).default('user'),
});

export const userUpdateSchema = userSchema.partial().omit({ password: true });
```

### Custom Error Handling

You can wrap the handlers with your own error handling middleware:

```ts
// middleware/errorHandler.ts
import { NextRequest } from 'next/server';

export function withErrorLogging(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);
      return Response.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}

// Usage
import { createHandler } from '@repo/crud';
import { withErrorLogging } from '@/middleware/errorHandler';

export const POST = withErrorLogging(
  createHandler({
    model: prisma.user,
    schema: userSchema,
  })
);
```

## API Reference

### Handlers

- `createHandler`: Creates a handler for POST requests to create new records
- `readHandler`: Creates a handler for GET requests to retrieve a single record by ID
- `readManyHandler`: Creates a handler for GET requests to retrieve multiple records with pagination
- `updateHandler`: Creates a handler for PUT requests to update existing records
- `deleteHandler`: Creates a handler for DELETE requests to delete records

### Utilities

- `validateInput`: Validates input data against a Zod schema
- `formatZodErrors`: Formats Zod validation errors into a readable string
- `createSoftDeleteFilter`: Creates a filter function for soft-deleted records
- `parseBoolean`: Parses a string to a boolean value
- `parseNumber`: Parses a string to a number value
- `createResponse`: Creates a standard response object

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
