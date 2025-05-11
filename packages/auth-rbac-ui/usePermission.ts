import { useContext } from 'react';
import { RBACContext } from './context';

export const usePermission = (permission: string): boolean => {
  const context = useContext(RBACContext);
  return context.hasPermission(permission);
};