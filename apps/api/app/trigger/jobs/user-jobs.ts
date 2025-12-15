/**
 * SPDX-License-Identifier: MIT
 */

import { evaluateRule, type JSONRule } from "@repo/trigger-rules";
import { logger, task } from "@trigger.dev/sdk";
// Import rules and ensure they match the JSONRule type
import rules from "../rules.json";

// Type assertion to ensure rules match JSONRule type
const typedRules = rules as JSONRule[];

// Define types for our job payloads
interface UserCreatedPayload {
  email: string;
  name?: string;
  userId?: string;
}

interface UserDeletedPayload {
  userId: string;
  reason?: string;
}

/**
 * Job to send a welcome email when a user is created
 */
export const sendWelcomeEmailJob = task({
  id: "send-welcome-email",
  run: (payload: UserCreatedPayload) => {
    logger.info("Sending welcome email", { email: payload.email });
    return Promise.resolve({ success: true, email: payload.email });
  },
});

/**
 * Job to notify admins when a new user signs up + evaluate matching rules
 */
export const notifyAdminsJob = task({
  id: "notify-admins-new-user",
  run: async (payload: UserCreatedPayload) => {
    logger.info("New user signed up", { email: payload.email });

    // Evaluate rules for "user.created"
    const matchingRules = typedRules.filter(
      (rule) => rule.event === "user.created"
    );

    for (const rule of matchingRules) {
      await evaluateRule(rule, { user: payload });
    }

    return { success: true };
  },
});

/**
 * Job to process user deletion + evaluate matching rules
 */
export const processUserDeletionJob = task({
  id: "process-user-deletion",
  run: async (payload: UserDeletedPayload) => {
    logger.info("User deleted", {
      reason: payload.reason || "Not specified",
      userId: payload.userId,
    });

    // Evaluate rules for "user.deleted"
    const matchingRules = typedRules.filter(
      (rule) => rule.event === "user.deleted"
    );

    for (const rule of matchingRules) {
      await evaluateRule(rule, { user: payload });
    }

    return { success: true };
  },
});
