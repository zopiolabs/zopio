# n8n Provider

## Overview
n8n data provider for Zopio framework that implements the CRUD interface for n8n workflow automation platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create an n8n provider instance
const dataProvider = createDataProvider({
  type: 'n8n',
  config: {
    apiUrl: 'https://your-n8n-instance.com/api',
    apiKey: 'your-n8n-api-key',
    // Optional resource mapping
    resourceMapping: {
      workflows: 'workflows',
      executions: 'executions',
      credentials: 'credentials'
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'workflows',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'updatedAt', order: 'desc' },
  filter: { active: true }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | `string` | Yes | URL of your n8n API |
| `apiKey` | `string` | Yes | Your n8n API key |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to n8n resource types |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The n8n provider supports the following resources:

- `workflows`: n8n workflows
- `executions`: Workflow executions
- `credentials`: Stored credentials
- `tags`: Workflow tags
- `variables`: Workflow variables

## Integration with n8n

The provider translates Zopio's data queries into n8n API calls, handling:

- Authentication with API key
- Pagination with offset/limit
- Filtering by workflow attributes
- Sorting by creation date and other fields
- Creating and updating workflow resources
