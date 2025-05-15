# JSON:API Data Provider

A data provider for Zopio that integrates with [JSON:API](https://jsonapi.org/) compliant endpoints for RESTful API operations.

## Features

- Complete integration with JSON:API compliant endpoints
- Support for all standard CRUD operations
- Automatic handling of JSON:API response structure
- Pagination, sorting, and filtering capabilities
- Customizable resource mapping
- Normalizes complex JSON:API responses with relationships

## Installation

```bash
pnpm add @repo/data-providers-jsonapi
```

## Usage

```typescript
import { createJsonApiProvider } from '@repo/data-providers-jsonapi';

const jsonapiProvider = createJsonApiProvider({
  apiUrl: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer your-token'  // Optional
  },
  resources: {
    posts: 'blog-posts'                   // Optional resource mapping
  }
});

// Get a list of posts with pagination, sorting, and filtering
const { data, total } = await jsonapiProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'desc' },
  filter: {
    title: 'javascript',
    status: 'published'
  }
});

// Get a single post by ID
const { data: post } = await jsonapiProvider.getOne({
  resource: 'posts',
  id: '123'
});

// Create a new post
const { data: newPost } = await jsonapiProvider.create({
  resource: 'posts',
  variables: {
    type: 'posts',
    attributes: {
      title: 'New Post',
      content: 'Post content',
      status: 'draft'
    }
  }
});

// Update a post
const { data: updatedPost } = await jsonapiProvider.update({
  resource: 'posts',
  id: '123',
  variables: {
    type: 'posts',
    attributes: {
      title: 'Updated Post Title',
      status: 'published'
    }
  }
});

// Delete a post
const { data } = await jsonapiProvider.deleteOne({
  resource: 'posts',
  id: '123'
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|--------------|
| `apiUrl` | string | Yes | Base URL of the JSON:API endpoint |
| `headers` | object | No | Headers to include in all requests |
| `resources` | object | No | Resource mapping to override default endpoint paths |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### JSON:API Specifics

This provider follows the [JSON:API specification](https://jsonapi.org/format/) and handles:

- Proper Content-Type headers (`application/vnd.api+json`)
- Standard JSON:API document structure
- Relationships and included resources
- Pagination using the standard JSON:API format
- Sorting using the standard JSON:API format
- Filtering using the standard JSON:API format

## License

MIT