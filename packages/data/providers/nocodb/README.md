# NocoDB Provider

## Overview
NocoDB data provider for Zopio framework that implements the CRUD interface for NocoDB API.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a NocoDB provider instance
const dataProvider = createDataProvider({
  type: 'nocodb',
  config: {
    apiUrl: 'https://your-nocodb-instance.com',
    apiKey: 'your-nocodb-api-key',
    projectId: 'your-project-id', // Optional
    tableMapping: {
      posts: 'tblPosts', // Maps 'posts' resource to 'tblPosts' NocoDB table
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
| `apiUrl` | `string` | Yes | URL of your NocoDB instance |
| `apiKey` | `string` | Yes | Your NocoDB API key |
| `projectId` | `string` | No | The ID of your NocoDB project |
| `tableMapping` | `Record<string, string>` | No | Maps resource names to NocoDB table names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with NocoDB

The provider translates Zopio's data queries into NocoDB API calls, handling pagination, filtering, and sorting according to NocoDB's API specifications. The implementation supports advanced filtering operations and proper pagination through the NocoDB REST API.
