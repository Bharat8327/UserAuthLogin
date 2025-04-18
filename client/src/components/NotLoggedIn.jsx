import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function NotLoggedIn() {
  const user = localStorage.getItem('token');
  return user ? <Navigate to="/" /> : <Outlet />;
}

export default NotLoggedIn;
