/**
 * SPDX-License-Identifier: MIT
 */

import fs from 'node:fs';
import type { AccessLogEntry } from '../types';

const logPath = './logs/access.log';

export const fileLogger = {
  write: (entry: AccessLogEntry): void => {
    fs.appendFileSync(logPath, `${JSON.stringify(entry)}\n`);
  },
};
