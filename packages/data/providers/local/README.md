# Local Provider

## Overview
Local storage data provider for Zopio framework that implements the CRUD interface using browser's localStorage or sessionStorage for client-side data persistence.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Local provider instance
const dataProvider = createDataProvider({
  type: 'local',
  config: {
    storageType: 'localStorage', // or 'sessionStorage'
    prefix: 'my-app', // Optional prefix for storage keys
    // Optional initial data
    initialData: {
      posts: [
        { id: 1, title: 'First Post', content: 'Content 1' },
        { id: 2, title: 'Second Post', content: 'Content 2' }
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
| `storageType` | `'localStorage'` or `'sessionStorage'` | No | Storage type to use (defaults to localStorage) |
| `prefix` | `string` | No | Prefix for storage keys to avoid conflicts |
| `initialData` | `Record<string, Record<string, any>[]>` | No | Initial data to populate if storage is empty |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Client-Side Features

The local provider is particularly useful for:

- Offline-first applications
- Progressive Web Apps (PWAs)
- Prototyping without a backend
- Storing user preferences and application state
- Caching data for improved performance

## Limitations

- Storage is limited by browser storage quotas (typically 5-10MB)
- Data is only available on the client device
- Not suitable for sensitive data without encryption
