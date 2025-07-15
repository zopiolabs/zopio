/**
 * SPDX-License-Identifier: MIT
 */

export type AccessLogEntry = {
  timestamp: string;
  resource: string;
  action: string;
  context: Record<string, unknown>;
  recordId?: string;
  field?: string;
  can: boolean;
  reason?: string;
};
