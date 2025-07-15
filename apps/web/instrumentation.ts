/**
 * SPDX-License-Identifier: MIT
 */

// Next.js instrumentation file

// Define register function for Next.js instrumentation
export function register() {
  // This function will be called by Next.js during initialization
  // We're intentionally not initializing Sentry here to avoid build errors
  // Sentry will be initialized at runtime in the appropriate environment
  return;
}
