# CRUD Provider Customizer

A middleware/decorator utility for customizing any data provider in the Zopio framework by adding hooks that run before and after CRUD operations.

## Overview

The CRUD Provider Customizer allows you to extend and modify the behavior of any data provider without changing its implementation. This is useful for adding cross-cutting concerns like logging, permissions, data transformation, or validation.

## Features

- Add `before` and `after` hooks to any CRUD method
- Type-safe middleware functions with proper error handling
- Compatible with all Zopio data providers
- Useful for:
  - Logging and monitoring
  - Permission checks and access control
  - Data transformation and normalization
  - Validation and sanitization
  - Caching and performance optimization

## Installation

```bash
pnpm add @repo/addons-crud-customizer
```

## Usage

```typescript
import { createRestProvider } from '@repo/data-providers-rest';
import { customizeCrudProvider } from '@repo/addons-crud-customizer';

// Create a base provider
const baseProvider = createRestProvider({
  apiUrl: 'https://api.example.com'
});

// Create a customized provider with middleware
const customizedProvider = customizeCrudProvider(baseProvider, {
  // Add middleware to getList operation
  getList: {
    // Before hook: modify parameters before they reach the provider
    before: async (params) => ({
      ...params,
      filter: {
        ...params.filter,
        status: 'active' // Always filter for active records
      }
    }),
    // After hook: transform the result after it comes from the provider
    after: async (result) => ({
      ...result,
      data: result.data.map(item => ({
        ...item,
        displayName: `${item.firstName} ${item.lastName}` // Add computed field
      }))
    })
  },
  
  // Add middleware to create operation
  create: {
    before: async (params) => {
      // Add timestamp and user info
      return {
        ...params,
        variables: {
          ...params.variables,
          createdAt: new Date().toISOString(),
          createdBy: 'current-user-id'
        }
      };
    }
  }
});

// Use the customized provider like any other provider
const { data, total } = await customizedProvider.getList({
  resource: 'users',
  pagination: { page: 1, perPage: 10 }
});
```

## API Reference

### `customizeCrudProvider(provider, options)`

Creates a customized CRUD provider by wrapping an existing provider with middleware functions.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `provider` | `CrudProvider` | The original CRUD provider to customize |
| `options` | `CustomizerOptions` | Configuration options for customization |

#### CustomizerOptions

```typescript
interface CustomizerOptions {
  getList?: {
    before?: (params: GetListParams) => Promise<GetListParams>;
    after?: (result: GetListResult) => Promise<GetListResult>;
  };
  getOne?: {
    before?: (params: GetOneParams) => Promise<GetOneParams>;
    after?: (result: GetOneResult) => Promise<GetOneResult>;
  };
  create?: {
    before?: (params: CreateParams) => Promise<CreateParams>;
    after?: (result: CreateResult) => Promise<CreateResult>;
  };
  update?: {
    before?: (params: UpdateParams) => Promise<UpdateParams>;
    after?: (result: UpdateResult) => Promise<UpdateResult>;
  };
  deleteOne?: {
    before?: (params: DeleteParams) => Promise<DeleteParams>;
    after?: (result: DeleteResult) => Promise<DeleteResult>;
  };
}
```

## Use Cases

### Logging

```typescript
const loggingProvider = customizeCrudProvider(baseProvider, {
  getList: {
    before: async (params) => {
      console.log('getList called with:', params);
      return params;
    },
    after: async (result) => {
      console.log('getList returned:', result);
      return result;
    }
  }
  // Add similar hooks for other methods
});
```

### Access Control

```typescript
const secureProvider = customizeCrudProvider(baseProvider, {
  getList: {
    before: async (params) => {
      // Add tenant filter for multi-tenancy
      return {
        ...params,
        filter: {
          ...params.filter,
          tenantId: getCurrentTenantId()
        }
      };
    }
  },
  deleteOne: {
    before: async (params) => {
      // Check permissions before allowing delete
      const hasPermission = await checkPermission('delete', params.resource);
      if (!hasPermission) {
        throw new Error('Permission denied');
      }
      return params;
    }
  }
});
```

## License

MIT