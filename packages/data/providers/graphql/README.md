# GraphQL Provider

## Overview
GraphQL data provider for Zopio framework that implements the CRUD interface for GraphQL APIs.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a GraphQL provider instance
const dataProvider = createDataProvider({
  type: 'graphql',
  config: {
    endpoint: 'https://api.example.com/graphql',
    // Optional custom headers
    headers: {
      'Authorization': 'Bearer your-token'
    },
    // Optional custom query mapping
    queryMapping: {
      getList: {
        posts: `
          query GetPosts($page: Int!, $perPage: Int!, $sortField: String, $sortOrder: String, $filter: PostFilter) {
            posts(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
              data {
                id
                title
                content
                createdAt
              }
              total
            }
          }
        `
      }
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
| `endpoint` | `string` | Yes | GraphQL API endpoint URL |
| `headers` | `Record<string, string>` | No | Custom HTTP headers to include with requests |
| `queryMapping` | `Record<string, Record<string, string>>` | No | Custom GraphQL queries for specific operations and resources |
| `httpClient` | `Function` | No | Custom HTTP client function (defaults to fetch) |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Executes a query to fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Executes a query to fetch a single resource by ID
- `create`: Executes a mutation to create a new resource
- `update`: Executes a mutation to update an existing resource
- `deleteOne`: Executes a mutation to delete a resource by ID

## GraphQL API Conventions

The provider follows these GraphQL API conventions:

- Uses queries for read operations and mutations for write operations
- Supports variables for pagination, sorting, and filtering
- Expects a standardized response format with data and metadata
- Handles nested data structures
- Supports custom query and mutation definitions for each resource and operation
