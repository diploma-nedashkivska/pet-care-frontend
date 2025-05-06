import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('access_token');
      delete axios.defaults.headers.common.Authorization;
      setUser({});
    }
  }, [token]);

  const login = useCallback((accessToken) => {
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:8000/profile/')
      .then(({ data }) => {
        setUser(data.payload ?? data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
        } else {
          console.warn('Помилка при завантаженні користувачів, але сесія лишається:', err);
        }
      });
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
