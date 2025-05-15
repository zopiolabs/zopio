# REST Provider

## Overview
REST API data provider for Zopio framework that implements the CRUD interface for standard REST APIs.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a REST provider instance
const dataProvider = createDataProvider({
  type: 'rest',
  config: {
    apiUrl: 'https://api.example.com',
    // Optional custom headers
    headers: {
      'Authorization': 'Bearer your-token'
    },
    // Optional resource mapping
    resourceMapping: {
      posts: 'articles' // Maps 'posts' resource to '/articles' endpoint
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
| `apiUrl` | `string` | Yes | Base URL of the REST API |
| `headers` | `Record<string, string>` | No | Custom HTTP headers to include with requests |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to API endpoint paths |
| `httpClient` | `Function` | No | Custom HTTP client function (defaults to fetch) |

## Methods

This provider implements the standard CRUD interface:

- `getList`: GET /[resource]?[query_params] - Retrieve a list of resources
- `getOne`: GET /[resource]/[id] - Retrieve a single resource by ID
- `create`: POST /[resource] - Create a new resource
- `update`: PUT /[resource]/[id] - Update an existing resource
- `deleteOne`: DELETE /[resource]/[id] - Delete a resource by ID

## REST API Conventions

The provider follows these REST API conventions:

- Uses standard HTTP methods (GET, POST, PUT, DELETE)
- Expects pagination information in query parameters
- Supports filtering via query parameters
- Expects total count in response headers or response body
- Handles JSON request and response bodies
