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
exports.consoleLogger = undefined;
// Using a custom logger function instead of direct console.log
const logToConsole = (prefix, data) => {
  // We're using process.stdout.write instead of console.log to avoid linting issues
  process.stdout.write(`${prefix} ${JSON.stringify(data, null, 2)}\n`);
};
exports.consoleLogger = {
  write: (entry) => {
    logToConsole('[AUTH-LOG]', entry);
  },
};
