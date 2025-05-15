# @repo/data-base

## Overview
Core data utilities and interfaces for Zopio framework that provides a standardized foundation for data operations across all providers and UI components.

## Installation

```bash
# From your project root
npm install @repo/data-base
```

## Usage

### Basic Usage

```typescript
import { 
  type CrudProvider, 
  type GetListParams,
  createDataProvider 
} from '@repo/data-base';

// Create a data provider instance
const dataProvider = createDataProvider({
  type: 'rest',
  config: {
    apiUrl: 'https://api.example.com'
  }
});

// Use the provider
const fetchPosts = async () => {
  const result = await dataProvider.getList({
    resource: 'posts',
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'createdAt', order: 'desc' },
    filter: { status: 'published' }
  });
  
  return result.data;
};
```

### Provider Registration

```typescript
import { registerProvider, type CrudProvider } from '@repo/data-base';

// Create a custom provider
const myCustomProvider = (config: Record<string, unknown>): CrudProvider => {
  // Provider implementation
  return {
    getList: async (params) => { /* ... */ },
    getOne: async (params) => { /* ... */ },
    create: async (params) => { /* ... */ },
    update: async (params) => { /* ... */ },
    deleteOne: async (params) => { /* ... */ }
  };
};

// Register the provider
registerProvider('custom', myCustomProvider);
```

## Core Interfaces

### CrudProvider

The main interface that all data providers must implement:

```typescript
interface CrudProvider {
  getList: <RecordType = unknown>(params: GetListParams) => Promise<GetListResult<RecordType>>;
  getOne: <RecordType = unknown>(params: GetOneParams) => Promise<GetOneResult<RecordType>>;
  create: <RecordType = unknown>(params: CreateParams<RecordType>) => Promise<CreateResult<RecordType>>;
  update: <RecordType = unknown>(params: UpdateParams<RecordType>) => Promise<UpdateResult<RecordType>>;
  deleteOne: <RecordType = unknown>(params: DeleteParams) => Promise<DeleteResult<RecordType>>;
}
```

### Operation Parameters

Each CRUD operation has its own parameter interface:

- `GetListParams`: Parameters for retrieving a list of resources
- `GetOneParams`: Parameters for retrieving a single resource
- `CreateParams`: Parameters for creating a new resource
- `UpdateParams`: Parameters for updating an existing resource
- `DeleteParams`: Parameters for deleting a resource

### Operation Results

Each CRUD operation has its own result interface:

- `GetListResult`: Result of retrieving a list of resources
- `GetOneResult`: Result of retrieving a single resource
- `CreateResult`: Result of creating a new resource
- `UpdateResult`: Result of updating an existing resource
- `DeleteResult`: Result of deleting a resource

## Advanced Features

### Extended CRUD Provider

For providers that support additional operations:

```typescript
interface ExtendedCrudProvider extends CrudProvider {
  batch?: (params: BatchParams) => Promise<BatchResult>;
  transaction?: (params: TransactionParams) => Promise<TransactionResult>;
  query?: (params: { resource: string; query: AdvancedQueryParams }) => Promise<GetListResult>;
}
```

### Advanced Query Parameters

For complex data queries:

```typescript
interface AdvancedQueryParams {
  select?: string[];
  include?: Record<string, unknown>;
  where?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  groupBy?: string[];
  having?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  distinct?: boolean;
  count?: boolean;
}
```

## Integration with Providers

This package serves as the foundation for all data providers in the Zopio ecosystem. Providers like REST, GraphQL, Firebase, etc. implement the interfaces defined in this package.

## License

UNLICENSED
