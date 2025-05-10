import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/pets" replace />;
}
