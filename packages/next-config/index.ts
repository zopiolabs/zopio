/**
 * SPDX-License-Identifier: MIT
 */

import withBundleAnalyzer from '@next/bundle-analyzer';

// @ts-expect-error No declaration file
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import type { NextConfig } from 'next';

const otelRegex = /@opentelemetry\/instrumentation/;

export const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  // biome-ignore lint/suspicious/useAwait: rewrites is async
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },

  webpack(config, { isServer }) {
    if (isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(new PrismaPlugin());
    }

    config.ignoreWarnings = [{ module: otelRegex }];

    return config;
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
  })(sourceConfig);

/**
 * Combines the base configuration with custom configuration
 * @param customConfig - Custom Next.js configuration
 * @returns Combined Next.js configuration
 */
export const withConfig = (customConfig: NextConfig): NextConfig => {
  return {
    ...config,
    ...customConfig,
    // Preserve any existing rewrites from both configs
    async rewrites() {
      type RewriteResult = { source: string; destination: string }[];

      const baseRewritesFunc = config.rewrites as unknown as
        | (() => Promise<RewriteResult>)
        | undefined;
      const customRewritesFunc = customConfig.rewrites as unknown as
        | (() => Promise<RewriteResult>)
        | undefined;

      const baseRewrites = baseRewritesFunc ? await baseRewritesFunc() : [];
      const customRewrites = customRewritesFunc
        ? await customRewritesFunc()
        : [];

      return [...baseRewrites, ...customRewrites];
    },
  };
};
