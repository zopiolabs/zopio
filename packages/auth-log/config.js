/**
 * SPDX-License-Identifier: MIT
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
