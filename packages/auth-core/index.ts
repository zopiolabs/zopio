/**
 * @repo/auth-core
 * 
 * Core authentication utilities that integrate all auth modules
 * while allowing developers to use only what they need.
 * 
 * This module provides a standardized interface for working with authentication
 * and authorization across Zopio applications. It serves as a bridge between
 * the basic authentication functionality and more advanced authorization features.
 */

// Type definition for Clerk user with metadata (defined locally to avoid direct dependency)
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

// Types
export interface AuthUser {
  id: string;
  roles: string[];
  permissions: string[];
  organizationId?: string;
  metadata: Record<string, unknown>;
}

// Core functions
/**
 * Convert a Clerk user to a standardized AuthUser format
 * This is used by all auth modules for consistent user representation
 */
export function createAuthUser(clerkUser: ClerkUserWithMetadata | null): AuthUser {
  if (!clerkUser) {
    return {
      id: '',
      roles: [],
      permissions: [],
      metadata: {}
    };
  }
  
  return {
    id: clerkUser.id || '',
    roles: clerkUser.publicMetadata?.roles || [],
    permissions: clerkUser.publicMetadata?.permissions || [],
    organizationId: clerkUser.publicMetadata?.organizationId as string | undefined,
    metadata: {
      ...Object.entries(clerkUser.publicMetadata || {}).reduce((acc, [key, value]) => {
        if (!['roles', 'permissions', 'organizationId'].includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>)
    }
  };
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: AuthUser, role: string | string[]): boolean {
  if (Array.isArray(role)) {
    return role.some(r => user.roles.includes(r));
  }
  return user.roles.includes(role);
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: AuthUser, permission: string | string[]): boolean {
  if (Array.isArray(permission)) {
    return permission.some(p => user.permissions.includes(p));
  }
  return user.permissions.includes(permission);
}

/**
 * Check if a user belongs to a specific organization
 */
export function belongsToOrganization(user: AuthUser, organizationId: string): boolean {
  return user.organizationId === organizationId;
}
