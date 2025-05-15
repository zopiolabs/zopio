# SyncOps Provider

## Overview
SyncOps data provider for Zopio framework that implements the CRUD interface for data synchronization operations across multiple systems.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a SyncOps provider instance
const dataProvider = createDataProvider({
  type: 'syncops',
  config: {
    apiUrl: 'https://your-syncops-instance.com/api',
    apiKey: 'your-syncops-api-key',
    projectId: 'your-project-id',
    // Optional resource mapping
    resourceMapping: {
      syncJobs: 'jobs',
      dataStreams: 'streams',
      mappings: 'mappings'
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'syncJobs',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'lastRunAt', order: 'desc' },
  filter: { status: 'active' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | `string` | Yes | URL of your SyncOps API |
| `apiKey` | `string` | Yes | Your SyncOps API key |
| `projectId` | `string` | Yes | SyncOps project ID |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to SyncOps resource types |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The SyncOps provider supports the following resources:

- `syncJobs`: Data synchronization jobs
- `dataStreams`: Data stream configurations
- `mappings`: Field mappings between systems
- `connections`: System connections
- `transformations`: Data transformation rules
- `executions`: Sync job execution history
- `schedules`: Scheduled sync operations

## Integration with SyncOps

The provider translates Zopio's data queries into SyncOps API calls, handling:

- Authentication with API key
- Pagination with offset/limit
- Filtering by job attributes
- Sorting by execution date and other fields
- Creating and updating synchronization configurations

## SyncOps-Specific Features

- Support for real-time and scheduled synchronization
- Data transformation and mapping
- Error handling and retry mechanisms
- Monitoring and logging of sync operations
- Support for bi-directional synchronization
