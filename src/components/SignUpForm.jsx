import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/SignUpStyle.css';

export default function SignUpForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="signup-form">
      <h2>{t('sign-up')}</h2>

      <div className="form-group">
        <label htmlFor="firstName">{t('firstName')}</label>
        <input id="firstName" type="text" placeholder={t('firstNamePlaceholder')} required />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">{t('lastName')}</label>
        <input id="lastName" type="text" placeholder={t('lastNamePlaceholder')} required />
      </div>

      <div className="form-group">
        <label htmlFor="email">{t('email')}</label>
        <input id="email" type="email" placeholder={t('emailPlaceholder')} required />
      </div>

      <div className="form-group">
        <label htmlFor="password">{t('password')}</label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
          >
            {showPassword ? (
              <img src="/icons/password-view.png" alt="eye" />
            ) : (
              <img src="/icons/password-hide.png" alt="eye-off" />
            )}
          </button>
        </div>
      </div>

      <button type="submit" className="signup-button">
        {t('sign-up-button')}
      </button>

      <div className="signup-no-account">
        {t('have-account')} <Link to="/">{t('sign-in-button')}</Link>
      </div>
    </form>
  );
}
