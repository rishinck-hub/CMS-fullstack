import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ children, roles = [] }) {
  const hasRole = true; // placeholder
  return hasRole ? children : <Navigate to="/login" />;
}
