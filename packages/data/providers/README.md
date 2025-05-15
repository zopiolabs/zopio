# Zopio Data Providers

## Overview
The Data Providers package provides a unified interface for connecting to various data sources and services. It implements the CRUD (Create, Read, Update, Delete) interface defined in `@repo/data-base` for multiple backends.

## Module Categories

### Core Providers
- **REST**: Standard REST API provider
- **GraphQL**: GraphQL API provider
- **Local**: Local storage provider
- **Mock**: Mock data provider for testing

### Database Providers
- **Prisma**: Provider for Prisma ORM
- **Drizzle**: Provider for Drizzle ORM
- **Kysely**: Provider for Kysely SQL query builder
- **Supabase**: Provider for Supabase platform
- **Firebase**: Provider for Firebase Firestore
- **Neon**: Provider for Neon serverless Postgres

### External Service Providers
- **Airtable**: Provider for Airtable API
- **Baserow**: Provider for Baserow API
- **Formbricks**: Provider for Formbricks API
- **GitHub**: Provider for GitHub API
- **Google Sheets**: Provider for Google Sheets API
- **KillBill**: Provider for KillBill API
- **Medusa**: Provider for Medusa e-commerce
- **N8N**: Provider for N8N automation
- **NocoDB**: Provider for NocoDB API
- **Notion**: Provider for Notion API
- **Odoo**: Provider for Odoo ERP
- **SAP**: Provider for SAP API
- **Shopify**: Provider for Shopify API
- **Stripe**: Provider for Stripe API
- **SyncOps**: Provider for SyncOps API
- **Temporal**: Provider for Temporal workflows
- **Xata**: Provider for Xata serverless database

## Usage Guidelines

To use a data provider, you can either:

1. Use the factory function:
```typescript
import { createDataProvider } from '@repo/data-providers';

const provider = createDataProvider({
  type: 'rest',
  config: {
    baseUrl: 'https://api.example.com'
  }
});
```

2. Import a specific provider directly:
```typescript
import { createRestProvider } from '@repo/data-providers';

const provider = createRestProvider({
  baseUrl: 'https://api.example.com'
});
```

## Installation

```bash
# If using npm
npm install @repo/data-providers

# If using yarn
yarn add @repo/data-providers

# If using pnpm
pnpm add @repo/data-providers
```

## Development Guidelines

1. All providers must implement the `CrudProvider` interface from `@repo/data-base`
2. Each provider should be in its own directory with its own package.json
3. Provider configuration should be type-safe with proper interfaces
4. Error handling should be consistent across all providers
5. Documentation should be provided for each provider

## Integration Examples

```typescript
// Example using REST provider
import { createRestProvider } from '@repo/data-providers';

const restProvider = createRestProvider({
  baseUrl: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer TOKEN'
  }
});

// Get a list of users
const { data, total } = await restProvider.getList({
  resource: 'users',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name', order: 'asc' },
  filter: { role: 'admin' }
});

// Get a single user
const { data: user } = await restProvider.getOne({
  resource: 'users',
  id: '123'
});

// Create a new user
const { data: newUser } = await restProvider.create({
  resource: 'users',
  variables: { name: 'John Doe', email: 'john@example.com' }
});

// Update a user
const { data: updatedUser } = await restProvider.update({
  resource: 'users',
  id: '123',
  variables: { name: 'John Smith' }
});

// Delete a user
const { data: deletedUser } = await restProvider.deleteOne({
  resource: 'users',
  id: '123'
});
```

## Documentation References

For more detailed information, refer to:
- [Data Base Package Documentation](../base/README.md)
- [Zopio Framework Documentation](../../../docs/README.md)

## Contributing Guidelines

1. Follow the Zopio package naming convention: `@repo/data-providers-*`
2. Ensure all providers have proper TypeScript types
3. Write tests for all provider functionality
4. Document any provider-specific behavior or limitations

## License Information

MIT LICENSED - Copyright © Zopio Labs
