'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

const roles = ['guest', 'user', 'admin'] as const;
type UserRole = typeof roles[number];

type MockUser = {
  id: string;
  role: UserRole;
};

type MockUserContextType = {
  user: MockUser;
  setRole: (role: UserRole) => void;
};

const MockUserContext = createContext<MockUserContextType | null>(null);

export const MockUserProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('user');
  const user = { id: 'mock-user-id', role };

  return (
    <MockUserContext.Provider value={{ user, setRole }}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#eee', padding: '8px', borderRadius: '8px' }}>
        <strong>Current Role:</strong>
        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} style={{ marginLeft: '8px' }}>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </MockUserContext.Provider>
  );
};

export const useMockUser = (): MockUserContextType => {
  const ctx = useContext(MockUserContext);
  if (!ctx) {
    throw new Error('useMockUser must be used within MockUserProvider');
  }
  return ctx;
};