# @repo/analytics

## Overview

The `@repo/analytics` package provides a unified analytics integration layer for Zopio applications. It combines multiple analytics providers (PostHog, Google Analytics, and Vercel Analytics) into a single, easy-to-use provider component with consistent configuration management.

## Module Categories

### Core Components

- **AnalyticsProvider**: A React component that wraps your application to enable analytics tracking
- **useAnalytics**: A React hook for accessing analytics functionality in client components

### Analytics Providers

- **PostHog**: Complete integration with both client and server-side tracking capabilities
- **Google Analytics**: Integration with Google Analytics 4 via the Next.js third-parties package
- **Vercel Analytics**: Built-in support for Vercel's web analytics

### Utilities

- **Environment Configuration**: Secure handling of analytics keys using environment variables with validation

## Usage Guidelines

### Basic Setup

1. Add your analytics keys to your environment variables:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Wrap your application with the AnalyticsProvider:

```tsx
// In your root layout.tsx
import { AnalyticsProvider } from '@repo/analytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

### Client-Side Event Tracking

```tsx
'use client';

import { useAnalytics } from '@repo/analytics/posthog/client';

export function FeatureButton() {
  const analytics = useAnalytics();
  
  const handleClick = () => {
    // Track custom events
    analytics.capture('feature_used', {
      feature: 'example_feature',
      source: 'button_click',
    });
    
    // Your feature logic here
  };
  
  return (
    <button onClick={handleClick}>
      Use Feature
    </button>
  );
}
```

### Server-Side Event Tracking

```tsx
import { analytics } from '@repo/analytics/posthog/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Track server-side events
  analytics.capture({
    distinctId: data.userId,
    event: 'api_request',
    properties: {
      endpoint: '/api/example',
      status: 200,
    },
  });
  
  return Response.json({ success: true });
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/analytics
```

## Development Guidelines

### Adding a New Analytics Provider

To add a new analytics provider:

1. Create a new file for the provider (e.g., `mixpanel.ts`)
2. Export the provider component or initialization function
3. Update the `keys.ts` file to include any required API keys
4. Integrate the provider into the main `AnalyticsProvider` in `index.tsx`

Example:

```tsx
// mixpanel.ts
import { init as initMixpanel } from 'mixpanel-browser';

export function MixpanelProvider({ children, token }) {
  // Initialize Mixpanel
  initMixpanel(token);
  
  return <>{children}</>;
}

// Then update keys.ts and index.tsx accordingly
```

### Configuration Best Practices

- Always use environment variables for API keys
- Validate keys using Zod schemas
- Handle missing configurations gracefully
- Add TypeScript types for all public APIs

## Integration Examples

### Page View Tracking

```tsx
'use client';

import { useAnalytics } from '@repo/analytics/posthog/client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function PageViewTracker() {
  const analytics = useAnalytics();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (analytics) {
      // Track page views when route changes
      analytics.capture('$pageview', {
        path: pathname,
        search: searchParams.toString(),
        url: `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
      });
    }
  }, [analytics, pathname, searchParams]);
  
  return null;
}
```

### User Identification

```tsx
'use client';

import { useAnalytics } from '@repo/analytics/posthog/client';
import { useEffect } from 'react';

export function UserIdentifier({ user }) {
  const analytics = useAnalytics();
  
  useEffect(() => {
    if (analytics && user) {
      // Identify the user when they log in
      analytics.identify(user.id, {
        name: user.name,
        email: user.email,
        plan: user.subscription?.plan,
      });
    }
  }, [analytics, user]);
  
  return null;
}
```

## Documentation References

- [PostHog Documentation](https://posthog.com/docs)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Next.js Third Parties Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT

## Future Implementation Plan

- [ ] Integration with Posthog alternate [Open Relay](https://github.com/openreplay/openreplay)
