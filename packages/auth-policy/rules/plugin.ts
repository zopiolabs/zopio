import type { PolicyRule } from '../types';

export const canInstallPlugin: PolicyRule = ({ user }) => {
  return user.roles.includes('admin') || user.roles.includes('developer');
};