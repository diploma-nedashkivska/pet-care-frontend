import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/SignInStyle.css';

export default function SignInForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="signin-form">
      <h2>{t('signin')}</h2>

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
          >
            {showPassword ? (
              <img src="/icons/password-view.png" alt="eye" />
            ) : (
              <img src="/icons/password-hide.png" alt="eye-off" />
            )}
          </button>
        </div>
      </div>

      <button type="submit" className="signin-button">
        {t('signin-button')}
      </button>

      <div className="no-account">
        {t('no-account')} <Link to="/signup">{t('no-account-signup')}</Link>
      </div>
    </form>
  );
}
