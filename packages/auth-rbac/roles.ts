export const roles = ['guest', 'user', 'admin'] as const;

export const roleAbilities = {
  guest: [
    { action: 'read', subject: 'Public' }
  ],
  user: [
    { action: 'read', subject: 'Dashboard' },
    { action: 'update', subject: 'Profile', conditions: { userId: '${user.id}' } },
    { action: 'delete', subject: 'Profile', inverted: true } // 'cannot' rule
  ],
  admin: [
    { action: 'manage', subject: 'all' }
  ]
} as const;

export type Role = typeof roles[number];

export function getAbilitiesForRole(role: Role) {
  return roleAbilities[role] || [];
}