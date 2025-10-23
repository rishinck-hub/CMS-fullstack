import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { RoleContext } from '../context/RoleContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

// Combined hook for convenience
export function useAuthRole() {
  const auth = useAuth();
  const role = useRole();
  return { ...auth, ...role };
}

// Hook for checking specific permissions
export function usePermission(permission) {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Hook for checking specific roles
export function useRoleCheck(roles) {
  const { hasRole } = useAuth();
  return hasRole(roles);
}