import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useRole";

export default function RoleBasedRoute({ children, roles = [], fallback = "/unauthorized" }) {
  const { isAuthenticated, hasRole, loading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no roles specified, allow access (just check authentication)
  if (!roles || roles.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasRequiredRole = hasRole(roles);

  if (hasRequiredRole) {
    return children;
  }

  // If user doesn't have required role, redirect to fallback or unauthorized page
  return <Navigate to={fallback} replace />;
}
