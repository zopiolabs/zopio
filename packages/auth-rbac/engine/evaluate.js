/**
 * SPDX-License-Identifier: MIT
 */

Object.defineProperty(exports, '__esModule', { value: true });
exports.evaluateAccess = evaluateAccess;
const evaluateDsl_1 = require('./evaluate-dsl');
/**
 * Evaluates if the condition for a rule is satisfied
 */
function evaluateCondition(rule, context, record) {
  // If there's a direct condition function, use it
  if (rule.condition) {
    return rule.condition(context, record);
  }
  // If there's a DSL rule, evaluate it
  if (rule.dsl) {
    return evaluateDsl_1.evaluateDsl(rule.dsl, context, record || null);
  }
  // If no condition or DSL, default to true
  return true;
}
/**
 * Evaluates field-level permissions
 */
function evaluateFieldAccess(rule, field) {
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
function evaluateAccess({ rules, context, action, resource, record, field }) {
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
