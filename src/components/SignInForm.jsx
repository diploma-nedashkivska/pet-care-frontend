import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/SignInStyle.css';

export default function SignInForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <form className="signin-form">
      <h2>{t('welcome')}</h2>

      <div className="form-group">
        <label htmlFor="email">{t('email')}</label>
        <input type="email" placeholder={t('emailPlaceholder')} required />
      </div>

      <div className="form-group">
        <label htmlFor="password">{t('password')}</label>
        <div className="password-input-wrapper">
          <input
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

      <button type="submit" className="sign-in-button">
        {t('sign-in-button')}
      </button>

      <div className="signin-no-account">
        {t('no-account')} <Link to="/signup">{t('no-account-sign-up')}</Link>
      </div>
    </form>
  );
}
