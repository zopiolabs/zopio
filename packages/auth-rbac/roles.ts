/**
 * Available roles in the system
 * These should match the roles configured in Clerk
 */
export const roles = ['guest', 'user', 'developer', 'admin'] as const;

/**
 * Role-based abilities configuration
 * Maps each role to a set of permissions
 */
export const roleAbilities = {
  guest: [
    { action: 'read', subject: 'Public' }
  ],
  user: [
    { action: 'read', subject: 'Dashboard' },
    { action: 'read', subject: 'Profile' },
    { action: 'update', subject: 'Profile', conditions: { userId: 'USER_ID_PLACEHOLDER' } },
    { action: 'delete', subject: 'Profile', inverted: true } // 'cannot' rule
  ],
  developer: [
    { action: 'read', subject: 'Dashboard' },
    { action: 'read', subject: 'Profile' },
    { action: 'update', subject: 'Profile' },
    { action: 'read', subject: 'User' }
  ],
  admin: [
    { action: 'manage', subject: 'all' }
  ]
} as const;

export type Role = typeof roles[number];

/**
 * Get the abilities for a specific role
 * 
 * @param role - The role to get abilities for
 * @returns Array of ability rules for the role
 */
export function getAbilitiesForRole(role: Role) {
  return roleAbilities[role] || roleAbilities.guest;
}