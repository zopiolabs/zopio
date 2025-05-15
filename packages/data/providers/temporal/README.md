# Temporal Provider

## Overview
Temporal workflow data provider for Zopio framework that implements the CRUD interface for Temporal workflow platform.

## Installation

```bash
# From your project root
npm install @repo/data-providers @temporalio/client
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Temporal provider instance
const dataProvider = createDataProvider({
  type: 'temporal',
  config: {
    apiUrl: 'https://your-temporal-instance.com:7233',
    namespace: 'default',
    // Optional connection options
    tls: {
      clientCertPair: {
        crt: 'path/to/client.crt',
        key: 'path/to/client.key',
      },
    },
    // Optional resource mapping
    resourceMapping: {
      workflows: 'workflows',
      activities: 'activities',
      taskQueues: 'taskQueues'
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'workflows',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'startTime', order: 'desc' },
  filter: { status: 'RUNNING' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiUrl` | `string` | Yes | URL of your Temporal server |
| `namespace` | `string` | No | Temporal namespace (defaults to 'default') |
| `tls` | `object` | No | TLS configuration for secure connections |
| `resourceMapping` | `Record<string, string>` | No | Maps resource names to Temporal resource types |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource (start a workflow)
- `update`: Update an existing resource (signal a workflow)
- `deleteOne`: Delete a resource by ID (terminate a workflow)

## Supported Resources

The Temporal provider supports the following resources:

- `workflows`: Workflow executions
- `activities`: Activity executions
- `taskQueues`: Task queues
- `schedules`: Scheduled workflows
- `namespaces`: Temporal namespaces
- `events`: Workflow history events

## Integration with Temporal

The provider translates Zopio's data queries into Temporal API calls, handling:

- Connection to Temporal server
- Authentication with mTLS if configured
- Pagination with token-based pagination
- Filtering by workflow attributes
- Sorting by execution time and other fields
- Starting and signaling workflows
- Querying workflow state

## Temporal-Specific Features

- Support for durable workflow execution
- Workflow signaling and queries
- Activity task management
- Error handling with retry policies
- Monitoring workflow execution history
- Support for workflow versioning
