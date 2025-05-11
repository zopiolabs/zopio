import { createContext } from 'react';

export interface RBACContextProps {
  hasPermission: (perm: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const RBACContext = createContext<RBACContextProps>({
  hasPermission: () => false,
  hasRole: () => false,
});

export const AuthRbacProvider = RBACContext.Provider;