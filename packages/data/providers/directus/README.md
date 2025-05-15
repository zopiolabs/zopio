# Directus Data Provider

A data provider for Zopio that integrates with [Directus](https://github.com/directus/directus) for database operations using the Directus REST API.

## Features

- Complete integration with Directus REST API
- Support for all standard CRUD operations
- Advanced filtering with Directus filter syntax
- Pagination and sorting capabilities
- Customizable collection mapping
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-directus
```

## Usage

```typescript
import { createDirectusProvider } from '@repo/data-providers-directus';

const directusProvider = createDirectusProvider({
  apiUrl: 'https://example.directus.app',
  token: 'your-directus-token',      // Optional
  customHeaders: {
    'X-Custom-Header': 'value'       // Optional
  },
  resources: {
    posts: 'blog_posts'              // Optional resource to collection mapping
  }
});

// Get a list of posts with pagination, sorting, and filtering
const { data, total } = await directusProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'date_published', order: 'desc' },
  filter: {
    title: { $contains: 'javascript' },
    status: { $eq: 'published' }
  }
});

// Get a single post by ID
const { data: post } = await directusProvider.getOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});

// Create a new post
const { data: newPost } = await directusProvider.create({
  resource: 'posts',
  variables: {
    title: 'New Post',
    content: 'Post content',
    status: 'draft'
  }
});

// Update a post
const { data: updatedPost } = await directusProvider.update({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5',
  variables: {
    title: 'Updated Post Title',
    status: 'published'
  }
});

// Delete a post
const { data } = await directusProvider.deleteOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | string | Yes | Directus API URL |
| `token` | string | No | Directus access token |
| `customHeaders` | object | No | Custom headers to include in all requests |
| `resources` | object | No | Resource mapping to override default collection names |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports Directus's filtering operators:

```typescript
// Simple equality filter
filter: { status: 'published' }

// Using operators
filter: {
  title: { $contains: 'javascript' },
  rating: { $gt: 4 },
  category: { $in: ['technology', 'programming'] }
}
```

### Supported Operators

| Operator | Directus Equivalent | Description |
|----------|---------------------|-------------|
| `$eq` | `_eq` | Equal |
| `$ne` | `_neq` | Not equal |
| `$lt` | `_lt` | Less than |
| `$lte` | `_lte` | Less than or equal |
| `$gt` | `_gt` | Greater than |
| `$gte` | `_gte` | Greater than or equal |
| `$contains` | `_contains` | Contains |
| `$ncontains` | `_ncontains` | Does not contain |
| `$in` | `_in` | Included in array |
| `$nin` | `_nin` | Not included in array |
| `$null` | `_null` | Is null |
| `$nnull` | `_nnull` | Is not null |
| `$between` | `_between` | Between two values |
| `$nbetween` | `_nbetween` | Not between two values |
| `$empty` | `_empty` | Is empty |
| `$nempty` | `_nempty` | Is not empty |

## Development Guidelines

When extending or modifying this provider, keep in mind that Directus:

1. Uses a specific filter syntax for querying data
2. Returns paginated results with `data` and `meta.total_count` properties
3. Requires the `Authorization: Bearer <token>` header for authenticated requests
4. Supports sorting with prefixed field names (e.g., `-title` for descending)

## License

MIT
