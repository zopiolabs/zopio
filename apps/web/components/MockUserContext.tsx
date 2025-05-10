'use client';

import React, { createContext, useContext, useState } from 'react';

const roles = ['guest', 'user', 'admin'];

const MockUserContext = createContext<any>(null);

export const MockUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState('user');
  const user = { id: 'mock-user-id', role };

  return (
    <MockUserContext.Provider value={{ user, setRole }}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#eee', padding: '8px', borderRadius: '8px' }}>
        <strong>Current Role:</strong>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginLeft: '8px' }}>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </MockUserContext.Provider>
  );
};

export const useMockUser = () => {
  const ctx = useContext(MockUserContext);
  if (!ctx) throw new Error('useMockUser must be used within MockUserProvider');
  return ctx;
};