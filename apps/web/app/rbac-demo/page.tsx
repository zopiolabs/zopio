'use client';

import React from 'react';
import { useAbility } from '@/components/RBACProvider';
import { useMockUser } from '@/components/MockUserContext';

export default function RBACDemo() {
  const ability = useAbility();
  const { user } = useMockUser();

  const tests = [
    { action: 'read', subject: 'Dashboard' },
    { action: 'update', subject: 'Profile', conditions: { userId: user.id } },
    { action: 'delete', subject: 'Profile' },
    { action: 'manage', subject: 'all' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔐 RBAC Test Panel</h2>
      <p><strong>Current User ID:</strong> {user.id}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <ul style={{ marginTop: '1rem' }}>
        {tests.map(({ action, subject, conditions }) => (
          <li key={`${action}-${subject}`}>
            <code>{`can("${action}", "${subject}"${conditions ? ', conditions' : ''})`}</code>:{" "}
            <strong>{ability.can(action, subject, conditions) ? "✅ Allowed" : "❌ Denied"}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}