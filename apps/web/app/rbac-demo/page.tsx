'use client';

// React is used implicitly by JSX
import { useAbility } from '@/components/RBACProvider';
import type { Actions, Subjects } from '@repo/auth-rbac/types';
import { useMockUser } from '@/components/MockUserContext';

export default function RBACDemo() {
  const ability = useAbility();
  const { user } = useMockUser();

  const tests: Array<{ action: Actions; subject: Subjects; conditions?: Record<string, unknown> }> = [
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
            <strong>{ability.can(action, subject, conditions ? JSON.stringify(conditions) : undefined) ? "✅ Allowed" : "❌ Denied"}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}