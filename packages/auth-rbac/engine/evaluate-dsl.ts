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
export type DSLNode =
  | { equals: [string, string] }
  | { and: DSLNode[] }
  | { or: DSLNode[] };

/**
 * Evaluates a DSL rule against the provided context and record
 */
export function evaluateDsl(
  rule: DSLNode,
  context: Record<string, unknown>,
  record: Record<string, unknown> | null
): boolean {
  // Helper function to get values from context or record based on path
  const get = (path: string) => {
    if (path.startsWith('context.')) {
      return context[path.slice(8)];
    }
    if (path.startsWith('record.')) {
      return record?.[path.slice(7)];
    }
    return undefined;
  };

  // Handle equals operation
  if ('equals' in rule) {
    const [a, b] = rule.equals;
    return get(a) === get(b);
  }

  // Handle AND operation
  if ('and' in rule) {
    return rule.and.every((r) => evaluateDsl(r, context, record));
  }

  // Handle OR operation
  if ('or' in rule) {
    return rule.or.some((r) => evaluateDsl(r, context, record));
  }

  // Default case if no operations match
  return false;
}
