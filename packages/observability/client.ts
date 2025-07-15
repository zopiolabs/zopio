/**
 * SPDX-License-Identifier: MIT
 */

/*
 * This file configures the initialization of Sentry on the client.
 * The config you add here will be used whenever a users loads a page in their browser.
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import { init, replayIntegration } from '@sentry/nextjs';
import { keys } from './keys';
import { log } from './log';

export const initializeSentry = (): ReturnType<typeof init> | undefined => {
  try {
    const dsn = keys().NEXT_PUBLIC_SENTRY_DSN;

    // Only initialize if DSN is provided
    if (!dsn || typeof dsn !== 'string' || dsn.length === 0) {
      return undefined;
    }

    return init({
      dsn,

      // Set request timeout options
      shutdownTimeout: 3000, // 3 seconds in milliseconds
      maxValueLength: 1000, // Limit payload size

      // Reduce sample rate to minimize network requests
      tracesSampleRate: 0.1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Reduce replay sample rate for better performance
      replaysOnErrorSampleRate: 0.5,
      replaysSessionSampleRate: 0.05,

      // You can remove this option if you're not planning to use the Sentry Session Replay feature:
      integrations: [
        replayIntegration({
          // Additional Replay configuration goes in here, for example:
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    });
  } catch (error) {
    // Prevent initialization errors from breaking the application
    log.warn(
      `Failed to initialize Sentry client: ${error instanceof Error ? error.message : String(error)}`
    );
    return undefined;
  }
};
