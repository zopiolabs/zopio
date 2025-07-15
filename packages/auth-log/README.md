# @repo/auth-log

## Overview

The `@repo/auth-log` package provides a comprehensive logging system for authentication and authorization decisions in Zopio applications. It enables detailed audit trails of access attempts, permission checks, and security events, which are essential for compliance, debugging, and security monitoring.

## Module Categories

### Core Components

- **Logger**: Configurable logging engine with multiple output adapters
- **Adapters**: Pluggable logging destinations (console, file, database, cloud services)
- **Event Types**: Structured logging for different auth-related events

### Utilities

- **Type Definitions**: TypeScript types for log entries and events
- **Configuration**: Environment-based logger configuration

## Usage Guidelines

### Basic Setup

1. Configure the logger in your environment:

```env
# In your .env file
AUTH_LOG_LEVEL=info
AUTH_LOG_ADAPTER=console
AUTH_LOG_RETENTION_DAYS=30
```

2. Use the logger in your code:

```tsx
import { logAccessAttempt } from '@repo/auth-log';

// Log an access attempt
logAccessAttempt({
  context: {
    userId: 'user-123',
    role: 'editor',
    tenantId: 'tenant-456',
  },
  resource: 'documents',
  action: 'edit',
  record: { id: 'doc-789' },
  timestamp: new Date().toISOString(),
  can: true,
  reason: 'User is document owner',
});
```

### Configuring Log Adapters

```tsx
// In your app initialization
import { configureLogger } from '@repo/auth-log/config';

configureLogger({
  level: 'info',
  adapter: 'database',
  options: {
    connectionString: process.env.DATABASE_URL,
    tableName: 'auth_logs',
  },
});
```

### Available Adapters

```tsx
// Console adapter (default)
configureLogger({
  adapter: 'console',
  options: {
    prettyPrint: true,
    includeTimestamp: true,
  },
});

// File adapter
configureLogger({
  adapter: 'file',
  options: {
    path: './logs/auth.log',
    rotateDaily: true,
    maxFiles: 30,
  },
});

// Database adapter
configureLogger({
  adapter: 'database',
  options: {
    connectionString: process.env.DATABASE_URL,
    tableName: 'auth_logs',
  },
});

// Cloud service adapters
configureLogger({
  adapter: 'cloudwatch',
  options: {
    region: 'us-east-1',
    logGroupName: 'zopio-auth-logs',
    logStreamName: 'production',
  },
});
```

### Custom Log Events

```tsx
import { logEvent } from '@repo/auth-log';

// Log a custom auth event
logEvent({
  type: 'user.role_changed',
  userId: 'user-123',
  data: {
    previousRole: 'user',
    newRole: 'admin',
    changedBy: 'user-456',
  },
  timestamp: new Date().toISOString(),
  severity: 'info',
});
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/auth-log
```

## Related Packages

The `@repo/auth-log` package works with other authentication packages in the Zopio ecosystem:

- **@repo/auth**: Core authentication package
- **@repo/auth-rbac**: Role-based access control system
- **@repo/auth-abac**: Attribute-based access control system
- **@repo/auth-hooks**: React hooks for authorization
- **@repo/auth-runner**: Runtime authorization evaluation engine

## Development Guidelines

### Creating Custom Adapters

To create a custom logging adapter:

```tsx
// In your custom-adapter.ts
import type { LogAdapter, LogEntry } from '@repo/auth-log/types';

export class MyCustomAdapter implements LogAdapter {
  constructor(private options: Record<string, unknown>) {
    // Initialize your adapter with options
  }

  async write(entry: LogEntry): Promise<void> {
    // Implement your custom logging logic
    // For example, send to a third-party service
  }

  async close(): Promise<void> {
    // Clean up resources if needed
  }
}

// Register your adapter
import { registerAdapter } from '@repo/auth-log/config';

registerAdapter('my-custom', (options) => new MyCustomAdapter(options));
```

### Log Filtering and Enrichment

```tsx
// In your app initialization
import { configureLogger } from '@repo/auth-log/config';

configureLogger({
  adapter: 'console',
  filter: (entry) => {
    // Only log failed access attempts
    return entry.type === 'access' && !entry.can;
  },
  enrich: (entry) => {
    // Add additional context to all log entries
    return {
      ...entry,
      environment: process.env.NODE_ENV,
      appVersion: process.env.APP_VERSION,
      serverName: os.hostname(),
    };
  },
});
```

## Integration Examples

### With Next.js Middleware

```tsx
// In your middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { logEvent } from '@repo/auth-log';

export async function middleware(request) {
  const { userId } = auth();
  
  // Log access to protected routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    logEvent({
      type: 'route.access',
      userId: userId || 'anonymous',
      data: {
        path: request.nextUrl.pathname,
        method: request.method,
        hasAccess: !!userId,
      },
      timestamp: new Date().toISOString(),
      severity: userId ? 'info' : 'warn',
    });
    
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### With API Error Handling

```tsx
// In your API error handler
import { logEvent } from '@repo/auth-log';

export function handleApiError(error, request, userId) {
  // Log authentication and authorization errors
  if (error.code === 'unauthorized' || error.code === 'forbidden') {
    logEvent({
      type: 'api.auth_error',
      userId: userId || 'anonymous',
      data: {
        path: request.url,
        method: request.method,
        errorCode: error.code,
        errorMessage: error.message,
      },
      timestamp: new Date().toISOString(),
      severity: 'warn',
    });
  }
  
  // Return appropriate error response
  return new Response(
    JSON.stringify({ error: error.message }),
    { 
      status: error.code === 'unauthorized' ? 401 : 403,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

### With Auth Events

```tsx
// In your auth webhook handler
import { logEvent } from '@repo/auth-log';

export async function POST(request: Request) {
  const payload = await request.json();
  
  // Log authentication events
  if (payload.type === 'user.created') {
    logEvent({
      type: 'user.created',
      userId: payload.data.id,
      data: {
        email: payload.data.email,
        createdAt: payload.data.created_at,
      },
      timestamp: new Date().toISOString(),
      severity: 'info',
    });
  } else if (payload.type === 'session.created') {
    logEvent({
      type: 'session.created',
      userId: payload.data.user_id,
      data: {
        sessionId: payload.data.id,
        ipAddress: payload.data.ip_address,
        userAgent: payload.data.user_agent,
      },
      timestamp: new Date().toISOString(),
      severity: 'info',
    });
  }
  
  return new Response('Webhook processed', { status: 200 });
}
```

## Documentation References

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [NIST Logging Guidelines](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf)
- [GDPR Compliance for Logs](https://gdpr-info.eu/)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
