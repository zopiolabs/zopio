# FastAPI Data Provider

A data provider for Zopio that integrates with [FastAPI](https://github.com/tiangolo/fastapi) for RESTful API endpoints.

## Features

- Complete integration with FastAPI REST endpoints
- Support for all standard CRUD operations
- Advanced filtering with FastAPI query parameter syntax
- Pagination and sorting capabilities
- Customizable endpoint mapping
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-fastapi
```

## Usage

```typescript
import { createFastAPIProvider } from '@repo/data-providers-fastapi';

const fastapiProvider = createFastAPIProvider({
  apiUrl: 'https://api.example.com',
  token: 'your-jwt-token',          // Optional
  customHeaders: {
    'X-Custom-Header': 'value'      // Optional
  },
  resources: {
    posts: 'blog/posts'             // Optional resource to endpoint mapping
  }
});

// Get a list of posts with pagination, sorting, and filtering
const { data, total } = await fastapiProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'created_at', order: 'desc' },
  filter: {
    title: { $icontains: 'javascript' },
    status: { $eq: 'published' }
  }
});

// Get a single post by ID
const { data: post } = await fastapiProvider.getOne({
  resource: 'posts',
  id: 123
});

// Create a new post
const { data: newPost } = await fastapiProvider.create({
  resource: 'posts',
  variables: {
    title: 'New Post',
    content: 'Post content',
    status: 'draft'
  }
});

// Update a post
const { data: updatedPost } = await fastapiProvider.update({
  resource: 'posts',
  id: 123,
  variables: {
    title: 'Updated Post Title',
    status: 'published'
  }
});

// Delete a post
const { data } = await fastapiProvider.deleteOne({
  resource: 'posts',
  id: 123
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | string | Yes | FastAPI endpoint URL |
| `token` | string | No | JWT token for authentication |
| `customHeaders` | object | No | Custom headers to include in all requests |
| `resources` | object | No | Resource mapping to override default endpoint paths |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports FastAPI's filtering operators through query parameters:

```typescript
// Simple equality filter
filter: { status: 'published' }

// Using operators
filter: {
  title: { $icontains: 'javascript' },
  rating: { $gt: 4 },
  category: { $in: ['technology', 'programming'] }
}
```

### Supported Operators

| Operator | FastAPI Equivalent | Description |
|----------|-------------------|-------------|
| `$eq` | `field=value` | Equal |
| `$ne` | `field__ne=value` | Not equal |
| `$lt` | `field__lt=value` | Less than |
| `$lte` | `field__lte=value` | Less than or equal |
| `$gt` | `field__gt=value` | Greater than |
| `$gte` | `field__gte=value` | Greater than or equal |
| `$contains` | `field__contains=value` | Contains (case-sensitive) |
| `$icontains` | `field__icontains=value` | Contains (case-insensitive) |
| `$startsWith` | `field__startswith=value` | Starts with |
| `$endsWith` | `field__endswith=value` | Ends with |
| `$in` | `field__in=value1,value2` | Included in list |
| `$nin` | `field__nin=value1,value2` | Not included in list |
| `$null` | `field__isnull=true` | Is null |
| `$regex` | `field__regex=pattern` | Matches regex pattern |

## Development Guidelines

When extending or modifying this provider, keep in mind that FastAPI:

1. Uses a specific query parameter syntax for filtering (similar to Django ORM)
2. Typically returns paginated results with items/data and total/count properties
3. Supports various authentication methods, with Bearer token being the most common
4. Follows RESTful conventions for endpoint structure

## License

MIT
