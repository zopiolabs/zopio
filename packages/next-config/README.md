# @repo/next-config

## Overview

The `@repo/next-config` package provides standardized Next.js configuration for Zopio applications. It includes shared configuration for images, rewrites, webpack settings, bundle analysis, and environment variable validation. This package ensures consistent configuration across all Next.js applications in the Zopio monorepo.

## Module Categories

### Configuration

- **Base Configuration**: Shared Next.js configuration defaults
- **Bundle Analysis**: Integration with @next/bundle-analyzer
- **Prisma Support**: Monorepo workaround for Prisma in Next.js

### Environment

- **Environment Variables**: Type-safe environment variable validation
- **URL Configuration**: Standard URL environment variables

## Usage Guidelines

### Basic Usage

```typescript
// next.config.js
import { withConfig, withAnalyzer } from '@repo/next-config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your app-specific configuration
  reactStrictMode: true,
};

// Apply base configuration and analyzer
export default withAnalyzer(withConfig(nextConfig));
```

### Environment Variables

```typescript
// app/api/example/route.ts
import { keys } from '@repo/next-config/keys';

export async function GET() {
  // Type-safe environment variables
  const env = keys();
  
  return Response.json({
    appUrl: env.NEXT_PUBLIC_APP_URL,
    webUrl: env.NEXT_PUBLIC_WEB_URL,
  });
}
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/next-config
```

## Environment Variables

| Variable | Description | Required | Format |
|----------|-------------|----------|--------|
| `NEXT_PUBLIC_APP_URL` | Base URL for the app | Yes | URL format |
| `NEXT_PUBLIC_WEB_URL` | Base URL for the web | Yes | URL format |
| `NEXT_PUBLIC_API_URL` | Base URL for the API | No | URL format |
| `NEXT_PUBLIC_DOCS_URL` | Base URL for the docs | No | URL format |
| `ANALYZE` | Enable bundle analysis | No | "true" to enable |

## Development Guidelines

### Project Structure

```plaintext
next-config/
├── index.ts        # Main exports with Next.js configuration
├── keys.ts         # Environment variable validation
└── package.json    # Package dependencies
```

### Dependencies

- `@next/bundle-analyzer`: Bundle size analysis tool
- `@prisma/nextjs-monorepo-workaround-plugin`: Fixes Prisma issues in Next.js monorepos
- `@t3-oss/env-nextjs`: Type-safe environment variable validation
- `zod`: Schema validation

### Best Practices

1. **Environment Variables**: Always validate environment variables using the provided `keys` function.
2. **Configuration Extension**: Use `withConfig` to extend the base configuration rather than creating a new one.
3. **Bundle Analysis**: Use `withAnalyzer` to enable bundle analysis when needed.
4. **Rewrites**: Add custom rewrites through the configuration object passed to `withConfig`.
5. **Image Optimization**: Use the pre-configured image optimization settings.

## Integration Examples

### Next.js App with Custom Image Domains

```typescript
// next.config.js
import { withConfig, withAnalyzer } from '@repo/next-config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
      },
    ],
  },
};

// The base config's image settings will be merged with the custom ones
export default withAnalyzer(withConfig(nextConfig));
```

### Custom API Rewrites

```typescript
// next.config.js
import { withConfig } from '@repo/next-config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add custom rewrites
  async rewrites() {
    return [
      {
        source: '/api/legacy/:path*',
        destination: 'https://legacy-api.example.com/:path*',
      },
    ];
  },
};

// Both base rewrites and custom rewrites will be included
export default withConfig(nextConfig);
```

### Bundle Analysis Configuration

```typescript
// next.config.js
import { withConfig, withAnalyzer } from '@repo/next-config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your app-specific configuration
};

// Enable bundle analysis with ANALYZE=true environment variable
export default withAnalyzer(withConfig(nextConfig));

// Usage: ANALYZE=true pnpm build
```

### Environment Variable Usage in Components

```typescript
// components/SiteHeader.tsx
'use client';

import { keys } from '@repo/next-config/keys';

export function SiteHeader() {
  const env = keys();
  
  return (
    <header>
      <nav>
        <a href={env.NEXT_PUBLIC_APP_URL}>App</a>
        <a href={env.NEXT_PUBLIC_WEB_URL}>Web</a>
        {env.NEXT_PUBLIC_DOCS_URL && (
          <a href={env.NEXT_PUBLIC_DOCS_URL}>Docs</a>
        )}
      </nav>
    </header>
  );
}
```

## Documentation References

- [Next.js Configuration Documentation](https://nextjs.org/docs/app/api-reference/next-config-js)
- [Bundle Analyzer Documentation](https://www.npmjs.com/package/@next/bundle-analyzer)
- [T3 Env Documentation](https://env.t3.gg/docs/nextjs)
- [Prisma with Next.js](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-monorepo)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure all environment variables are properly validated.
3. Test configuration changes with multiple Next.js applications.
4. Document any new configuration options or environment variables.

## License

MIT
