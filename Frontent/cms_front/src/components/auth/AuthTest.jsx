import React from 'react';
import { useAuth, useRole } from '../../hooks/useRole';

export default function AuthTest() {
  const { user, isAuthenticated, loading } = useAuth();
  const { role, hasRole, hasPermission } = useRole();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated. Please log in.</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Authentication Test</h3>
      <div className="space-y-2">
        <p><strong>User:</strong> {user?.username}</p>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Is Admin:</strong> {hasRole('Admin') ? 'Yes' : 'No'}</p>
        <p><strong>Is Doctor:</strong> {hasRole('Doctor') ? 'Yes' : 'No'}</p>
        <p><strong>Can manage patients:</strong> {hasPermission('manage_patients') ? 'Yes' : 'No'}</p>
        <p><strong>Can manage medicines:</strong> {hasPermission('manage_medicines') ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
