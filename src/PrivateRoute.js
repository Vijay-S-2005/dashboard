// PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('session_id');
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;