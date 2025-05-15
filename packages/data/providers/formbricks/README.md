# Formbricks Provider

## Overview
Formbricks data provider for Zopio framework that implements the CRUD interface for Formbricks open-source survey and form platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Formbricks provider instance
const dataProvider = createDataProvider({
  type: 'formbricks',
  config: {
    apiUrl: 'https://your-formbricks-instance.com/api',
    apiKey: 'your-formbricks-api-key',
    environmentId: 'your-environment-id',
    // Optional resource mapping
    resourceMapping: {
      surveys: 'surveys',
      responses: 'responses',
      users: 'people'
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'surveys',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'desc' },
  filter: { status: 'active' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | `string` | Yes | URL of your Formbricks API |
| `apiKey` | `string` | Yes | Your Formbricks API key |
| `environmentId` | `string` | Yes | Formbricks environment ID |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to Formbricks resource types |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The Formbricks provider supports the following resources:

- `surveys`: Formbricks surveys
- `responses`: Survey responses
- `users`: People/respondents
- `questions`: Survey questions
- `actions`: User actions

## Integration with Formbricks

The provider translates Zopio's data queries into Formbricks API calls, handling:

- Authentication with API key
- Pagination with limit/offset
- Filtering by survey attributes
- Sorting by creation date and other fields
- Creating and updating surveys and responses
