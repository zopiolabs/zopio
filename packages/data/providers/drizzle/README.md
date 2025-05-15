# Drizzle Provider

## Overview
Drizzle ORM data provider for Zopio framework that implements the CRUD interface for SQL databases using the Drizzle ORM.

## Installation

```bash
# From your project root
npm install @repo/data-providers drizzle-orm
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Import your Drizzle schema
import { posts, users } from './schema';

// Initialize Drizzle
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

// Create a Drizzle provider instance
const dataProvider = createDataProvider({
  type: 'drizzle',
  config: {
    db,
    schema: {
      posts,
      users
    },
    tableMapping: {
      posts: 'posts', // Maps 'posts' resource to 'posts' schema table
      users: 'users' // Maps 'users' resource to 'users' schema table
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
| `db` | `DrizzleInstance` | Yes | Initialized Drizzle instance |
| `schema` | `Record<string, Table>` | Yes | Drizzle schema tables |
| `tableMapping` | `Record<string, string>` | No | Maps resource names to schema table names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Drizzle

The provider translates Zopio's data queries into Drizzle queries, leveraging Drizzle's type-safe SQL query builder. It supports:

- Complex filtering with multiple conditions
- Pagination with offset/limit
- Sorting by multiple fields
- Transactions (if configured)
- Works with any SQL database supported by Drizzle (PostgreSQL, MySQL, SQLite)
