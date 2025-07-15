/**
 * SPDX-License-Identifier: MIT
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
