import React from 'react';
import { useAuth } from '../../hooks/useRole';

export function RoleGuard({ 
  children, 
  roles = [], 
  permissions = [], 
  fallback = null,
  requireAll = false 
}) {
  const { hasRole, hasPermission, isAuthenticated } = useAuth();

  // If not authenticated, don't render anything
  if (!isAuthenticated) {
    return fallback;
  }

  // Check role requirements
  let roleCheck = true;
  if (roles.length > 0) {
    if (requireAll) {
      roleCheck = roles.every(role => hasRole(role));
    } else {
      roleCheck = hasRole(roles);
    }
  }

  // Check permission requirements
  let permissionCheck = true;
  if (permissions.length > 0) {
    if (requireAll) {
      permissionCheck = permissions.every(permission => hasPermission(permission));
    } else {
      permissionCheck = permissions.some(permission => hasPermission(permission));
    }
  }

  // Render children if all checks pass
  if (roleCheck && permissionCheck) {
    return children;
  }

  return fallback;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback = null }) {
  return (
    <RoleGuard roles={['Admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function DoctorOnly({ children, fallback = null }) {
  return (
    <RoleGuard roles={['Doctor']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ReceptionistOnly({ children, fallback = null }) {
  return (
    <RoleGuard roles={['Receptionist']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function PharmacistOnly({ children, fallback = null }) {
  return (
    <RoleGuard roles={['Pharmacist']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOrDoctor({ children, fallback = null }) {
  return (
    <RoleGuard roles={['Admin', 'Doctor']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOrReceptionist({ children, fallback = null }) {
  return (
    <RoleGuard roles={['Admin', 'Receptionist']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOrPharmacist({ children, fallback = null }) {
  return (
    <RoleGuard roles={['Admin', 'Pharmacist']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
