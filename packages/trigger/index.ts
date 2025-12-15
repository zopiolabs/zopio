/**
 * SPDX-License-Identifier: MIT
 */

import { tasks } from "@trigger.dev/sdk";

if (!(process.env.TRIGGER_SECRET_KEY || process.env.TRIGGER_API_KEY)) {
  process.stderr.write(
    "TRIGGER_SECRET_KEY is not set. Trigger.dev functionality will not work properly.\n"
  );
}

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
    switch (eventName) {
      case "user.created": {
        const [welcome, notifyAdmins] = await Promise.all([
          tasks.trigger("send-welcome-email", payload),
          tasks.trigger("notify-admins-new-user", payload),
        ]);
        return { notifyAdmins, welcome };
      }
      case "user.deleted": {
        return await tasks.trigger("process-user-deletion", payload);
      }
      default: {
        return await tasks.trigger(eventName, payload);
      }
    }
  } catch (error) {
    // Using a safer logging approach
    process.stderr.write(
      `Failed to send event ${eventName}: ${error instanceof Error ? error.message : String(error)}\n`
    );
    throw error;
  }
}
