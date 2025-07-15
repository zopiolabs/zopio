/**
 * SPDX-License-Identifier: MIT
 */

import { log as logtail } from '@logtail/next';

// Simple logger that uses logtail in production and console in development
// This avoids type issues while providing basic logging functionality
export const log = {
  info: (message: string): void => {
    if (process.env.NODE_ENV === 'production') {
      logtail.info(message);
    }
    // Silent in development to avoid console noise
  },

  warn: (message: string): void => {
    if (process.env.NODE_ENV === 'production') {
      logtail.warn(message);
    }
    // Silent in development to avoid console noise
  },

  error: (message: string): void => {
    if (process.env.NODE_ENV === 'production') {
      logtail.error(message);
    }
    // Silent in development to avoid console noise
  },
};
