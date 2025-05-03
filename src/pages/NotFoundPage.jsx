import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundStyle.css';

export default function NotFoundPage() {
  return (
    <div className="notfound-page">
      <h1 className="error-code">404</h1>
      <p className="error-text">Сторінку не знайдено</p>
      <Link to="/signin" className="home-button">
        Повернутися на головну
      </Link>
    </div>
  );
}
