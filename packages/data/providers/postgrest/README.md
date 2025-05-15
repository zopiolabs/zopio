# PostgREST Data Provider

A data provider for Zopio that integrates with [PostgREST](https://postgrest.org) for database operations using the PostgREST REST API.

## Features

- Complete integration with PostgREST API
- Support for all standard CRUD operations
- Advanced filtering with PostgREST operator syntax
- Pagination and sorting capabilities
- Customizable table mapping
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-postgrest
```

## Usage

```typescript
import { createPostgRESTProvider } from '@repo/data-providers-postgrest';

const postgrestProvider = createPostgRESTProvider({
  apiUrl: 'https://api.example.com',
  token: 'your-jwt-token',         // Optional
  customHeaders: {
    'X-Custom-Header': 'value'     // Optional
  },
  resources: {
    posts: 'blog_posts'            // Optional resource to table mapping
  },
  primaryKeyField: 'id'            // Optional, defaults to 'id'
});

// Get a list of posts with pagination, sorting, and filtering
const { data, total } = await postgrestProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'created_at', order: 'desc' },
  filter: {
    title: { $ilike: '%javascript%' },
    status: { $eq: 'published' }
  }
});

// Get a single post by ID
const { data: post } = await postgrestProvider.getOne({
  resource: 'posts',
  id: 123
});

// Create a new post
const { data: newPost } = await postgrestProvider.create({
  resource: 'posts',
  variables: {
    title: 'New Post',
    content: 'Post content',
    status: 'draft'
  }
});

// Update a post
const { data: updatedPost } = await postgrestProvider.update({
  resource: 'posts',
  id: 123,
  variables: {
    title: 'Updated Post Title',
    status: 'published'
  }
});

// Delete a post
const { data } = await postgrestProvider.deleteOne({
  resource: 'posts',
  id: 123
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | string | Yes | PostgREST API URL |
| `token` | string | No | JWT token for authentication |
| `customHeaders` | object | No | Custom headers to include in all requests |
| `resources` | object | No | Resource mapping to override default table names |
| `primaryKeyField` | string | No | Primary key field name (defaults to 'id') |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports PostgREST's filtering operators:

```typescript
// Simple equality filter
filter: { status: 'published' }

// Using operators
filter: {
  title: { $ilike: '%javascript%' },
  rating: { $gt: 4 },
  category: { $in: ['technology', 'programming'] }
}
```

### Supported Operators

| Operator | PostgREST Equivalent | Description |
|----------|----------------------|-------------|
| `$eq` | `eq` | Equal |
| `$ne` | `neq` | Not equal |
| `$lt` | `lt` | Less than |
| `$lte` | `lte` | Less than or equal |
| `$gt` | `gt` | Greater than |
| `$gte` | `gte` | Greater than or equal |
| `$like` | `like` | LIKE operator (case-sensitive) |
| `$ilike` | `ilike` | ILIKE operator (case-insensitive) |
| `$in` | `in` | Included in array |
| `$is` | `is` | Is operator for NULL/TRUE/FALSE |
| `$contains` | `cs` | Contains |
| `$containedBy` | `cd` | Contained by |
| `$overlaps` | `ov` | Overlaps |
| `$startsWith` | `sw` | Starts with |
| `$endsWith` | `ew` | Ends with |

## Development Guidelines

When extending or modifying this provider, keep in mind that PostgREST:

1. Uses a specific query parameter syntax for filtering and sorting
2. Returns total count in the Content-Range header
3. Uses the Prefer header for various behaviors
4. Requires specific URL patterns for querying by primary key

## License

MIT
