# Mock Provider

## Overview
Mock data provider for Zopio framework that implements the CRUD interface with in-memory data storage for testing and development purposes.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Mock provider instance
const dataProvider = createDataProvider({
  type: 'mock',
  config: {
    // Optional initial data
    initialData: {
      posts: [
        { id: 1, title: 'First Post', content: 'Content 1' },
        { id: 2, title: 'Second Post', content: 'Content 2' }
      ],
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' }
      ]
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'title', order: 'asc' },
  filter: { title: 'First' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `initialData` | `Record<string, Record<string, any>[]>` | No | Initial data to populate the mock database |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Testing Features

The mock provider is particularly useful for:

- Unit testing without external dependencies
- Rapid prototyping without setting up a backend
- Offline development
- Demonstrating UI components with consistent test data
