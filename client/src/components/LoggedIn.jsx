import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function LoggedIn() {
  const user = localStorage.getItem('token'); // Check if token is available in localStorage

  // If token does not exist, redirect to login page
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default LoggedIn;
