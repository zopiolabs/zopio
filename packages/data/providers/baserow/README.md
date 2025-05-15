# Baserow Provider

## Overview
Baserow data provider for Zopio framework that implements the CRUD interface for Baserow API.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Baserow provider instance
const dataProvider = createDataProvider({
  type: 'baserow',
  config: {
    apiUrl: 'https://api.baserow.io',
    token: 'your-baserow-token',
    tableMapping: {
      posts: { databaseId: '123', tableId: '456' }
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'desc' },
  filter: { status: 'published' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | `string` | Yes | URL of the Baserow API |
| `token` | `string` | Yes | Your Baserow authentication token |
| `tableMapping` | `Record<string, { databaseId: string, tableId: string }>` | Yes | Maps resource names to Baserow database and table IDs |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Baserow

The provider translates Zopio's data queries into Baserow API calls, handling pagination, filtering, and sorting according to Baserow's API specifications.
