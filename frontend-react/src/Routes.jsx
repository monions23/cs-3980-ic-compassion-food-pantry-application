import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");

  // If no token, bounce them to login
  if (!token) {
    return <Navigate to="/welcome" replace />;
  }

  // If token exists, render the "nested" child routes
  return <Outlet />;
};
