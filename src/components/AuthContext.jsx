import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios
        .get('http://localhost:8000/profile/')
        .then(({ data }) => setUser(data.payload))
        .catch(() => logout());
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
