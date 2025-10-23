import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = user?.role;
  console.log("ProtectedRoute check: user role =", role, "allowedRoles =", allowedRoles);

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    console.warn(`Access denied for ${user.username} (${role})`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
