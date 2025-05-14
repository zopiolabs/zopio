# Zopio Data Packages

Data management and UI components for the Zopio framework.

## Module Categories

### Core
- **crud** - CRUD operations and utilities for data management
- **data-core** - Core data utilities for Zopio framework
```typescript
import { CRUD } from '@repo/crud';
import { DataCore } from '@repo/data-core';
```

### Forms & Validation
- **data-form** - Form handling and validation utilities
```typescript
import { useDataForm } from '@repo/data-form';
```

### React Hooks
- **data-hooks** - React hooks for data management
```typescript
import { useData } from '@repo/data-hooks';
```

### Data Operations
- **data-mutation** - Data mutation utilities and hooks
- **data-query** - Data query utilities and hooks
```typescript
import { useMutation } from '@repo/data-mutation';
import { useQuery } from '@repo/data-query';
```

### Data Access
- **data-provider** - Base data provider interface and utilities
- **data-provider-prisma** - Prisma data provider implementation
- **data-provider-prisma-advanced** - Advanced Prisma data provider with additional features
```typescript
import { DataProvider } from '@repo/data-provider';
import { PrismaProvider } from '@repo/data-provider-prisma';
import { AdvancedPrismaProvider } from '@repo/data-provider-prisma-advanced';
```

### UI Components
- **data-table** - Basic data table with sorting, filtering and pagination
- **data-table-advanced** - Advanced data table with additional features
- **data-table-bulk** - Data table with bulk actions support
- **data-table-combined** - Combined data table with all features
- **data-table-filters** - Enhanced filtering capabilities for data tables
- **data-table-inline** - Data table with inline editing support
- **data-table-layout** - Layout components for data tables
- **data-table-live** - Real-time data table with live updates
- **data-table-provider** - Data provider integration for tables
- **data-table-url-sync** - URL state synchronization for data tables
```typescript
import { useTable } from '@repo/data-table';
import { useAdvancedTable } from '@repo/data-table-advanced';
import { useBulkTable } from '@repo/data-table-bulk';
```

## Installation

Install data packages using pnpm:

```bash
pnpm add @repo/<package-name>
```

## Usage Guidelines

1. **Core Data Operations**
   - Use `crud` for basic CRUD operations
   - Use `data-core` for shared utilities

2. **Forms and Validation**
   - Use `data-form` for form handling
   - Integrates with validation libraries

3. **Data Access**
   - Use `data-provider` as base interface
   - Choose appropriate provider implementation
   - Use advanced providers for complex scenarios

4. **Data Tables**
   - Start with basic `data-table`
   - Add features through specialized packages
   - Use combined tables for full functionality

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
// Basic data table
import { useTable } from '@repo/data-table';
import { DataProvider } from '@repo/data-provider';

// Advanced setup with forms
import { useDataForm } from '@repo/data-form';
import { useMutation } from '@repo/data-mutation';

// Full featured table
import { useCombinedTable } from '@repo/data-table-combined';
import { TableProvider } from '@repo/data-table-provider';
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
