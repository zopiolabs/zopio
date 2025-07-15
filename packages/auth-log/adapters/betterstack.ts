/**
 * SPDX-License-Identifier: MIT
 */

import type { AccessLogEntry } from '../types';

interface BetterStackOptions {
  sourceToken: string;
  endpoint?: string;
}

export function createBetterStackLogger(options: BetterStackOptions) {
  const endpoint = options.endpoint || 'https://in.logs.betterstack.com';

  return {
    write: async (entry: AccessLogEntry) => {
      try {
        const response = await fetch(`${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${options.sourceToken}`,
          },
          body: JSON.stringify({
            ...entry,
            level: entry.can ? 'info' : 'warn',
            message: `Auth ${entry.can ? 'ALLOWED' : 'DENIED'}: ${entry.action} ${entry.resource}${entry.field ? `.${entry.field}` : ''}`,
            service: 'auth-service',
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          process.stderr.write(
            `[AUTH-LOG] Failed to send log to BetterStack: ${errorText}\n`
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        process.stderr.write(
          `[AUTH-LOG] Error sending log to BetterStack: ${errorMessage}\n`
        );
      }
    },
  };
}
