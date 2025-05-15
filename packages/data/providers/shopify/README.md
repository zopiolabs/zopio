# Shopify Provider

## Overview
Shopify data provider for Zopio framework that implements the CRUD interface for Shopify e-commerce platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers @shopify/shopify-api
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Shopify provider instance
const dataProvider = createDataProvider({
  type: 'shopify',
  config: {
    shopDomain: 'your-store.myshopify.com',
    accessToken: 'your-shopify-admin-api-access-token',
    apiVersion: '2023-10', // Optional, defaults to latest
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
  filter: { status: 'active' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `shopDomain` | `string` | Yes | Your Shopify store domain |
| `accessToken` | `string` | Yes | Shopify Admin API access token |
| `apiVersion` | `string` | No | Shopify API version (defaults to latest) |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to Shopify resource types |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The Shopify provider supports the following resources:

- `products`: Store products
- `orders`: Customer orders
- `customers`: Store customers
- `collections`: Product collections
- `inventory`: Inventory items and levels
- `fulfillments`: Order fulfillments
- `discounts`: Promotional discounts
- `metafields`: Custom metadata

## Integration with Shopify

The provider translates Zopio's data queries into Shopify Admin API calls, handling:

- Authentication with access token
- Pagination with cursor-based pagination
- Filtering by resource attributes
- Sorting by creation date and other fields
- Creating and updating e-commerce resources
- GraphQL queries for complex data requirements

## Shopify-Specific Features

- Support for both REST and GraphQL APIs
- Bulk operations for large datasets
- Webhook management
- Rate limit handling
- Support for metafields and custom data
