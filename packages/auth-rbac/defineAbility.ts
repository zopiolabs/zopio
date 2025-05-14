import type { Actions, Subjects, UserWithRole, PermissionRule } from './types';
import { getAllPermissionsForRole } from './roles';

// Define regex at the top level for better performance
const USER_VARIABLE_REGEX = /\$\{user\.([^}]+)\}/;

/**
 * Define CASL ability rules for a user based on their role
 * 
 * @param user - User object with role and id
 * @param can - CASL's can function to define permissions
 * @param cannot - CASL's cannot function to define restrictions
 */
export function defineRulesFor(
  user: UserWithRole,
  can: (action: Actions, subject: Subjects, conditions?: Record<string, unknown> | undefined) => void,
  cannot: (action: Actions, subject: Subjects, conditions?: Record<string, unknown> | undefined) => void
): void {
  if (!user || !user.role) {
    // Default to guest permissions if no role is specified
    const guestAbilities = getAllPermissionsForRole('guest');
    applyRules(guestAbilities, user, can, cannot);
    return;
  }

  // Get all permissions for the role, including inherited permissions
  const permissions = getAllPermissionsForRole(user.role);
  applyRules(permissions, user, can, cannot);
}

/**
 * Apply permission rules to CASL ability builder
 * 
 * @param rules - Array of permission rules to apply
 * @param user - User object with values for variable substitution
 * @param can - CASL's can function to define permissions
 * @param cannot - CASL's cannot function to define restrictions
 */
export function applyRules(
  rules: PermissionRule[],
  user: { id: string; [key: string]: unknown },
  can: (action: Actions, subject: Subjects, conditions?: Record<string, unknown> | undefined) => void,
  cannot: (action: Actions, subject: Subjects, conditions?: Record<string, unknown> | undefined) => void
): void {
  for (const rule of rules) {
    const conditions = substituteVariables(rule.conditions, user);
    
    if (rule.inverted) {
      cannot(rule.action as Actions, rule.subject as Subjects, conditions);
    } else {
      can(rule.action as Actions, rule.subject as Subjects, conditions);
    }
  }
}

/**
 * Process a string value for variable substitution
 * 
 * @param value - String value that might contain variables
 * @param user - User object with values to substitute
 * @returns Processed value with substitutions
 */
function processStringValue(value: string, user: { [key: string]: unknown }): unknown {
  // Handle special placeholder for user ID
  if (value === 'USER_ID_PLACEHOLDER') {
    return user.id;
  } 
  
  // Handle legacy template string format
  if (value.includes('${user.')) {
    const userKey = value.match(USER_VARIABLE_REGEX)?.[1];
    if (userKey && userKey in user) {
      return user[userKey];
    }
  }
  
  // Return original value if no substitution was made
  return value;
}

/**
 * Substitute variables in conditions with actual user values
 * 
 * @param conditions - Conditions object with variables to substitute
 * @param user - User object with values to substitute
 * @returns Conditions with substituted values
 */
function substituteVariables(
  conditions: Record<string, unknown> | undefined, 
  user: { [key: string]: unknown }
): Record<string, unknown> | undefined {
  if (!conditions) {
    return undefined;
  }
  
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(conditions)) {
    if (typeof value === 'string') {
      result[key] = processStringValue(value, user);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}