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
