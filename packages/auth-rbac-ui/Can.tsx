import type { ReactNode, FC } from 'react';
import { useContext } from 'react';
import { RBACContext } from './context';

interface CanProps {
  access: string;
  children: ReactNode;
}

export const Can: FC<CanProps> = ({ access, children }) => {
  const context = useContext(RBACContext);
  const allowed = context.hasPermission(access);
  
  if (!allowed) {
    return null;
  }
  return <>{children}</>;
};