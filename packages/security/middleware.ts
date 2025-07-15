/**
 * SPDX-License-Identifier: MIT
 */

import {
  type NoseconeOptions,
  defaults,
  withVercelToolbar,
} from '@nosecone/next';
export { createMiddleware as noseconeMiddleware } from '@nosecone/next';

// Nosecone security headers configuration
// https://docs.arcjet.com/nosecone/quick-start
export const noseconeOptions: NoseconeOptions = {
  ...defaults,
  // Content Security Policy (CSP) is disabled by default because the values
  // depend on which zopio features are enabled. See
  // https://www.zopio.dev/packages/security/headers for guidance on how
  // to configure it.
  contentSecurityPolicy: false,
};

export const noseconeOptionsWithToolbar: NoseconeOptions =
  withVercelToolbar(noseconeOptions);
