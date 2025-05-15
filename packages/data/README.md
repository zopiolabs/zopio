# Zopio Data Packages

Data management and UI components for the Zopio framework.

## Consolidated Structure

The data packages have been reorganized into a more streamlined, developer-friendly structure:

```
@repo/data
├── base/           # Core types, utilities, base interfaces
├── providers/      # All data providers in one package with submodules
└── ui/             # UI components and hooks
```

### Base Package

The `@repo/data-base` package provides the foundation for all data operations:

```typescript
// Import core types
import type { CrudProvider, GetListParams } from '@repo/data-base';

// Import utility functions
import { normalizePagination, applyFilters } from '@repo/data-base';

// Import schema utilities
import { createSchema, CommonSchemas } from '@repo/data-base';
```

### Providers Package

The `@repo/data-providers` package consolidates all data provider implementations:

```typescript
// Import the factory function
import { createDataProvider } from '@repo/data-providers';

// Create a provider for any backend
const dataProvider = createDataProvider({
  type: 'rest',
  config: { apiUrl: '/api' }
});

// Or import specific providers directly
import { createRestProvider, createMockProvider } from '@repo/data-providers';
```

### UI Package

The `@repo/data-ui` package provides React components and hooks for data operations:

```typescript
// Import table hooks
import { useTable, useTableFilters, useTableSelection } from '@repo/data-ui';

// Import form hooks
import { useForm, useFormValidation } from '@repo/data-ui';
```

## Module Categories

### Core
- **data-base** - Core data types, utilities, and base interfaces

### Data Providers
- **data-providers** - Unified data providers for Zopio framework

Available providers:
- Airtable
- Baserow
- Drizzle
- Firebase
- Formbricks
- GitHub
- Google Sheets
- GraphQL
- KillBill
- Kysely
- Local
- Medusa
- Mock
- N8n
- Neon
- NocoDB
- Notion
- Odoo
- Prisma
- REST
- SAP
- Shopify
- Stripe
- Supabase
- SyncOps
- Temporal
- Xata
- Zopio

### UI Components
- **data-ui** - UI components and hooks for data management

## Installation

Install data packages using pnpm:

```bash
pnpm add @repo/<package-name>
```

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
