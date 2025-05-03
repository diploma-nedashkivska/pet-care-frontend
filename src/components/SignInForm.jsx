import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/SignInStyle.css';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function SignInForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    try {
      const { data } = await axios.post('http://localhost:8000/signin/', user);
      login(data.payload.accessToken);
      navigate('/profile');
    } catch (error) {
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else {
        console.error(error.message);
      }
    }
  };

  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="signin-form" onSubmit={submit}>
      <h2>{t('signin')}</h2>

      <div className="form-group">
        <label htmlFor="email">{t('email')}</label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder={t('emailPlaceholder')}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">{t('password')}</label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder={t('passwordPlaceholder')}
            required
            onChange={(e) => setPassword(e.target.value)}
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
