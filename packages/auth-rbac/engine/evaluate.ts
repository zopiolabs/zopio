/**
 * SPDX-License-Identifier: MIT
 */

import type {
  AccessEvaluationInput,
  AccessEvaluationResult,
  PermissionRule,
  UserContext,
} from '../types';

import { evaluateDsl } from './evaluate-dsl';

/**
 * Evaluates if the condition for a rule is satisfied
 */
function evaluateCondition(
  rule: PermissionRule,
  context: UserContext,
  record: Record<string, unknown> | null | undefined
): boolean {
  // If there's a direct condition function, use it
  if (rule.condition) {
    return rule.condition(context, record);
  }

  // If there's a DSL rule, evaluate it
  if (rule.dsl) {
    return evaluateDsl(rule.dsl, context, record || null);
  }

  // If no condition or DSL, default to true
  return true;
}

/**
 * Evaluates field-level permissions
 */
function evaluateFieldAccess(
  rule: PermissionRule,
  field: string | undefined
): AccessEvaluationResult | null {
  // Only check field permissions if a field is specified and the rule has field permissions
  if (field && rule.fieldPermissions) {
    const accessLevel = rule.fieldPermissions[field];
    if (!accessLevel || accessLevel === 'none') {
      return { can: false, reason: `No access to field '${field}'` };
    }
  }

  // Field access is granted or not applicable
  return null;
}

export function evaluateAccess({
  rules,
  context,
  action,
  resource,
  record,
  field,
}: AccessEvaluationInput): AccessEvaluationResult {
  // Iterate through all rules
  for (const rule of rules) {
    // Check if the rule matches the requested resource and action
    if (rule.resource === resource && rule.action === action) {
      // Check if the condition is satisfied
      const conditionOk = evaluateCondition(rule, context, record);

      if (!conditionOk) {
        continue;
      }

      // Check field-level permissions
      const fieldAccessResult = evaluateFieldAccess(rule, field);
      if (fieldAccessResult) {
        return fieldAccessResult;
      }

      // All checks passed, access is granted
      return { can: true };
    }
  }

  // No matching rule found
  return { can: false, reason: 'No matching rule found' };
}
