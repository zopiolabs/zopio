import type { PolicyRule } from '../types';

/**
 * Check if a user can install a plugin
 * Requires admin or developer role
 */
export const canInstallPlugin: PolicyRule = ({ user }) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  return user.roles.includes('admin') || user.roles.includes('developer');
};