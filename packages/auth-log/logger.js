/**
 * SPDX-License-Identifier: MIT
 */

Object.defineProperty(exports, '__esModule', { value: true });
exports.logAccessAttempt = logAccessAttempt;
const config_1 = require('./config');
function logAccessAttempt(entry) {
  const logger = config_1.getActiveLogger();
  logger.write(entry);
}
