/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
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
