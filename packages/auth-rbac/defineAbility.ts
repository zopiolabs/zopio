import type { Actions, Subjects } from './types';
import type { Role } from './roles';
import { getAbilitiesForRole } from './roles';

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
  user: { role: Role; id: string; [key: string]: unknown },
  can: (action: Actions, subject: Subjects, conditions?: Record<string, unknown> | undefined) => void,
  cannot: (action: Actions, subject: Subjects, conditions?: Record<string, unknown> | undefined) => void
): void {
  if (!user || !user.role) {
    // Default to guest permissions if no role is specified
    const guestAbilities = getAbilitiesForRole('guest');
    for (const rule of guestAbilities) {
      can(rule.action, rule.subject);
    }
    return;
  }

  const rawAbilities = getAbilitiesForRole(user.role);

  for (const rule of rawAbilities) {
    const conditions = substituteVariables('conditions' in rule ? rule.conditions : undefined, user);
    
    if ('inverted' in rule && rule.inverted) {
      cannot(rule.action, rule.subject, conditions);
    } else {
      can(rule.action, rule.subject, conditions);
    }
  }
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
      // Handle special placeholder for user ID
      if (value === 'USER_ID_PLACEHOLDER') {
        result[key] = user.id;
      } else if (value.includes('${user.')) {
        // Handle legacy template string format
        const userKey = value.match(USER_VARIABLE_REGEX)?.[1];
        if (userKey && userKey in user) {
          result[key] = user[userKey];
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}