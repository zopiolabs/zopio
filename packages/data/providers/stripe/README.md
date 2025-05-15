# Stripe Provider

## Overview
Stripe data provider for Zopio framework that implements the CRUD interface for Stripe payment processing platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers stripe
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Stripe provider instance
const dataProvider = createDataProvider({
  type: 'stripe',
  config: {
    apiKey: 'your-stripe-secret-key',
    // Optional resource mapping
    resourceMapping: {
      customers: 'customers',
      products: 'products',
      subscriptions: 'subscriptions'
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'customers',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'created', order: 'desc' },
  filter: { email: 'user@example.com' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your Stripe secret API key |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to Stripe resource types |
| `maxNetworkRetries` | `number` | No | Number of automatic network retries (default: 2) |
| `timeout` | `number` | No | Request timeout in milliseconds (default: 30000) |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The Stripe provider supports the following resources:

- `customers`: Stripe customers
- `products`: Products in your catalog
- `prices`: Product prices
- `subscriptions`: Customer subscriptions
- `invoices`: Customer invoices
- `payment_intents`: Payment processing intents
- `payment_methods`: Stored payment methods
- `charges`: Payment charges
- `refunds`: Payment refunds
- `disputes`: Payment disputes
- `events`: Stripe webhook events

## Integration with Stripe

The provider translates Zopio's data queries into Stripe API calls, handling:

- Authentication with API key
- Pagination with cursor-based pagination
- Filtering by resource attributes
- Sorting by creation date and other fields
- Creating and updating payment resources
- Error handling and retries

## Stripe-Specific Features

- Support for Stripe Connect multi-account scenarios
- Expanding related resources
- Handling of idempotency keys for safe retries
- Support for test mode vs. live mode
- Webhook event processing
