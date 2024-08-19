// useAuth.js
import { useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false
  return { isAuthenticated, setIsAuthenticated };
};

export default useAuth;
