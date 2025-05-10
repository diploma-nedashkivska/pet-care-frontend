import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/SignInStyle.css';
import axios from 'axios';
import { z } from 'zod';
import { toast } from 'react-toastify';

const SignUpSchema = (t) =>
  z.object({
    email: z.string().min(1, t('error-signin-email')),
    password: z.string().min(1, t('error-signin-password')),
  });

export default function SignInForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const schema = SignUpSchema(t);
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const user = {
      email: email,
      password: password,
    };
    try {
      const { data } = await axios.post('http://localhost:8000/signin/', user);
      login(data.payload.accessToken);
      toast.success(t('signin-success'));
      setTimeout(() => navigate('/pets'), 800);
    } catch (error) {
      let msg = '';
      if (error.response?.data) {
        msg = error.response.data.message || JSON.stringify(error.response.data);
      } else {
        msg = error.message;
      }
      toast.error(`${t('signin-error')}: ${msg}`);
      console.error(error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <form className="signin-form" onSubmit={submit} noValidate>
      <h2>{t('signin')}</h2>

      <div className="form-group">
        <label htmlFor="email">{t('email')}</label>
        <input
          id="email"
          type="email"
          value={email}
          onFocus={() => clearError('email')}
          placeholder={errors.email || t('emailPlaceholder')}
          className={errors.email ? 'input-error' : ''}
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
            onFocus={() => clearError('password')}
            placeholder={errors.password || t('passwordPlaceholder')}
            className={errors.password ? 'input-error' : ''}
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
