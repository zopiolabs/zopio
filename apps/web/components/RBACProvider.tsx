'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createAbilityFor } from '@repo/auth-rbac/ability';
import type { AppAbility } from '@repo/auth-rbac/types';
import { useMockUser } from './MockUserContext';

export const AbilityContext = createContext<AppAbility | null>(null);

export const RBACProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useMockUser();

  const ability = useMemo(() => createAbilityFor(user), [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = (): AppAbility => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbility must be used within an RBACProvider');
  }
  return context;
};