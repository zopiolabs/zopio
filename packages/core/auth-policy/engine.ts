import type { ClerkUser, PolicyContext, PolicyRegistry } from './types';
import { canInstallPlugin } from './rules/plugin';
import { canManageUsers, canViewAnalytics } from './rules/metadata-permission';

const registry: PolicyRegistry = {
  'plugin.install': canInstallPlugin,
  'users.manage': canManageUsers,
  'analytics.view': canViewAnalytics,
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
    metadata: {
      permissions: clerkUser.publicMetadata?.permissions as string[] || [],
      // Include any other metadata fields that might be needed for policy decisions
      ...Object.entries(clerkUser.publicMetadata || {}).reduce((acc, [key, value]) => {
        if (key !== 'roles' && key !== 'organizationId' && key !== 'permissions') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>)
    }
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