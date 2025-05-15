# Strapi Client Provider

A data provider for Zopio that integrates with Strapi CMS (https://github.com/strapi/strapi) for RESTful API endpoints.

## Features

- Complete integration with Strapi v4 API endpoints
- Support for all standard CRUD operations
- Pagination, sorting, and filtering capabilities
- Automatic handling of Strapi's data structure
- Support for relations via populate parameter
- Customizable resource paths
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-strapi
```

## Usage

```typescript
import { createStrapiClientProvider } from '@repo/data-providers-strapi';

const strapiProvider = createStrapiClientProvider({
  apiUrl: 'https://your-strapi-api.com',
  authToken: 'your-jwt-token', // Optional
  customHeaders: {
    'X-Custom-Header': 'value'  // Optional
  },
  resources: {
    articles: 'api/articles'    // Optional resource path mapping
  }
});

// Get a list of articles with pagination, sorting, and filtering
const { data, total } = await strapiProvider.getList({
  resource: 'articles',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'publishedAt', order: 'desc' },
  filter: {
    title: { $containsi: 'javascript' },
    category: { $eq: 'technology' }
  }
});

// Get a single article by ID
const { data: article } = await strapiProvider.getOne({
  resource: 'articles',
  id: 123
});

// Create a new article
const { data: newArticle } = await strapiProvider.create({
  resource: 'articles',
  variables: {
    title: 'New Article',
    content: 'Article content',
    category: 'technology'
  }
});

// Update an article
const { data: updatedArticle } = await strapiProvider.update({
  resource: 'articles',
  id: 123,
  variables: {
    title: 'Updated Article Title'
  }
});

// Delete an article
const { data } = await strapiProvider.deleteOne({
  resource: 'articles',
  id: 123
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | string | Yes | Base URL of the Strapi API |
| `authToken` | string | No | JWT token to include in requests |
| `customHeaders` | object | No | Custom headers to include in all requests |
| `resources` | object | No | Resource mapping to override default endpoint paths |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports Strapi's filtering operators:

```typescript
// Simple equality filter
filter: { status: 'published' }

// Using operators
filter: {
  title: { $containsi: 'javascript' },  // Case-insensitive contains
  rating: { $gt: 4 },                   // Greater than
  publishedAt: { $between: ['2023-01-01', '2023-12-31'] },
  category: { $in: ['technology', 'programming'] }
}
```

### Supported Operators

| Operator | Description |
|----------|-------------|
| `$eq` | Equal |
| `$ne` | Not equal |
| `$lt` | Less than |
| `$lte` | Less than or equal |
| `$gt` | Greater than |
| `$gte` | Greater than or equal |
| `$contains` | Contains (case-sensitive) |
| `$containsi` | Contains (case-insensitive) |
| `$in` | Included in array |
| `$notIn` | Not included in array |
| `$null` | Is null |
| `$notNull` | Is not null |
| `$between` | Between values |
| `$startsWith` | Starts with |
| `$endsWith` | Ends with |

## License

MIT
