# @repo/webhooks

## Overview

The `@repo/webhooks` package provides webhook management capabilities for Zopio applications using Svix. It enables sending webhook events to external endpoints and generating secure webhook portals for users to manage their webhook subscriptions.

## Module Categories

### Webhook Management

- **Event Sending**: Send webhook events to subscribers
- **Portal Generation**: Create secure portals for webhook subscription management

## Usage Guidelines

### Basic Usage

```typescript
import { webhooks } from '@repo/webhooks';

// Send a webhook event
await webhooks.send('user.created', {
  id: 'user_123',
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date().toISOString(),
});

// Generate a webhook management portal URL
const portalUrl = await webhooks.getAppPortal({
  name: 'My Application',
  urlTemplate: 'https://api.example.com/webhooks/{endpoint}',
});
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/webhooks
```

## Environment Variables

| Variable | Description | Required | Format |
|----------|-------------|----------|--------|
| `SVIX_TOKEN` | API token for Svix | Yes | Starts with `sk_` or `testsk_` |

## Development Guidelines

### Project Structure

```
webhooks/
├── index.ts      # Main exports
├── keys.ts       # Environment variable validation
├── lib/
│   └── svix.ts   # Svix implementation
└── package.json  # Package dependencies
```

### Dependencies

- `svix`: Svix SDK for webhook management
- `@repo/auth`: Authentication utilities
- `@t3-oss/env-nextjs`: Environment variable validation
- `zod`: Schema validation

### Best Practices

1. **Environment Variables**: Always validate environment variables using the provided `keys` function.
2. **Event Naming**: Use consistent event naming conventions (e.g., `resource.action`).
3. **Payload Structure**: Include the event type in the payload for better context.
4. **Error Handling**: Implement proper error handling for webhook operations.
5. **Authentication**: Ensure proper authentication before sending webhook events.

## Integration Examples

### API Route for Webhook Events

```typescript
// app/api/events/route.ts
import { webhooks } from '@repo/webhooks';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { eventType, payload } = await request.json();
    
    // Validate event type and payload
    if (!eventType || !payload) {
      return NextResponse.json(
        { error: 'Event type and payload are required' },
        { status: 400 }
      );
    }
    
    // Send webhook event
    await webhooks.send(eventType, payload);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send webhook event:', error);
    return NextResponse.json(
      { error: 'Failed to send webhook event' },
      { status: 500 }
    );
  }
}
```

### Webhook Portal Integration

```typescript
// app/api/webhooks/portal/route.ts
import { webhooks } from '@repo/webhooks';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Generate a webhook management portal URL
    const portalUrl = await webhooks.getAppPortal({
      name: 'Zopio Application',
      urlTemplate: `${process.env.API_URL}/api/webhooks/{endpoint}`,
    });
    
    return NextResponse.json({ portalUrl });
  } catch (error) {
    console.error('Failed to generate webhook portal:', error);
    return NextResponse.json(
      { error: 'Failed to generate webhook portal' },
      { status: 500 }
    );
  }
}
```

### Webhook Management Component

```tsx
// components/WebhookManager.tsx
'use client';

import { useState } from 'react';
import { Button } from '@repo/design-system/ui/button';

export function WebhookManager() {
  const [loading, setLoading] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  
  async function handleOpenPortal() {
    setLoading(true);
    
    try {
      const response = await fetch('/api/webhooks/portal');
      const data = await response.json();
      
      if (data.portalUrl) {
        // Open the portal URL in a new tab
        window.open(data.portalUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to open webhook portal:', error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Webhook Management</h2>
      <p>Configure webhook endpoints to receive real-time updates from our API.</p>
      <Button onClick={handleOpenPortal} disabled={loading}>
        {loading ? 'Loading...' : 'Manage Webhooks'}
      </Button>
    </div>
  );
}
```

### Event Trigger on User Creation

```typescript
// app/api/users/route.ts
import { webhooks } from '@repo/webhooks';
import { db } from '@repo/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Create user in database
    const user = await db.user.create({
      data: userData,
    });
    
    // Send webhook event for user creation
    await webhooks.send('user.created', {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    });
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## Documentation References

- [Svix Documentation](https://docs.svix.com/)
- [Webhook Best Practices](https://webhooks.fyi/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure all environment variables are properly validated.
3. Add appropriate error handling for webhook operations.
4. Document any new webhook features or changes to existing ones.

## License

MIT
