import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import userIcon from '../icons/user.png';
import '../styles/Header.css';

export default function Header() {
  const { i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="app-header">
      <div className="container">
        <select value={i18n.language} onChange={handleLanguageChange}>
          <option value="uk">UK</option>
          <option value="en">EN</option>
        </select>

        <nav className="main-nav">
          <NavLink to="/profiles"   className={({ isActive }) => isActive ? 'active' : ''}>Профілі тварин</NavLink>
          <NavLink to="/calendar"   className={({ isActive }) => isActive ? 'active' : ''}>Календар</NavLink>
          <NavLink to="/journal"    className={({ isActive }) => isActive ? 'active' : ''}>Журнал</NavLink>
          <NavLink to="/forum"      className={({ isActive }) => isActive ? 'active' : ''}>Форум</NavLink>
          <NavLink to="/partners"   className={({ isActive }) => isActive ? 'active' : ''}>Сайти-партнери</NavLink>
        </nav>

        <div className="user-section">
          {user ? (
            <>
              <span className="user-name">{user.full_name}</span>
              <img
                src={user.photo_url || userIcon}
                alt="profile"
                className="user-icon"
                onClick={() => navigate('/profile')}
              />
              <button className="logout-btn" onClick={logout}>Вийти</button>
            </>
          ) : (
            <NavLink to="/signin" className="signin-link">Увійти</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
