# Xata Provider

## Overview
Xata data provider for Zopio framework that implements the CRUD interface for Xata serverless database platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers @xata.io/client
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Xata provider instance
const dataProvider = createDataProvider({
  type: 'xata',
  config: {
    apiKey: 'your-xata-api-key',
    databaseURL: 'https://your-workspace-slug.xata.sh/db/your-database',
    // Optional table mapping
    tableMapping: {
      posts: 'posts', // Maps 'posts' resource to 'posts' Xata table
      users: 'users' // Maps 'users' resource to 'users' Xata table
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
| `apiKey` | `string` | Yes | Your Xata API key |
| `databaseURL` | `string` | Yes | URL of your Xata database |
| `tableMapping` | `Record<string, string>` | No | Maps resource names to Xata table names |
| `branch` | `string` | No | Xata branch name (defaults to 'main') |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Xata

The provider translates Zopio's data queries into Xata API calls, handling:

- Authentication with API key
- Pagination with offset/limit
- Filtering with Xata filter expressions
- Sorting by any column
- Full-text search capabilities
- File attachments and rich data types

## Xata-Specific Features

- Support for Xata's vector search
- Handling of Xata's schema and migrations
- Support for Xata's data types (including JSON, arrays, and files)
- Optimized for edge deployments
- Automatic handling of Xata's record versioning
- Support for transactions and bulk operations
