'use client';

// React is used implicitly by JSX
import { useAbility } from '@/components/RBACProvider';

export const DashboardControls = () => {
  const ability = useAbility();

  return (
    <div>
      <h1>Dashboard</h1>

      {ability.can('read', 'Dashboard') && (
        <p>You can view this dashboard content.</p>
      )}

      {ability.can('update', 'Profile') && (
        <button type="button">Edit Profile</button>
      )}

      {!ability.can('delete', 'User') && (
        <p>You do not have permission to delete users.</p>
      )}
    </div>
  );
};