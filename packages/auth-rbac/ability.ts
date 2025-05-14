import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { AppAbility } from './types';
import { defineRulesFor } from './defineAbility';

/**
 * Create an ability instance for a user
 * 
 * @param user - User object with roles information
 * @returns AppAbility instance with permissions based on user roles
 */
export function createAbilityFor(user: {
  id?: string;
  publicMetadata?: { roles?: string[] };
  [key: string]: unknown;
} | null): AppAbility {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Extract role from user metadata
  const role = user?.publicMetadata?.roles?.[0] || 'guest';
  
  defineRulesFor({ id: user?.id || '', role }, can, cannot);

  return createMongoAbility(rules);
}

/**
 * Create an ability instance for a user with simplified interface
 * This is useful when you don't have a full Clerk user object
 * 
 * @param userId - User ID
 * @param roles - Array of user roles
 * @returns AppAbility instance with permissions based on user roles
 */
export function createAbilityFromRoles(userId = '', roles: string[] = []): AppAbility {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);
  
  // Use the first role or default to guest
  const role = roles[0] || 'guest';
  
  defineRulesFor({ id: userId, role }, can, cannot);
  
  return createMongoAbility(rules);
}

/**
 * Check if a user can perform an action on a subject
 * 
 * @param ability - AppAbility instance
 * @param action - Action to check (e.g., 'read', 'update')
 * @param subject - Subject to check (e.g., 'Profile', 'Dashboard')
 * @param field - Optional field to check
 * @returns Boolean indicating if the user can perform the action
 */
export function can(
  ability: AppAbility,
  action: string,
  subject: string,
  field?: string
): boolean {
  return ability.can(action, subject, field);
}