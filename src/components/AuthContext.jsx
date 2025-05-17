import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setupInterceptors } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common.Authorization;
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    const eject = setupInterceptors((newToken) => setToken(newToken));
    return eject;
  }, []);

  const login = useCallback((accessToken) => {
    setToken(accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/logout/');
    } catch (e) {
      console.warn('Logout failed', e);
    }
    setToken(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    api
      .get('/profile/')
      .then(({ data }) => setUser(data.payload ?? data))
      .catch((err) => {
        if (err.response?.status === 401) logout();
        else console.warn('Не вдалося завантажити профіль:', err);
      });
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
