# Kysely Provider

## Overview
Kysely SQL query builder data provider for Zopio framework that implements the CRUD interface for SQL databases using the Kysely query builder.

## Installation

```bash
# From your project root
npm install @repo/data-providers kysely
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Define your database interface
interface Database {
  posts: {
    id: number;
    title: string;
    content: string;
    created_at: Date;
  };
  users: {
    id: number;
    name: string;
    email: string;
  };
}

// Initialize Kysely
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL
    })
  })
});

// Create a Kysely provider instance
const dataProvider = createDataProvider({
  type: 'kysely',
  config: {
    db,
    tableMapping: {
      posts: 'posts', // Maps 'posts' resource to 'posts' database table
      users: 'users' // Maps 'users' resource to 'users' database table
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'created_at', order: 'desc' },
  filter: { title: { operator: 'contains', value: 'Kysely' } }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `db` | `Kysely<any>` | Yes | Initialized Kysely instance |
| `tableMapping` | `Record<string, string>` | No | Maps resource names to database table names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Kysely

The provider translates Zopio's data queries into Kysely queries, leveraging Kysely's type-safe SQL query builder. It supports:

- Complex filtering with multiple conditions
- Pagination with offset/limit
- Sorting by multiple fields
- Transactions (if configured)
- Works with any SQL database supported by Kysely (PostgreSQL, MySQL, SQLite)
