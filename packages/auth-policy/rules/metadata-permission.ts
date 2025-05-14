// rules/metadata-permission.ts

import type { PolicyRule, PolicyContext } from '../types';

/**
 * Check if a user has a specific permission in their metadata
 * @param permission The permission to check for
 */
export function createMetadataPermissionRule(permission: string): PolicyRule {
  return ({ user }: PolicyContext): boolean => {
    // Access permissions from user object, which may have any structure
    const permissions = user && typeof user === 'object' && 'metadata' in user 
      ? (user.metadata as Record<string, unknown>)?.permissions 
      : null;
    
    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }
    return permissions.includes(permission);
  };
}

/**
 * Check if a user has the 'manage-users' permission
 */
export const canManageUsers: PolicyRule = createMetadataPermissionRule('manage-users');

/**
 * Check if a user has the 'view-analytics' permission
 */
export const canViewAnalytics: PolicyRule = createMetadataPermissionRule('view-analytics');
