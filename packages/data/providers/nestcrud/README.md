# NestJSX CRUD Client Provider

A data provider for Zopio that integrates with NestJS applications that follow the NestJSX CRUD patterns for RESTful API endpoints.

## Features

- Complete integration with NestJSX CRUD API endpoints
- Support for all standard CRUD operations
- Pagination, sorting, and filtering capabilities
- Customizable resource paths
- Authentication support

## Installation

```bash
pnpm add @repo/data-providers-nestcrud
```

## Usage

```typescript
import { createNestCrudClientProvider } from '@repo/data-providers-nestcrud';

const nestCrudProvider = createNestCrudClientProvider({
  apiUrl: 'https://api.example.com',
  authToken: 'your-auth-token', // Optional
  customHeaders: {
    'X-Custom-Header': 'value'  // Optional
  },
  resources: {
    users: 'api/users'          // Optional resource path mapping
  }
});

// Get a list of users with pagination, sorting, and filtering
const { data, total } = await nestCrudProvider.getList({
  resource: 'users',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'desc' },
  filter: {
    role: 'admin',
    status: { $ne: 'inactive' }
  }
});

// Get a single user by ID
const { data: user } = await nestCrudProvider.getOne({
  resource: 'users',
  id: 123
});

// Create a new user
const { data: newUser } = await nestCrudProvider.create({
  resource: 'users',
  variables: {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  }
});

// Update a user
const { data: updatedUser } = await nestCrudProvider.update({
  resource: 'users',
  id: 123,
  variables: {
    name: 'John Smith'
  }
});

// Delete a user
const { data } = await nestCrudProvider.deleteOne({
  resource: 'users',
  id: 123
});
```

## API Reference

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | string | Yes | Base URL of the NestJS API |
| `authToken` | string | No | Authentication token to include in requests |
| `customHeaders` | object | No | Custom headers to include in all requests |
| `resources` | object | No | Resource mapping to override default endpoint paths |

### Supported Methods

- `getList`: Fetch a list of resources with pagination, sorting, and filtering
- `getOne`: Fetch a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

### Filtering

The provider supports NestJSX CRUD filtering operators:

```typescript
// Simple equality filter
filter: { status: 'active' }

// Using operators
filter: {
  age: { $gt: 18 },
  name: { $contains: 'John' },
  createdAt: { $between: ['2023-01-01', '2023-12-31'] }
}
```

## License

MIT
