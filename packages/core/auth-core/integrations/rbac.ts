/**
 * @repo/auth-core/integrations/rbac
 * 
 * Integration between auth-core and auth-rbac
 */

// These types and functions would normally be imported from @repo/auth-rbac
// We're defining them here to avoid direct dependency issues
interface AppAbility {
  can: (action: string, subject: string, field?: string) => boolean;
}

// This is a stub for the actual implementation in auth-rbac
function createAbilityFromRoles(userId: string, roles: string[]): AppAbility {
  return {
    can: (_action: string, _subject: string, _field?: string) => {
      // In a real implementation, this would check against the CASL ability rules
      // For now, we'll just return true for admins and false otherwise
      return roles.includes('admin');
    }
  };
}

import type { AuthUser } from '..';

/**
 * Create an ability instance for an AuthUser
 * 
 * @param user - AuthUser object from auth-core
 * @returns AppAbility instance with permissions based on user roles
 */
export function createAbilityForAuthUser(user: AuthUser): AppAbility {
  return createAbilityFromRoles(user.id, user.roles);
}

/**
 * Check if a user can perform an action on a subject
 * 
 * @param user - AuthUser object from auth-core
 * @param action - Action to check (e.g., 'read', 'update')
 * @param subject - Subject to check (e.g., 'Profile', 'Dashboard')
 * @returns Boolean indicating if the user can perform the action
 */
export function canPerformAction(
  user: AuthUser,
  action: string,
  subject: string
): boolean {
  const ability = createAbilityForAuthUser(user);
  return ability.can(action, subject);
}
