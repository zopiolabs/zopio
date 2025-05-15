# Prisma Provider

## Overview
Prisma ORM data provider for Zopio framework that implements the CRUD interface for Prisma-based databases.

## Installation

```bash
# From your project root
npm install @repo/data-providers @prisma/client
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Create a Prisma provider instance
const dataProvider = createDataProvider({
  type: 'prisma',
  config: {
    client: prisma,
    modelMapping: {
      posts: 'post', // Maps 'posts' resource to 'post' Prisma model
      users: 'user' // Maps 'users' resource to 'user' Prisma model
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'desc' },
  filter: { published: true }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `client` | `PrismaClient` | Yes | Initialized Prisma client instance |
| `modelMapping` | `Record<string, string>` | No | Maps resource names to Prisma model names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Prisma

The provider translates Zopio's data queries into Prisma queries, leveraging Prisma's type-safe query builder. It supports:

- Complex filtering with multiple conditions
- Pagination with skip/take
- Sorting by multiple fields
- Transactions (if configured)
- Relations and nested data structures
