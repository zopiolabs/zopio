import 'server-only';

export * from '@clerk/nextjs/server';

// Type definition for Clerk user with metadata
export interface ClerkUserWithMetadata {
  id?: string;
  publicMetadata?: {
    roles?: string[];
    permissions?: string[];
    organizationId?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Helper function to get user roles from Clerk user
 * @param user - Clerk user object
 * @returns Array of user roles
 */
export function getUserRoles(user: unknown): string[] {
  if (!user) {
    return [];
  }
  
  const clerkUser = user as ClerkUserWithMetadata;
  return clerkUser.publicMetadata?.roles || [];
}

/**
 * Helper function to get user permissions from Clerk user
 * @param user - Clerk user object
 * @returns Array of user permissions
 */
export function getUserPermissions(user: unknown): string[] {
  if (!user) {
    return [];
  }
  
  const clerkUser = user as ClerkUserWithMetadata;
  return clerkUser.publicMetadata?.permissions || [];
}

/**
 * Helper function to get user's organization ID from Clerk user
 * @param user - Clerk user object
 * @returns Organization ID or undefined
 */
export function getUserOrganizationId(user: unknown): string | undefined {
  if (!user) {
    return undefined;
  }
  
  const clerkUser = user as ClerkUserWithMetadata;
  return clerkUser.publicMetadata?.organizationId as string | undefined;
}
