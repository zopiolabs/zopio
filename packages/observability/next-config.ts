/**
 * SPDX-License-Identifier: MIT
 */

import { withLogtail } from '@logtail/next';
import { withSentryConfig } from '@sentry/nextjs';
import { keys } from './keys';

export const sentryConfig: Parameters<typeof withSentryConfig>[1] = {
  // Safely access org and project with fallbacks
  org: keys().SENTRY_ORG || '',
  project: keys().SENTRY_PROJECT || '',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  /*
   * For all available options, see:
   * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
   */

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  /*
   * Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
   * This can increase your server load as well as your hosting bill.
   * Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
   * side errors will fail.
   */
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  /*
   * Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
   * See the following for more information:
   * https://docs.sentry.io/product/crons/
   * https://vercel.com/docs/cron-jobs
   */
  automaticVercelMonitors: true,
};

export const withSentry = (sourceConfig: object): object => {
  try {
    const configWithTranspile = {
      ...sourceConfig,
      transpilePackages: ['@sentry/nextjs'],
    };

    // Only apply Sentry config if we have valid DSN
    const envKeys = keys();
    if (
      envKeys?.NEXT_PUBLIC_SENTRY_DSN &&
      typeof envKeys.NEXT_PUBLIC_SENTRY_DSN === 'string' &&
      envKeys.NEXT_PUBLIC_SENTRY_DSN.length > 0
    ) {
      return withSentryConfig(configWithTranspile, sentryConfig);
    }

    // Return the config without Sentry if no DSN is provided
    return configWithTranspile;
  } catch (_) {
    // If anything goes wrong, return the original config
    return sourceConfig;
  }
};

export const withLogging = (config: object): object => {
  return withLogtail(config);
};
