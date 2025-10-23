import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useRole';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  const getDashboardPath = (role) => {
    const dashboardPaths = {
      Admin: '/admin/dashboard',
      Doctor: '/doctor/dashboard',
      Receptionist: '/receptionist/dashboard',
      Pharmacist: '/pharmacist/dashboard'
    };
    return dashboardPaths[role] || '/unauthorized';
  };

  return <Navigate to={getDashboardPath(user.role)} replace />;
}
