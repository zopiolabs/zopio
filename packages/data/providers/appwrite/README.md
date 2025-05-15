# Appwrite Data Provider

A data provider for Zopio that integrates with [Appwrite](https://github.com/appwrite/appwrite) for database operations.

## Features

- Complete integration with Appwrite Database API
- Support for all standard CRUD operations
- Advanced filtering with Appwrite query syntax
- Pagination and sorting capabilities
- Customizable collection mapping
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-appwrite
```

## Usage

```typescript
import { createAppwriteProvider } from '@repo/data-providers-appwrite';

const appwriteProvider = createAppwriteProvider({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'your-project-id',
  apiKey: 'your-api-key',          // Optional
  databaseId: 'your-database-id',  // Optional, defaults to 'default'
  resources: {
    posts: 'blog_posts'            // Optional resource to collection mapping
  }
});

// Get a list of posts with pagination, sorting, and filtering
const { data, total } = await appwriteProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'publishedAt', order: 'desc' },
  filter: {
    title: { $contains: 'javascript' },
    status: { $eq: 'published' }
  }
});

// Get a single post by ID
const { data: post } = await appwriteProvider.getOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});

// Create a new post
const { data: newPost } = await appwriteProvider.create({
  resource: 'posts',
  variables: {
    title: 'New Post',
    content: 'Post content',
    status: 'draft'
  }
});

// Update a post
const { data: updatedPost } = await appwriteProvider.update({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5',
  variables: {
    title: 'Updated Post Title',
    status: 'published'
  }
});

// Delete a post
const { data } = await appwriteProvider.deleteOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `endpoint` | string | Yes | Appwrite endpoint URL |
| `projectId` | string | Yes | Appwrite project ID |
| `apiKey` | string | No | Appwrite API key or JWT token |
| `databaseId` | string | No | Database ID (defaults to 'default') |
| `resources` | object | No | Resource mapping to override default collection names |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports Appwrite's filtering operators:

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

| Operator | Appwrite Equivalent | Description |
|----------|---------------------|-------------|
| `$eq` | `equal` | Equal |
| `$ne` | `notEqual` | Not equal |
| `$lt` | `lessThan` | Less than |
| `$lte` | `lessThanEqual` | Less than or equal |
| `$gt` | `greaterThan` | Greater than |
| `$gte` | `greaterThanEqual` | Greater than or equal |
| `$contains` | `search` | Contains |
| `$startsWith` | `startsWith` | Starts with |
| `$endsWith` | `endsWith` | Ends with |
| `$in` | `isIn` | Included in array |
| `$notIn` | `notIn` | Not included in array |
| `$isNull` | `isNull` | Is null |
| `$isNotNull` | `isNotNull` | Is not null |

## Development Guidelines

When extending or modifying this provider, keep in mind that Appwrite:

1. Uses a specific query syntax for filtering
2. Returns paginated results with `documents` and `total` properties
3. Requires the `X-Appwrite-Project` header for all requests
4. Uses document IDs that can be auto-generated with `unique()`

## License

MIT
