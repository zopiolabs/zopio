# @repo/feature-flags

## Overview

The `@repo/feature-flags` package provides a robust feature flag management system for Zopio applications. It enables gradual feature rollouts, A/B testing, and controlled feature access based on user segments. Built on top of the Vercel Flags framework, it integrates with PostHog analytics for data-driven feature decisions.

## Module Categories

### Core Components

- **Feature Flag API**: Type-safe API for creating and checking feature flags
- **Environment Configuration**: Type-safe environment variable handling with Zod validation
- **Analytics Integration**: PostHog integration for data-driven feature decisions

### UI Components

- **Toolbar**: Vercel Toolbar integration for managing feature flags during development

### Utilities

- **Access Control**: API route handlers for feature flag access control
- **Flag Creation**: Utilities for creating and managing feature flags

## Usage Guidelines

### Basic Setup

First, ensure your environment variables are properly configured:

```bash
# .env
FLAGS_SECRET=your_flags_secret_key
```

### Using Feature Flags

```tsx
import { showBetaFeature } from '@repo/feature-flags';

// In a React component
export default function MyComponent() {
  const isBetaFeatureEnabled = showBetaFeature.useFlag();

  return (
    <div>
      <h1>My Component</h1>
      {isBetaFeatureEnabled && <BetaFeature />}
    </div>
  );
}

// In a server component
export default async function MyServerComponent() {
  const isBetaFeatureEnabled = await showBetaFeature.isEnabled();

  return (
    <div>
      <h1>My Server Component</h1>
      {isBetaFeatureEnabled && <BetaFeature />}
    </div>
  );
}
```

### Creating New Feature Flags

Add new feature flags in the `index.ts` file:

```tsx
// index.ts
import { createFlag } from './lib/create-flag';

export const showBetaFeature = createFlag('showBetaFeature');
export const newFeature = createFlag('newFeature');
```

### Adding Feature Flag API Route

```tsx
// app/api/flags/route.ts
import { getFlags } from '@repo/feature-flags/access';
import { NextRequest } from 'next/server';

export const GET = (request: NextRequest) => getFlags(request);
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/feature-flags
```

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `FLAGS_SECRET` | Secret key for Vercel Flags | Yes | `flags_live_xxxxxxxxxxxx` |

## Development Guidelines

### Adding New Feature Flags

When creating new feature flags:

1. Use descriptive names that clearly indicate the feature's purpose
2. Add the flag to the `index.ts` file using the `createFlag` utility
3. Document the flag's purpose and usage in code comments
4. Consider adding default values based on environments

### Using the Vercel Toolbar

The Vercel Toolbar provides a convenient way to toggle feature flags during development:

1. Add the `Toolbar` component to your app's layout:

```tsx
// app/layout.tsx
import { Toolbar } from '@repo/feature-flags/components/toolbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toolbar />
      </body>
    </html>
  );
}
```

2. Access the toolbar by pressing `Ctrl+Shift+F` (or `Cmd+Shift+F` on macOS)
3. Toggle feature flags directly from the toolbar interface

## Integration Examples

### With Next.js App Router

```tsx
// app/page.tsx
import { showBetaFeature } from '@repo/feature-flags';

export default async function HomePage() {
  const isBetaFeatureEnabled = await showBetaFeature.isEnabled();
  
  return (
    <div>
      <h1>Home Page</h1>
      {isBetaFeatureEnabled ? (
        <div>
          <h2>Beta Feature</h2>
          <p>You're seeing our new beta feature!</p>
        </div>
      ) : (
        <div>
          <h2>Standard Feature</h2>
          <p>Standard feature experience</p>
        </div>
      )}
    </div>
  );
}
```

### With User Segmentation

```tsx
// lib/create-flag.ts
import { analytics } from '@repo/analytics/posthog/server';
import { auth } from '@repo/auth/server';
import { flag } from 'flags/next';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const { userId } = await auth();

      if (!userId) {
        return this.defaultValue as boolean;
      }

      // Use PostHog to determine if the feature should be enabled for this user
      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
```

### With Client Components

```tsx
'use client';

import { showBetaFeature } from '@repo/feature-flags';
import { Button } from '@repo/design-system/ui/button';

export function FeatureFlagDemo() {
  const isBetaFeatureEnabled = showBetaFeature.useFlag();
  
  return (
    <div>
      <h2>Feature Flag Demo</h2>
      {isBetaFeatureEnabled ? (
        <Button variant="default">New Beta Button</Button>
      ) : (
        <Button variant="secondary">Standard Button</Button>
      )}
    </div>
  );
}
```

## Documentation References

- [Vercel Flags Documentation](https://vercel.com/docs/workflow-collaboration/flags)
- [PostHog Feature Flags](https://posthog.com/docs/feature-flags)
- [Zod Documentation](https://zod.dev/)

## Contributing Guidelines

1. Follow the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Document new feature flags thoroughly
5. Follow the project's naming conventions

## License

MIT
