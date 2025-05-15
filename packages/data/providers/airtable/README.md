# Airtable Provider

## Overview
Airtable data provider for Zopio framework that implements the CRUD interface for Airtable API.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create an Airtable provider instance
const dataProvider = createDataProvider({
  type: 'airtable',
  config: {
    apiKey: 'your-airtable-api-key',
    baseId: 'your-airtable-base-id',
    tableMapping: {
      posts: 'tblPosts', // Maps 'posts' resource to 'tblPosts' Airtable table
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
| `apiKey` | `string` | Yes | Your Airtable API key |
| `baseId` | `string` | Yes | The ID of your Airtable base |
| `tableMapping` | `Record<string, string>` | No | Maps resource names to Airtable table names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Integration with Airtable

The provider translates Zopio's data queries into Airtable API calls, handling pagination, filtering, and sorting according to Airtable's API specifications.
