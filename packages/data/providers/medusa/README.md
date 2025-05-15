# Medusa Provider

## Overview
Medusa data provider for Zopio framework that implements the CRUD interface for Medusa open-source e-commerce platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Medusa provider instance
const dataProvider = createDataProvider({
  type: 'medusa',
  config: {
    apiUrl: 'https://your-medusa-instance.com/api',
    // Optional authentication
    apiKey: 'your-medusa-api-key',
    // Optional resource mapping
    resourceMapping: {
      products: 'products',
      orders: 'orders',
      customers: 'customers'
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'products',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'created_at', order: 'desc' },
  filter: { status: 'published' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | `string` | Yes | URL of your Medusa API |
| `apiKey` | `string` | No | Your Medusa API key |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to Medusa resource types |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The Medusa provider supports the following resources:

- `products`: Store products
- `orders`: Customer orders
- `customers`: Store customers
- `collections`: Product collections
- `regions`: Store regions
- `discounts`: Promotional discounts
- `carts`: Shopping carts
- `shipping-options`: Shipping options
- `payments`: Payment transactions

## Integration with Medusa

The provider translates Zopio's data queries into Medusa API calls, handling:

- Authentication with API key
- Pagination with offset/limit
- Filtering by product attributes
- Sorting by creation date and other fields
- Creating and updating e-commerce resources
