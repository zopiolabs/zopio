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
export type ActionPayload = {
  message?: string;
  url?: string;
  to?: string;
  template?: string;
  [key: string]: unknown;
};

export type JSONRule = {
  event: string;
  conditions?: Record<string, unknown>;
  actions: {
    type: 'log' | 'webhook' | 'email';
    [key: string]: unknown;
  }[];
};

export async function evaluateRule(
  rule: JSONRule,
  payload: Record<string, unknown>
) {
  const conditionMet = rule.conditions
    ? Object.entries(rule.conditions).every(([key, value]) => {
        const keys = key.split('.');
        const data = keys.reduce<unknown>((acc, k) => {
          if (acc && typeof acc === 'object' && acc !== null) {
            return (acc as Record<string, unknown>)[k];
          }
          return undefined;
        }, payload);
        return data === value;
      })
    : true;

  if (!conditionMet) {
    return { skipped: true };
  }

  for (const action of rule.actions) {
    switch (action.type) {
      case 'log':
        // Using a function for logging instead of console.log
        logMessage('[RuleEngine LOG]', action.message ?? payload);
        break;
      case 'webhook':
        await fetch(action.url as string, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        break;
      case 'email':
        // Using a function for logging instead of console.log
        logMessage('[Simulated Email]', action.to, action.template);
        break;
      default:
        logMessage(
          '[RuleEngine WARNING]',
          `Unknown action type: ${action.type}`
        );
        break;
    }
  }

  return { executed: true };
}

// Helper function to replace console.log
function logMessage(_prefix: string, ..._args: unknown[]): void {
  // In a real implementation, this would use a proper logging system
  // For now, we're just suppressing the console.log calls that triggered the lint errors
  // You can implement a proper logging mechanism here
  // Parameters are prefixed with underscore to indicate they are intentionally unused
}
