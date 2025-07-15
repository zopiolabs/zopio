/**
 * SPDX-License-Identifier: MIT
 */

import { init } from '@sentry/nextjs';
import { keys } from './keys';
import { log } from './log';

/**
 * Initialize Sentry for Next.js instrumentation
 * @returns A function that initializes Sentry based on the runtime environment
 */
export function initializeSentry() {
  // Return a register function as expected by Next.js instrumentation
  return function register() {
    try {
      // Get environment keys safely
      const envKeys = keys();
      const dsn = envKeys?.NEXT_PUBLIC_SENTRY_DSN;

      // Only initialize Sentry if DSN is provided
      if (dsn && typeof dsn === 'string' && dsn.length > 0) {
        const opts = {
          dsn,
          // Set timeout options to prevent hanging on remote requests
          shutdownTimeout: 3000, // 3 seconds in milliseconds
          maxValueLength: 1000, // Limit payload size
          // Disable performance monitoring to reduce network requests
          enableTracing: false,
          // Set a lower sample rate to reduce traffic
          tracesSampleRate: 0.1,
        };

        if (process.env.NEXT_RUNTIME === 'nodejs') {
          init(opts);
        }

        if (process.env.NEXT_RUNTIME === 'edge') {
          init(opts);
        }
      }
      // If DSN is not provided, silently skip initialization
    } catch (error) {
      // Prevent instrumentation errors from breaking the application
      log.warn(
        `Failed to initialize Sentry: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
}
