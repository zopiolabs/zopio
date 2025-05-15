# KillBill Provider

## Overview
KillBill data provider for Zopio framework that implements the CRUD interface for KillBill open-source subscription billing platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a KillBill provider instance
const dataProvider = createDataProvider({
  type: 'killbill',
  config: {
    apiUrl: 'https://your-killbill-instance.com',
    username: 'admin',
    password: 'password',
    apiKey: 'your-api-key',
    apiSecret: 'your-api-secret',
    // Optional resource mapping
    resourceMapping: {
      accounts: 'accounts',
      subscriptions: 'subscriptions',
      invoices: 'invoices'
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'accounts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdDate', order: 'desc' },
  filter: { accountState: 'ACTIVE' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | `string` | Yes | URL of your KillBill instance |
| `username` | `string` | Yes | KillBill username |
| `password` | `string` | Yes | KillBill password |
| `apiKey` | `string` | Yes | Your KillBill API key |
| `apiSecret` | `string` | Yes | Your KillBill API secret |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to KillBill resource types |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The KillBill provider supports the following resources:

- `accounts`: Customer accounts
- `subscriptions`: Customer subscriptions
- `invoices`: Billing invoices
- `payments`: Payment transactions
- `catalogs`: Product catalogs
- `plans`: Subscription plans
- `bundles`: Subscription bundles

## Integration with KillBill

The provider translates Zopio's data queries into KillBill API calls, handling:

- Authentication with basic auth and API credentials
- Pagination with offset/limit
- Filtering by account attributes
- Sorting by creation date and other fields
- Creating and updating billing resources
