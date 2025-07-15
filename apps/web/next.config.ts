/**
 * SPDX-License-Identifier: MIT
 */

import { env } from '@/env';
import { withCMS } from '@repo/cms/next-config';
import { withToolbar } from '@repo/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogging, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

// Initialize the base Next.js configuration with wrappers
let nextConfig: NextConfig = withToolbar(withLogging(config));

// Add remote patterns for images
nextConfig.images?.remotePatterns?.push({
  protocol: 'https',
  hostname: 'assets.basehub.com',
});

// Add redirects for legal pages
if (process.env.NODE_ENV === 'production') {
  const redirects: NextConfig['redirects'] = async () => [
    {
      source: '/legal',
      destination: '/legal/privacy',
      statusCode: 301,
    },
  ];

  nextConfig.redirects = redirects;
}

// Apply Sentry plugin on Vercel deployments
if (process.env.VERCEL === '1') {
  nextConfig = withSentry(nextConfig);
}

// Apply bundle analyzer if ANALYZE env var is set
if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default withCMS(nextConfig);
