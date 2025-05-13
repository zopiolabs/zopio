import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { AppAbility } from './types';
import { defineRulesFor } from './defineAbility';

/**
 * Create an ability instance for a user
 * 
 * @param user - Clerk user object with publicMetadata containing roles
 * @returns AppAbility instance with permissions based on user roles
 */
export function createAbilityFor(user: {
  id?: string;
  publicMetadata?: { roles?: string[] };
  [key: string]: unknown;
} | null): AppAbility {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Extract role from Clerk user metadata
  const role = user?.publicMetadata?.roles?.[0] || 'guest';
  
  defineRulesFor({ id: user?.id || '', role }, can, cannot);

  return createMongoAbility(rules);
}