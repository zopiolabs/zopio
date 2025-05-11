import { useContext } from 'react';
import { RBACContext } from './context';

export const useRole = (role: string): boolean => {
  const context = useContext(RBACContext);
  return context.hasRole(role);
};