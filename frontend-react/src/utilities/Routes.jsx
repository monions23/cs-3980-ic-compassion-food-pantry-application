import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./UseAuth";
export const ProtectedRoute = () => {
  const { isAuthenticated, userRole } = useAuth();

  // If no token, bounce them to login
  if (!isAuthenticated && !localStorage.getItem("access_token")) {
    return <Navigate to="/welcome" replace />;
  }

  // If token exists, render the "nested" child routes
  return <Outlet />;
};
