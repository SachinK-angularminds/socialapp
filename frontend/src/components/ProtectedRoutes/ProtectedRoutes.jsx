import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  const token = localStorage.getItem('token')
  const token1 = localStorage.getItem('token1')


  return token || token1 ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};
export default ProtectedRoute;