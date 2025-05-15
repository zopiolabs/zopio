# Zopio Data Packages

Data management and UI components for the Zopio framework. This package provides a comprehensive solution for data operations, with a standardized interface across different data sources.

## Overview

The Zopio data packages provide a unified approach to data management, allowing developers to work with various data sources using a consistent API. The packages are designed to be modular, extensible, and easy to use.

## Consolidated Structure

The data packages have been reorganized into a more streamlined, developer-friendly structure:

```
@repo/data
├── base/           # Core types, utilities, base interfaces
├── providers/      # All data providers in one package with submodules
└── ui/             # UI components and hooks
```

## Installation

```bash
pnpm add @repo/data
```

Or install specific packages:

```bash
pnpm add @repo/data-base @repo/data-providers @repo/data-ui
```

## Core Packages

### Base Package

The `@repo/data-base` package provides the foundation for all data operations:

```typescript
// Import core types
import type { CrudProvider, GetListParams } from '@repo/data-base';

// Import provider utilities
import { createDataProvider, registerProvider } from '@repo/data-base';

// Import utility functions
import { normalizePagination, applyFilters } from '@repo/data-base';

// Import schema utilities
import { createSchema, CommonSchemas } from '@repo/data-base';
```

This package defines the core interfaces and types that all data providers implement, ensuring a consistent API across different data sources.

### Providers Package

The `@repo/data-providers` package contains all the data providers that implement the CrudProvider interface:

```typescript
// Import provider factory
import { createDataProvider } from '@repo/data-providers';

// Create a provider for any backend
const dataProvider = createDataProvider({
  type: 'rest',
  config: { apiUrl: '/api' }
});

// Or import specific providers directly
import { createSupabaseProvider } from '@repo/data-providers/supabase';
import { createRestProvider, createMockProvider } from '@repo/data-providers';
```

Each provider implements the same interface but connects to different data sources, allowing you to switch between providers with minimal code changes.

### UI Package

The `@repo/data-ui` package provides React components and hooks for working with data:

```typescript
// Import UI components
import { DataList, DataForm } from '@repo/data-ui';

// Import hooks
import { useDataProvider, useGetList } from '@repo/data-ui/hooks';

// Import table hooks
import { useTable, useTableFilters, useTableSelection } from '@repo/data-ui';

// Import form hooks
import { useForm, useFormValidation } from '@repo/data-ui';
```

These components and hooks make it easy to build data-driven UIs that work with any data provider.

## Usage Examples

### Creating a Data Provider

```typescript
// Create a data provider
const provider = createDataProvider({
  type: 'supabase',
  config: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  }
});

// Use the provider
const { data, error } = await provider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'desc' },
  filter: { status: 'published' }
});
```

## Available Providers

The Zopio framework includes the following data providers:

- **Airtable** - Connect to Airtable bases
- **Baserow** - Connect to Baserow databases
- **Drizzle** - Use Drizzle ORM
- **Firebase** - Connect to Firebase Firestore
- **Formbricks** - Connect to Formbricks forms
- **GitHub** - Connect to GitHub API
- **Google Sheets** - Connect to Google Sheets
- **GraphQL** - Connect to GraphQL APIs
- **KillBill** - Connect to KillBill billing system
- **Kysely** - Use Kysely SQL query builder
- **Local** - Local storage provider
- **Medusa** - Connect to Medusa e-commerce
- **Mock** - Mock data provider for testing
- **N8n** - Connect to N8n workflows
- **Neon** - Connect to Neon serverless Postgres
- **NocoDB** - Connect to NocoDB
- **Notion** - Connect to Notion databases
- **Odoo** - Connect to Odoo ERP
- **Prisma** - Use Prisma ORM
- **REST** - Connect to REST APIs
- **SAP** - Connect to SAP systems
- **Shopify** - Connect to Shopify
- **Stripe** - Connect to Stripe
- **Supabase** - Connect to Supabase
- **SyncOps** - Connect to SyncOps
- **Temporal** - Connect to Temporal workflows
- **Xata** - Connect to Xata databases
- **Zopio** - Native Zopio data provider

## Usage Guidelines

1. **Core Data Types and Utilities**
   - Use `@repo/data-base` for core types, interfaces, and utilities
   - Import schemas and validation helpers from the base package

2. **Data Providers**
   - Use the factory function to create providers:
     ```typescript
     import { createDataProvider } from '@repo/data-providers';
     
     const dataProvider = createDataProvider({
       type: 'rest',
       config: { apiUrl: '/api' }
     });
     ```
   - Or import specific providers directly:
     ```typescript
     import { createRestProvider } from '@repo/data-providers/rest';
     import { createPrismaProvider } from '@repo/data-providers/prisma';
     ```

3. **UI Components**
   - Use the UI package for data-related components and hooks:
     ```typescript
     import { useDataTable, useDataForm } from '@repo/data-ui';
     ```

## Development

1. **Dependencies**
   - All packages require React 18+
   - Prisma providers require Prisma client
   - Some features require Next.js 15+

2. **TypeScript**
   - All packages are written in TypeScript
   - Types are included in packages

3. **Testing**
   - Write tests for custom implementations
   - Use provided testing utilities

## Integration Examples

```typescript
// Import core types and utilities
import type { CrudProvider, GetListParams } from '@repo/data-base';
import { normalizePagination } from '@repo/data-base';

// Create a data provider
import { createDataProvider } from '@repo/data-providers';

const dataProvider = createDataProvider({
  type: 'rest',
  config: { baseUrl: '/api' }
});

// Use specific provider directly
import { createSupabaseProvider } from '@repo/data-providers/supabase';

const supabaseProvider = createSupabaseProvider({
  url: 'https://your-project.supabase.co',
  apiKey: 'your-api-key'
});

// Use UI components and hooks
import { useDataTable, useDataForm } from '@repo/data-ui';

function ProductList() {
  const { data, loading, error } = useDataTable({
    provider: dataProvider,
    resource: 'products'
  });
  
  // Render your UI
}
```

## Documentation

- [API Reference](https://docs.zopio.dev/data)
- [Examples](https://docs.zopio.dev/data/examples)
- [Best Practices](https://docs.zopio.dev/data/best-practices)

## Contributing

1. Follow TypeScript guidelines
2. Ensure backward compatibility
3. Add tests for new features
4. Update documentation

## License

All data packages are licensed under MIT license.
