# @repo/trigger

## Overview

The `@repo/trigger` package provides integration with Trigger.dev for background job processing and event-driven workflows in Zopio applications. It offers a pre-configured client and utilities for sending events to Trigger.dev, enabling reliable background processing and workflow automation.

## Module Categories

### Core Client

- **Trigger Client**: Pre-configured Trigger.dev client for Zopio applications
- **Event Handling**: Utilities for sending events to Trigger.dev

## Usage Guidelines

### Basic Usage

```typescript
import { client, sendEvent } from '@repo/trigger';

// Define a job
const job = client.defineJob({
  id: 'send-welcome-email',
  name: 'Send Welcome Email',
  version: '1.0.0',
  trigger: client.triggers.event({
    name: 'user.created',
  }),
  run: async (payload, io) => {
    await io.logger.info('Sending welcome email', { userId: payload.userId });
    // Send email logic here
    return { success: true };
  },
});

// Send an event to trigger the job
await sendEvent('user.created', { 
  userId: 'user_123', 
  email: 'user@example.com' 
});
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/trigger
```

## Environment Variables

| Variable | Description | Required | Format |
|----------|-------------|----------|--------|
| `TRIGGER_API_KEY` | API key for Trigger.dev | Yes | Trigger.dev API key |
| `TRIGGER_API_URL` | Custom API URL (optional) | No | URL (defaults to https://api.trigger.dev) |

## Development Guidelines

### Project Structure

```
trigger/
├── index.ts      # Main exports with client configuration
└── package.json  # Package dependencies
```

### Dependencies

- `@trigger.dev/sdk`: Trigger.dev SDK for job definitions and event handling

### Best Practices

1. **Environment Variables**: Always ensure the `TRIGGER_API_KEY` is set in production environments.
2. **Error Handling**: Use the provided `sendEvent` function which includes error handling.
3. **Job Versioning**: Always version your jobs to manage changes safely.
4. **Logging**: Use the provided IO context for logging in job runs.
5. **Event Naming**: Use consistent event naming conventions (e.g., `resource.action`).

## Integration Examples

### User Registration Workflow

```typescript
// jobs/user-registration.ts
import { client } from '@repo/trigger';
import { sendEmail } from '@repo/email';

export const userRegistrationJob = client.defineJob({
  id: 'user-registration-workflow',
  name: 'User Registration Workflow',
  version: '1.0.0',
  trigger: client.triggers.event({
    name: 'user.registered',
  }),
  run: async (payload, io) => {
    const { userId, email, name } = payload;
    
    // Log the start of the workflow
    await io.logger.info('Starting user registration workflow', { userId });
    
    // Send welcome email
    await io.runTask('send-welcome-email', async () => {
      await sendEmail({
        to: email,
        template: 'welcome',
        data: { name },
      });
    });
    
    // Add user to mailing list after a delay
    await io.wait('wait-for-24-hours', { seconds: 86400 });
    await io.runTask('add-to-mailing-list', async () => {
      // Add to mailing list logic
    });
    
    return { success: true };
  },
});
```

### Scheduled Report Generation

```typescript
// jobs/generate-reports.ts
import { client } from '@repo/trigger';
import { generateReport } from '../services/reports';

export const weeklyReportJob = client.defineJob({
  id: 'weekly-report-generation',
  name: 'Weekly Report Generation',
  version: '1.0.0',
  trigger: client.triggers.schedule({
    cron: '0 9 * * 1', // Every Monday at 9 AM
  }),
  run: async (payload, io) => {
    await io.logger.info('Starting weekly report generation');
    
    // Generate the report
    const reportUrl = await io.runTask('generate-report', async () => {
      return await generateReport('weekly');
    });
    
    // Send notification with the report URL
    await io.runTask('send-notification', async () => {
      await sendEvent('report.generated', {
        type: 'weekly',
        url: reportUrl,
      });
    });
    
    return { reportUrl };
  },
});
```

### API Integration with Retry Logic

```typescript
// jobs/sync-external-data.ts
import { client } from '@repo/trigger';
import { fetchExternalData, updateDatabase } from '../services/data';

export const syncExternalDataJob = client.defineJob({
  id: 'sync-external-data',
  name: 'Sync External Data',
  version: '1.0.0',
  trigger: client.triggers.event({
    name: 'data.sync.requested',
  }),
  run: async (payload, io) => {
    const { source, dataType } = payload;
    
    // Fetch data with retry logic
    const data = await io.runTask(
      'fetch-external-data',
      async () => {
        return await fetchExternalData(source, dataType);
      },
      {
        retry: {
          maxAttempts: 3,
          minTimeoutInMs: 1000,
          maxTimeoutInMs: 10000,
          factor: 2,
        },
      }
    );
    
    // Update database with fetched data
    await io.runTask('update-database', async () => {
      await updateDatabase(dataType, data);
    });
    
    return { recordsProcessed: data.length };
  },
});
```

## Documentation References

- [Trigger.dev Documentation](https://trigger.dev/docs)
- [Job Definition Reference](https://trigger.dev/docs/documentation/concepts/jobs)
- [Event Triggers](https://trigger.dev/docs/documentation/triggers/events)
- [Scheduled Triggers](https://trigger.dev/docs/documentation/triggers/scheduled)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure proper error handling in all job definitions.
3. Document any new features or changes to existing ones.
4. Version jobs appropriately when making changes.

## License

MIT
