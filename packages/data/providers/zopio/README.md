# Zopio Provider

## Overview
Zopio native data provider for Zopio framework that implements the CRUD interface for Zopio's internal data services.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Zopio provider instance
const dataProvider = createDataProvider({
  type: 'zopio',
  config: {
    projectId: 'your-zopio-project-id',
    // Optional environment
    environment: 'development', // or 'production', 'staging', etc.
    // Optional resource mapping
    resourceMapping: {
      posts: 'content.posts' // Maps 'posts' resource to 'content.posts' Zopio resource
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
| `projectId` | `string` | Yes | Your Zopio project ID |
| `environment` | `string` | No | Environment to use (defaults to 'development') |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to Zopio resource paths |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Integration with Zopio

The provider directly integrates with Zopio's internal data services, providing:

- Seamless access to Zopio's data layer
- Automatic handling of authentication and authorization
- Real-time data synchronization
- Built-in caching and optimistic updates
- Support for complex data relationships
