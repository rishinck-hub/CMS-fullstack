// This file is deprecated. Use useAuth from useRole.js instead.
// Keeping this file for backward compatibility but it will be removed in future versions.

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  console.warn("useAuth from useAuth.js is deprecated. Use { useAuth } from useRole.js instead.");
  return useContext(AuthContext);
}
