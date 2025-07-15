/**
 * SPDX-License-Identifier: MIT
 */

import { createBetterStackLogger } from './adapters/betterstack';
import { consoleLogger } from './adapters/console';
import { fileLogger } from './adapters/file';

/**
 * Returns the configured logger based on environment variables
 */
export function getActiveLogger() {
  const target = process.env.AUTH_LOG_TARGET;

  if (target === 'file') {
    return fileLogger;
  }

  if (target === 'betterstack') {
    const sourceToken = process.env.BETTERSTACK_SOURCE_TOKEN;
    if (!sourceToken) {
      process.stderr.write(
        '[AUTH-LOG] BETTERSTACK_SOURCE_TOKEN is not set, falling back to console logger\n'
      );
      return consoleLogger;
    }
    return createBetterStackLogger({ sourceToken });
  }

  // Default to console logger
  return consoleLogger;
}
