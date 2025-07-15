/**
 * SPDX-License-Identifier: MIT
 */

import { getActiveLogger } from './config';
import type { AccessLogEntry } from './types';

export function logAccessAttempt(entry: AccessLogEntry) {
  const logger = getActiveLogger();
  logger.write(entry);
}
