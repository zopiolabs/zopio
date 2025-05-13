import type { ClerkUser, PolicyContext, PolicyRegistry } from './types';
import { canInstallPlugin } from './rules/plugin';

const registry: PolicyRegistry = {
  'plugin.install': canInstallPlugin,
};

/**
 * Convert a Clerk user to our internal policy user format
 */
export function createPolicyUser(clerkUser: ClerkUser | null) {
  if (!clerkUser) {
    return { id: '', roles: [] };
  }
  
  return {
    id: clerkUser.id,
    roles: clerkUser.publicMetadata?.roles || [],
    organizationId: clerkUser.publicMetadata?.organizationId,
  };
}

/**
 * Check if a user can perform an action
 */
export async function can(input: PolicyContext): Promise<boolean> {
  const rule = registry[input.action];
  if (!rule) {
    return false;
  }
  return await rule(input);
}