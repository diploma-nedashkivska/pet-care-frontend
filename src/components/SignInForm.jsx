import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/SignInStyle.css';

export default function SignInForm() {
  const { t } = useTranslation();
  return (
    <form className="signin-form">
      <h2>{t('welcome')}</h2>

      <div className="form-group">
        <label htmlFor="email">{t('email')}</label>
        <input type="email" placeholder={t('emailPlaceholder')} required />
      </div>

      <div className="form-group">
        <label htmlFor="password">{t('password')}</label>
        <input type="password" placeholder={t('passwordPlaceholder')} required />
      </div>

      <button type="submit">{t('sign-in-button')}</button>

      <div className="signin-no-account">
        {t('no-account')} <a href="#">{t('sign-up')}</a>
      </div>
    </form>
  );
}
