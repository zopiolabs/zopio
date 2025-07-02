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
Object.defineProperty(exports, '__esModule', { value: true });
exports.getActiveLogger = getActiveLogger;
const betterstack_1 = require('./adapters/betterstack');
const console_1 = require('./adapters/console');
const file_1 = require('./adapters/file');
/**
 * Returns the configured logger based on environment variables
 */
function getActiveLogger() {
  const target = process.env.AUTH_LOG_TARGET;
  if (target === 'file') {
    return file_1.fileLogger;
  }
  if (target === 'betterstack') {
    const sourceToken = process.env.BETTERSTACK_SOURCE_TOKEN;
    if (!sourceToken) {
      process.stderr.write(
        '[AUTH-LOG] BETTERSTACK_SOURCE_TOKEN is not set, falling back to console logger\n'
      );
      return console_1.consoleLogger;
    }
    return betterstack_1.createBetterStackLogger({ sourceToken });
  }
  // Default to console logger
  return console_1.consoleLogger;
}
