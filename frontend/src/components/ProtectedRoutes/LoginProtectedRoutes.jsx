import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const LoginProtectedRoute = () => {
  const token =localStorage.getItem('token')
  const token1 = localStorage.getItem('token1')

  return token||token1 ?<Navigate to="/feed" />: <Outlet />  ;
};
export default LoginProtectedRoute;