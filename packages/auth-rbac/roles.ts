import type { PermissionRule, RoleDefinition } from './types';

/**
 * Available roles in the system
 * These should match the roles configured in Clerk
 */
export const roles = ['guest', 'user', 'developer', 'admin'] as const;
export type Role = typeof roles[number];

/**
 * Role definitions with inheritance and permissions
 */
export const roleDefinitions: Record<string, RoleDefinition> = {
  guest: {
    name: 'guest',
    permissions: [
      { action: 'read', subject: 'Public' }
    ]
  },
  user: {
    name: 'user',
    permissions: [
      { action: 'read', subject: 'Dashboard' },
      { action: 'read', subject: 'Profile' },
      { action: 'update', subject: 'Profile', conditions: { userId: 'USER_ID_PLACEHOLDER' } },
      { action: 'delete', subject: 'Profile', inverted: true } // 'cannot' rule
    ],
    inherits: ['guest']
  },
  developer: {
    name: 'developer',
    permissions: [
      { action: 'read', subject: 'User' },
      { action: 'update', subject: 'Profile' }
    ],
    inherits: ['user']
  },
  admin: {
    name: 'admin',
    permissions: [
      { action: 'manage', subject: 'all' }
    ]
  }
};

/**
 * Legacy role-based abilities configuration for backward compatibility
 * Maps each role to a set of permissions
 */
export const roleAbilities = {
  guest: roleDefinitions.guest.permissions,
  user: roleDefinitions.user.permissions,
  developer: roleDefinitions.developer.permissions,
  admin: roleDefinitions.admin.permissions
} as const;

/**
 * Get the abilities for a specific role
 * 
 * @param role - The role to get abilities for
 * @returns Array of ability rules for the role
 */
export function getAbilitiesForRole(role: string): PermissionRule[] {
  return roleDefinitions[role]?.permissions || roleDefinitions.guest.permissions;
}

/**
 * Get all permissions for a role, including inherited permissions
 * 
 * @param role - The role to get permissions for
 * @returns Array of permission rules for the role and its inherited roles
 */
export function getAllPermissionsForRole(role: string): PermissionRule[] {
  const definition = roleDefinitions[role];
  if (!definition) {
    return roleDefinitions.guest.permissions;
  }
  
  // Start with the role's own permissions
  const permissions = [...definition.permissions];
  
  // Add inherited permissions
  if (definition.inherits) {
    for (const inheritedRole of definition.inherits) {
      permissions.push(...getAllPermissionsForRole(inheritedRole));
    }
  }
  
  return permissions;
}

/**
 * Register a new role definition or update an existing one
 * 
 * @param roleDef - The role definition to register
 */
export function registerRole(roleDef: RoleDefinition): void {
  roleDefinitions[roleDef.name] = roleDef;
}