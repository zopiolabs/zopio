/**
 * SPDX-License-Identifier: MIT
 */

import { TriggerClient } from '@trigger.dev/sdk';

// Validate environment variables
if (!process.env.TRIGGER_API_KEY) {
  // Using a safer logging approach
  process.stderr.write(
    'TRIGGER_API_KEY environment variable is not set. Trigger.dev functionality will not work properly.\n'
  );
}

/**
 * Configured Trigger.dev client for the Zopio application
 * @see https://trigger.dev/docs/documentation/clients/javascript-client
 */
export const client = new TriggerClient({
  id: 'zopio-trigger',
  apiKey: process.env.TRIGGER_API_KEY || 'missing-api-key',
  apiUrl: process.env.TRIGGER_API_URL || 'https://api.trigger.dev',
});

/**
 * Helper function to safely send events to Trigger.dev
 * @param eventName The name of the event to trigger
 * @param payload The payload to send with the event
 * @returns Result of the event sending operation
 */
export async function sendEvent<T extends Record<string, unknown>>(
  eventName: string,
  payload: T
): Promise<unknown> {
  try {
    return await client.sendEvent({
      name: eventName,
      payload,
    });
  } catch (error) {
    // Using a safer logging approach
    process.stderr.write(
      `Failed to send event ${eventName}: ${error instanceof Error ? error.message : String(error)}\n`
    );
    throw error;
  }
}
