# Sanity Data Provider

A data provider for Zopio that integrates with [Sanity.io](https://github.com/sanity-io/sanity) for content operations using the GROQ query language.

## Features

- Complete integration with Sanity Content API
- Support for all standard CRUD operations
- Advanced filtering with GROQ query syntax
- Pagination and sorting capabilities
- Customizable document type mapping
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-sanity
```

## Usage

```typescript
import { createSanityProvider } from '@repo/data-providers-sanity';

const sanityProvider = createSanityProvider({
  projectId: 'your-project-id',
  dataset: 'production',           // Optional, defaults to 'production'
  apiVersion: 'v2021-10-21',       // Optional, defaults to 'v2021-10-21'
  token: 'your-sanity-token',      // Optional, required for mutations
  useCdn: true,                    // Optional, defaults to true
  resources: {
    posts: 'post'                  // Optional resource to document type mapping
  }
});

// Get a list of posts with pagination, sorting, and filtering
const { data, total } = await sanityProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'publishedAt', order: 'desc' },
  filter: {
    title: { $contains: 'javascript' },
    published: { $eq: true }
  }
});

// Get a single post by ID
const { data: post } = await sanityProvider.getOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});

// Create a new post
const { data: newPost } = await sanityProvider.create({
  resource: 'posts',
  variables: {
    title: 'New Post',
    content: 'Post content',
    published: false
  }
});

// Update a post
const { data: updatedPost } = await sanityProvider.update({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5',
  variables: {
    title: 'Updated Post Title',
    published: true
  }
});

// Delete a post
const { data } = await sanityProvider.deleteOne({
  resource: 'posts',
  id: '6450a5c2d7e5b900084722d5'
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `projectId` | string | Yes | Sanity project ID |
| `dataset` | string | No | Dataset name (defaults to 'production') |
| `apiVersion` | string | No | API version (defaults to 'v2021-10-21') |
| `token` | string | No | Sanity token (required for create/update/delete) |
| `useCdn` | boolean | No | Whether to use CDN (defaults to true) |
| `resources` | object | No | Resource mapping to override default document types |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports various filtering operators that are translated to GROQ:

```typescript
// Simple equality filter
filter: { published: true }

// Using operators
filter: {
  title: { $contains: 'javascript' },
  rating: { $gt: 4 },
  category: { $in: ['technology', 'programming'] }
}
```

### Supported Operators

| Operator | GROQ Equivalent | Description |
|----------|-----------------|-------------|
| `$eq` | `==` | Equal |
| `$ne` | `!=` | Not equal |
| `$lt` | `<` | Less than |
| `$lte` | `<=` | Less than or equal |
| `$gt` | `>` | Greater than |
| `$gte` | `>=` | Greater than or equal |
| `$contains` | `match "*value*"` | Contains |
| `$startsWith` | `match "value*"` | Starts with |
| `$endsWith` | `match "*value"` | Ends with |
| `$in` | `in [...]` | Included in array |
| `$defined` | `defined()` | Field exists |

## GROQ Query Language

This provider uses Sanity's GROQ (Graph-Relational Object Queries) language to fetch and filter data. GROQ is a powerful query language designed specifically for Sanity.

Example of a generated GROQ query:

```groq
*[_type == "post" && title match "*javascript*" && published == true] | order(publishedAt desc)[0...10]
```

## Development Guidelines

When extending or modifying this provider, keep in mind that Sanity:

1. Uses GROQ for querying content
2. Requires a token for mutations (create/update/delete)
3. Has a specific document structure with `_type` and `_id` fields
4. Supports both CDN and API endpoints

## License

MIT
