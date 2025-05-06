import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/Header.css';
import UserProfile from './UserProfile';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!user) return null;

  return (
    <>
      <header className="app-header">
        <div className="container">
          <select className="languages" value={i18n.language} onChange={handleLanguageChange}>
            <option value="uk">UK</option>
            <option value="en">EN</option>
          </select>

          <nav className="main-nav">
            <NavLink to="/pets" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('pets-page')}
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('calendar-page')}
            </NavLink>
            <NavLink to="/journal" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('journal-page')}
            </NavLink>
            <NavLink to="/forum" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('forum-page')}
            </NavLink>
            <NavLink to="/partners" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('partners-page')}
            </NavLink>
          </nav>
          {user && (
            <div className="user-section">
              <span className="user-name">{user?.full_name || ''}</span>
              <img
                src={user?.photo_url || '/icons/user.png'}
                alt="profile"
                className="user-icon"
                onClick={() => setModalOpen(true)}
              />
            </div>
          )}
        </div>
      </header>
      <UserProfile
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </>
  );
}
