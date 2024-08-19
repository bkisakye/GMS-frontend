import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    // Update Context or State Management Store (if applicable)
    navigate('/login'); // Redirect to login page
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
