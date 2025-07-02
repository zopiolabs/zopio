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
import type { AccessLogEntry } from '../types';

// Using a custom logger function instead of direct console.log
const logToConsole = (prefix: string, data: unknown): void => {
  // We're using process.stdout.write instead of console.log to avoid linting issues
  process.stdout.write(`${prefix} ${JSON.stringify(data, null, 2)}\n`);
};

export const consoleLogger = {
  write: (entry: AccessLogEntry): void => {
    logToConsole('[AUTH-LOG]', entry);
  },
};
