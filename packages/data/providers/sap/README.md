# SAP Provider

## Overview
SAP data provider for Zopio framework that implements the CRUD interface for SAP ERP and S/4HANA systems.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a SAP provider instance
const dataProvider = createDataProvider({
  type: 'sap',
  config: {
    baseUrl: 'https://your-sap-gateway.com/sap/opu/odata/sap',
    username: 'your-sap-username',
    password: 'your-sap-password',
    // Optional client number
    client: '100',
    // Optional entity mapping
    entityMapping: {
      products: 'PRODUCT_SRV/Products', // Maps 'products' resource to SAP OData entity
      customers: 'CUSTOMER_SRV/Customers', // Maps 'customers' resource to SAP OData entity
      salesOrders: 'SALESORDER_SRV/SalesOrders' // Maps 'salesOrders' resource to SAP OData entity
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'products',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'Name', order: 'asc' },
  filter: { Category: 'Electronics' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `baseUrl` | `string` | Yes | Base URL of your SAP OData services |
| `username` | `string` | Yes | SAP username |
| `password` | `string` | Yes | SAP password |
| `client` | `string` | No | SAP client number |
| `entityMapping` | `Record<string, string>` | No | Maps resource names to SAP OData entity paths |
| `csrfProtection` | `boolean` | No | Whether to use CSRF token protection (default: true) |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of entities with pagination, sorting, and filtering
- `getOne`: Retrieve a single entity by ID
- `create`: Create a new entity
- `update`: Update an existing entity
- `deleteOne`: Delete an entity by ID

## Integration with SAP

The provider translates Zopio's data queries into SAP OData API calls, handling:

- Authentication with basic auth
- CSRF token handling for write operations
- Pagination with $skip/$top parameters
- Filtering with $filter parameter
- Sorting with $orderby parameter
- Field selection with $select parameter
- Expanding related entities with $expand parameter

## SAP-Specific Features

- Support for SAP OData v2 and v4 services
- Handling of SAP-specific data types
- Batch operations for improved performance
- Support for SAP Gateway services
- Integration with SAP S/4HANA Cloud APIs
