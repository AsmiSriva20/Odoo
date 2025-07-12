'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved session on page load
  useEffect(() => {
    const savedUser = localStorage.getItem('rewearUser');
    const savedToken = localStorage.getItem('rewearToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  // Called after successful login
  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('rewearUser', JSON.stringify(userData));
    localStorage.setItem('rewearToken', token);
  };

  // Called on logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rewearUser');
    localStorage.removeItem('rewearToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use anywhere
export const useAuth = () => useContext(AuthContext);
