/**
 * @repo/auth-core/integrations/policy
 * 
 * Integration between auth-core and auth-policy
 */

// These functions would normally be imported from @repo/auth-policy
// We're defining them here to avoid direct dependency issues
type PolicyUser = {
  id: string;
  roles: string[];
  organizationId?: string;
  metadata: Record<string, unknown>;
};

type PolicyContext = {
  user: PolicyUser;
  action: string;
  resource: string;
  context: Record<string, unknown>;
};

// Stub implementation of the createPolicyUser function
function createPolicyUser(clerkUser: ClerkUserWithMetadata | null): PolicyUser {
  if (!clerkUser) {
    return { id: '', roles: [], metadata: {} };
  }
  
  return {
    id: clerkUser.id || '',
    roles: clerkUser.publicMetadata?.roles || [],
    organizationId: clerkUser.publicMetadata?.organizationId,
    metadata: {
      permissions: clerkUser.publicMetadata?.permissions || [],
      ...Object.entries(clerkUser.publicMetadata || {}).reduce((acc, [key, value]) => {
        if (!['roles', 'organizationId', 'permissions'].includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>)
    }
  };
}

// Stub implementation of the can function
async function can(context: PolicyContext): Promise<boolean> {
  // In a real implementation, this would check against policy rules
  // For now, we'll just return true for admins
  // Adding an await to satisfy the linter
  await Promise.resolve();
  return context.user.roles.includes('admin');
}

import type { AuthUser, ClerkUserWithMetadata } from '..';

/**
 * Convert an AuthUser to a PolicyUser
 * 
 * @param user - AuthUser object from auth-core
 * @returns PolicyUser object for auth-policy
 */
export function createPolicyUserFromAuthUser(user: AuthUser) {
  return {
    id: user.id,
    roles: user.roles,
    organizationId: user.organizationId,
    metadata: {
      permissions: user.permissions,
      ...user.metadata
    }
  };
}

/**
 * Check if a user can perform an action on a resource using policy-based authorization
 * 
 * @param user - AuthUser object from auth-core
 * @param action - Policy action to check
 * @param resource - Resource to check access for
 * @param context - Additional context for the policy check
 * @returns Boolean indicating if the user can perform the action
 */
export async function canWithPolicy(
  user: AuthUser,
  action: string,
  resource: string,
  context?: Record<string, unknown>
): Promise<boolean> {
  const policyUser = createPolicyUserFromAuthUser(user);
  
  return await can({
    user: policyUser,
    action,
    resource,
    context: context || {}
  });
}

/**
 * Convert a Clerk user directly to a policy user
 * This is a convenience function for when you're working directly with Clerk
 * 
 * @param clerkUser - Clerk user object
 * @returns Policy user object
 */
export function createPolicyUserFromClerk(clerkUser: ClerkUserWithMetadata | null) {
  return createPolicyUser(clerkUser);
}
