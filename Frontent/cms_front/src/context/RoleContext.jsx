import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const RoleContext = createContext();

export function RoleProvider({ children }) {
  const { user } = useContext(AuthContext);
  const role = user?.role || null;

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}
