import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // user object, e.g. { username, role, ... }
  const [isAuthenticated, setAuth] = useState(false);

  useEffect(() => {
    // On mount, load token and user from localStorage
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setAuth(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (user, token, refresh) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setAuth(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
