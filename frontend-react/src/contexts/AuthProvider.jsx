import { useState, useEffect } from "react";

import { decodeTokenSafe } from "../utilities/Helper_Functions/Auth_Helpers";

import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Use "access_token" to match your actual storage key
    const token = localStorage.getItem("access_token");
    return !!token;
  });

  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const payload = decodeTokenSafe(token);
      return payload?.role || null;
    }
    return null;
  });

  if (isAuthenticated === null) {
    return <h1>Loading...</h1>; // or spinner
  }

  const login = (token) => {
    localStorage.setItem("access_token", token);
    setIsAuthenticated(true);

    const payload = decodeTokenSafe(token);
    if (payload && payload.role) {
      setUserRole(payload.role);
    } else {
      setUserRole("BasicUser");
    }
  };
  const logout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const value = { isAuthenticated, userRole, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
