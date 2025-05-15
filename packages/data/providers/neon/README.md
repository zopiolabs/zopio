# Neon Provider

## Overview
Neon serverless Postgres data provider for Zopio framework that implements the CRUD interface for Neon's serverless PostgreSQL database.

## Installation

```bash
# From your project root
npm install @repo/data-providers @neondatabase/serverless
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';
import { neonConfig } from '@neondatabase/serverless';

// Optional: Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

// Create a Neon provider instance
const dataProvider = createDataProvider({
  type: 'neon',
  config: {
    connectionString: 'postgresql://user:password@ep-example-123456.us-east-2.aws.neon.tech/neondb',
    // Optional table mapping
    tableMapping: {
      posts: 'blog_posts', // Maps 'posts' resource to 'blog_posts' table
      users: 'app_users' // Maps 'users' resource to 'app_users' table
    },
    // Optional schema name
    schema: 'public'
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'created_at', order: 'desc' },
  filter: { status: 'published' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `connectionString` | `string` | Yes | Neon PostgreSQL connection string |
| `tableMapping` | `Record<string, string>` | No | Maps resource names to database table names |
| `schema` | `string` | No | PostgreSQL schema name (defaults to 'public') |
| `poolConfig` | `object` | No | Connection pool configuration options |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Neon

The provider translates Zopio's data queries into SQL queries for Neon's serverless PostgreSQL, handling:

- Connection pooling optimized for serverless environments
- Pagination with LIMIT/OFFSET
- Filtering with WHERE clauses
- Sorting with ORDER BY
- Transactions for data integrity
- Edge-optimized connections for global deployments

## Serverless Considerations

When using Neon in serverless environments:

- Connection pooling is automatically optimized for serverless execution
- Cold starts are minimized with connection caching
- The provider handles reconnection logic for serverless function invocations
- Query timeouts are set appropriately for serverless execution contexts
