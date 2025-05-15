# Supabase Provider

## Overview
Supabase data provider for Zopio framework that implements the CRUD interface for Supabase platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers @supabase/supabase-js
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Supabase provider instance
const dataProvider = createDataProvider({
  type: 'supabase',
  config: {
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseKey: 'your-supabase-anon-key',
    tableMapping: {
      posts: 'posts', // Maps 'posts' resource to 'posts' Supabase table
      users: 'profiles' // Maps 'users' resource to 'profiles' Supabase table
    }
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
| `supabaseUrl` | `string` | Yes | Your Supabase project URL |
| `supabaseKey` | `string` | Yes | Your Supabase anonymous key |
| `tableMapping` | `Record<string, string>` | No | Maps resource names to Supabase table names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Supabase

The provider translates Zopio's data queries into Supabase queries using the Supabase JavaScript client. It supports:

- PostgreSQL full-text search
- RLS (Row Level Security) policies
- Real-time subscriptions (if configured)
- Complex filtering with multiple conditions
- Pagination with limit/offset
