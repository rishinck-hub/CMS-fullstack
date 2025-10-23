import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // user object, e.g. { username, role, ... }
  const [isAuthenticated, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, load token and user from localStorage
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setAuth(true);
      setUser(JSON.parse(userData));
      
      // Fetch fresh user data from server
      getCurrentUser()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          // If token is invalid, logout
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (user, token, refresh) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth(true);
    setUser(user);
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    setAuth(false);
    setUser(null);
    setLoading(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    // Define role-based permissions
    const rolePermissions = {
      Admin: ['*'], // Admin has all permissions
      Doctor: ['view_patients', 'manage_consultations', 'view_prescriptions'],
      Receptionist: ['manage_patients', 'schedule_appointments', 'view_appointments'],
      Pharmacist: ['manage_medicines', 'process_prescriptions', 'view_inventory']
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      login, 
      logout, 
      updateUser,
      hasRole,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}
