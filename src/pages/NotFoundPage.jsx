import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/NotFoundStyle.css';

export default function NotFoundPage() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const handleHome = () => {
    logout();
    nav('/signin');
  };
  return (
    <div className="notfound-page">
      <h1 className="error-code">404</h1>
      <p className="error-text">Сторінку не знайдено</p>
      <button onClick={handleHome} className="home-button">
        Повернутися на головну
      </button>
    </div>
  );
}
