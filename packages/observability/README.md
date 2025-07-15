# @repo/observability

## Overview

The `@repo/observability` package provides a comprehensive solution for monitoring, logging, and error tracking in Zopio applications. Built on top of Sentry and Logtail, it offers a unified API for error reporting, performance monitoring, and structured logging with full support for the Next.js App Router.

## Module Categories

### Core Components

- **Sentry Integration**: Pre-configured Sentry client for error tracking and performance monitoring
- **Logtail Integration**: Structured logging with Logtail for Next.js applications
- **Environment Configuration**: Type-safe environment variable handling with Zod validation

### Error Handling

- **Error Parsing**: Utilities for parsing and formatting errors
- **Error Reporting**: Automatic error reporting to Sentry
- **Error Boundaries**: React error boundaries for graceful error handling

### Monitoring

- **Performance Monitoring**: Automatic performance tracking for web vitals and transactions
- **Session Replay**: Configurable session replay for debugging user issues
- **Status Monitoring**: Application status monitoring and reporting

## Usage Guidelines

### Basic Setup

First, ensure your environment variables are properly configured:

```bash
# .env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/project
LOGTAIL_TOKEN=your_logtail_token
```

Initialize Sentry in your Next.js application:

```tsx
// app/layout.tsx
import { initializeSentry } from '@repo/observability/client';

// Initialize Sentry
initializeSentry();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Error Handling

```tsx
import { parseError } from '@repo/observability/error';

try {
  // Some operation that might fail
  await fetchData();
} catch (error) {
  // Parse and report the error
  const errorMessage = parseError(error);
  
  // Display the error message to the user
  return <div>Error: {errorMessage}</div>;
}
```

### Logging

```tsx
import { log } from '@repo/observability/log';

// Log different levels
log.info('User signed in', { userId: 'user-123' });
log.warn('Rate limit approaching', { endpoint: '/api/data', remaining: 10 });
log.error('Failed to process payment', { orderId: 'order-456', error: 'Insufficient funds' });

// With context
log.withContext({ requestId: 'req-789' }).info('Processing request');
```

### Performance Monitoring

```tsx
import { captureEvent } from '@sentry/nextjs';
import { startTransaction } from '@repo/observability/performance';

async function processData(data: unknown) {
  // Start a transaction for performance monitoring
  const transaction = startTransaction({
    name: 'process-data',
    op: 'data.process',
  });
  
  try {
    // Process the data
    const result = await someExpensiveOperation(data);
    
    // Add context to the transaction
    transaction.setData('dataSize', data.length);
    
    // Finish the transaction
    transaction.finish();
    
    return result;
  } catch (error) {
    // Capture the error with the transaction context
    captureEvent({
      message: 'Data processing failed',
      level: 'error',
      extra: { error },
    });
    
    // Finish the transaction with error status
    transaction.setStatus('internal_error');
    transaction.finish();
    
    throw error;
  }
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/observability
```

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry Data Source Name | Yes | `https://your-sentry-dsn.ingest.sentry.io/project` |
| `SENTRY_AUTH_TOKEN` | Sentry authentication token for source maps | No | `your_sentry_auth_token` |
| `SENTRY_PROJECT` | Sentry project name | No | `zopio` |
| `SENTRY_ORG` | Sentry organization name | No | `your-org` |
| `LOGTAIL_TOKEN` | Logtail API token | No | `your_logtail_token` |

## Development Guidelines

### Error Handling Best Practices

1. Always use the `parseError` utility to handle errors consistently
2. Add context to errors when possible to aid debugging
3. Use appropriate error levels based on severity
4. Create custom error classes for specific error types
5. Avoid exposing sensitive information in error messages

### Logging Best Practices

1. Use appropriate log levels (info, warn, error)
2. Include relevant context with each log entry
3. Structure log data for easier querying
4. Avoid logging sensitive information
5. Use consistent naming conventions for log fields

## Integration Examples

### With Next.js App Router

```tsx
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
const { withObservability } = require('@repo/observability/next-config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration
};

// Apply observability configuration
const configWithObservability = withObservability(nextConfig);

// Apply Sentry configuration
module.exports = withSentryConfig(
  configWithObservability,
  {
    // Sentry webpack plugin options
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // Additional Sentry configuration options
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

### Error Boundary Component

```tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { captureException } from '@sentry/nextjs';
import { parseError } from '@repo/observability/error';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode | ((error: Error) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report the error to Sentry
    captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const { error } = this.state;
      
      if (typeof fallback === 'function' && error) {
        return fallback(error);
      }
      
      return fallback;
    }

    return this.props.children;
  }
}

// Usage
export function ErrorFallback({ error }: { error: Error }) {
  const errorMessage = parseError(error);
  
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
    </div>
  );
}

// In your component
export default function MyComponent() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {/* Your component content */}
    </ErrorBoundary>
  );
}
```

### Status Monitoring

```tsx
// app/api/status/route.ts
import { NextResponse } from 'next/server';
import { getSystemStatus } from '@repo/observability/status';

export async function GET() {
  const status = await getSystemStatus();
  
  return NextResponse.json(status);
}
```

## Documentation References

- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Logtail Documentation](https://betterstack.com/docs/logs/javascript/)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [Zod Documentation](https://zod.dev/)

## Contributing Guidelines

1. Follow the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
