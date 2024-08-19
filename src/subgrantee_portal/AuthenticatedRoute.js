// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
//import useAuth from './useAuth'; // Import your authentication hook
import useAuth from '../useAuth'

const ProtectedRoute = ({ children }) => {
  //const { isAuthenticated } = useAuth(); // Use your auth logic here
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
