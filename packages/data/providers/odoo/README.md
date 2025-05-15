# Odoo Provider

## Overview
Odoo data provider for Zopio framework that implements the CRUD interface for Odoo ERP system.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create an Odoo provider instance
const dataProvider = createDataProvider({
  type: 'odoo',
  config: {
    url: 'https://your-odoo-instance.com',
    db: 'your-database-name',
    username: 'admin',
    password: 'your-password',
    // Optional model mapping
    modelMapping: {
      products: 'product.product', // Maps 'products' resource to 'product.product' Odoo model
      customers: 'res.partner', // Maps 'customers' resource to 'res.partner' Odoo model
      sales: 'sale.order' // Maps 'sales' resource to 'sale.order' Odoo model
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'products',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name', order: 'asc' },
  filter: { active: true, type: 'product' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `url` | `string` | Yes | URL of your Odoo instance |
| `db` | `string` | Yes | Odoo database name |
| `username` | `string` | Yes | Odoo username |
| `password` | `string` | Yes | Odoo password |
| `modelMapping` | `Record<string, string>` | No | Maps resource names to Odoo model names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of records with pagination, sorting, and filtering
- `getOne`: Retrieve a single record by ID
- `create`: Create a new record
- `update`: Update an existing record
- `deleteOne`: Delete a record by ID

## Supported Resources

The Odoo provider can work with any Odoo model. Common examples include:

- `product.product`: Products
- `product.template`: Product templates
- `res.partner`: Partners (customers, suppliers)
- `sale.order`: Sales orders
- `purchase.order`: Purchase orders
- `account.invoice`: Invoices
- `stock.move`: Inventory movements
- `hr.employee`: Employees

## Integration with Odoo

The provider translates Zopio's data queries into Odoo XML-RPC API calls, handling:

- Authentication with username/password
- Pagination with offset/limit
- Domain filtering (Odoo's filtering system)
- Sorting by any field
- Field selection for optimized data retrieval
- Many-to-one, one-to-many, and many-to-many relationships
