# PayloadCMS Client Provider

A data provider for Zopio that integrates with PayloadCMS (https://github.com/payloadcms/payload) for RESTful API endpoints.

## Features

- Complete integration with PayloadCMS API endpoints
- Support for all standard CRUD operations
- Pagination, sorting, and filtering capabilities
- Automatic handling of PayloadCMS's data structure
- Support for relationships via depth parameter
- Customizable resource paths
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-payload
```

## Usage

```typescript
import { createPayloadCMSClientProvider } from '@repo/data-providers-payload';

const payloadProvider = createPayloadCMSClientProvider({
  apiUrl: 'https://your-payloadcms-api.com',
  authToken: 'your-jwt-token', // Optional
  customHeaders: {
    'X-Custom-Header': 'value'  // Optional
  },
  resources: {
    posts: 'blog-posts'         // Optional resource path mapping
  }
});

// Get a list of posts with pagination, sorting, and filtering
const { data, total } = await payloadProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'publishedAt', order: 'desc' },
  filter: {
    title: { $contains: 'javascript' },
    status: { $eq: 'published' }
  }
});

// Get a single post by ID
const { data: post } = await payloadProvider.getOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});

// Create a new post
const { data: newPost } = await payloadProvider.create({
  resource: 'posts',
  variables: {
    title: 'New Post',
    content: 'Post content',
    status: 'draft'
  }
});

// Update a post
const { data: updatedPost } = await payloadProvider.update({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5',
  variables: {
    title: 'Updated Post Title',
    status: 'published'
  }
});

// Delete a post
const { data } = await payloadProvider.deleteOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | string | Yes | Base URL of the PayloadCMS API |
| `authToken` | string | No | JWT token to include in requests |
| `customHeaders` | object | No | Custom headers to include in all requests |
| `resources` | object | No | Resource mapping to override default collection names |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports PayloadCMS's filtering operators:

```typescript
// Simple equality filter
filter: { status: 'published' }

// Using operators
filter: {
  title: { $contains: 'javascript' },
  rating: { $gt: 4 },
  category: { $in: ['technology', 'programming'] }
}

// Complex conditions
filter: {
  $and: [
    { status: { $eq: 'published' } },
    { publishedAt: { $lt: new Date().toISOString() } }
  ]
}
```

### Supported Operators

| Operator | PayloadCMS Equivalent | Description |
|----------|------------------------|-------------|
| `$eq` | `equals` | Equal |
| `$ne` | `not_equals` | Not equal |
| `$lt` | `less_than` | Less than |
| `$lte` | `less_than_or_equal_to` | Less than or equal |
| `$gt` | `greater_than` | Greater than |
| `$gte` | `greater_than_or_equal_to` | Greater than or equal |
| `$contains` | `like` | Contains |
| `$in` | `in` | Included in array |
| `$notIn` | `not_in` | Not included in array |
| `$exists` | `exists` | Field exists |

## Development Guidelines

When extending or modifying this provider, keep in mind that PayloadCMS:

1. Uses MongoDB-like query syntax for filtering
2. Returns paginated results with `docs` and `totalDocs` properties
3. Supports relationship population via the `depth` parameter
4. Uses JWT authentication with the `Authorization: JWT <token>` header format

## License

MIT
