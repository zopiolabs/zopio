import type { ReactNode, FC } from 'react';
import { useContext } from 'react';
import { RBACContext } from './context';

interface CanAnyProps {
  access: string[];
  mode?: 'permission' | 'role';
  children: ReactNode;
}

export const CanAny: FC<CanAnyProps> = ({
  access,
  mode = 'permission',
  children,
}) => {
  const context = useContext(RBACContext);
  
  const allowed = access.some((key) => {
    return mode === 'permission' 
      ? context.hasPermission(key) 
      : context.hasRole(key);
  });
  
  if (!allowed) {
    return null;
  }
  return <>{children}</>;
};