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
exports.logAccessAttempt = logAccessAttempt;
const config_1 = require('./config');
function logAccessAttempt(entry) {
  const logger = config_1.getActiveLogger();
  logger.write(entry);
}
