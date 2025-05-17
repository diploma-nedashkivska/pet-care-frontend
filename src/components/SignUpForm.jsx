import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { z } from 'zod';
import '../styles/SignUpStyle.css';
import { toast } from 'react-toastify';

const SignUpSchema = (t) =>
  z.object({
    fullName: z.string().min(1, t('error-signup-fullName')),
    email: z.string().email(t('error-signup-email')),
    password: z.string().min(6, t('error-signup-password')),
  });

export default function SignUpForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    const schema = SignUpSchema(t);
    const result = schema.safeParse({ fullName, email, password });
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

    const data = new FormData();
    data.append('full_name', fullName);
    data.append('email', email);
    data.append('password', password);
    if (photo) data.append('photo', photo);

    try {
      await api.post('/signup/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(t('signup-success'));
      setTimeout(() => navigate('/signin'), 1500);
    } catch (error) {
      if (error.response?.data) {
        const msg = error.response.data.message || JSON.stringify(error.response.data);
        toast.error(`${t('signup-error')}: ${msg}`);
      } else {
        toast.error(t('signup-error'));
        console.error(error);
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChooseClick = () => fileInputRef.current?.click();
  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  const formClass = preview ? 'signup-form has-preview' : 'signup-form';

  return (
    <form className={formClass} onSubmit={submit} noValidate>
      <h2>{t('signup')}</h2>

      <div className="signup form-group">
        <label htmlFor="fullName">{t('fullName')}</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onFocus={() => clearError('fullName')}
          placeholder={errors.fullName || t('fullNamePlaceholder')}
          className={errors.fullName ? 'input-error' : ''}
        />
      </div>

      <div className="signup form-group">
        <label htmlFor="email">{t('email')}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => clearError('email')}
          placeholder={errors.email || t('emailPlaceholder')}
          className={errors.email ? 'input-error' : ''}
        />
      </div>

      <div className="signup form-group">
        <label htmlFor="password">{t('password')}</label>
        <div className="signup password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => clearError('password')}
            placeholder={errors.password || t('passwordPlaceholder')}
            className={errors.password ? 'input-error' : ''}
          />
          <button
            type="button"
            className="signup toggle-password"
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

      <div className="signup form-group">
        <label htmlFor="photo">{t('photo')}</label>
        <div className="custom-file-input">
          <input
            id="photo"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />
          <button type="button" className="choose-photo-button" onClick={handleChooseClick}>
            {t('chooseFile')}
          </button>
          <span>{photo ? photo.name : t('noFileChosen')}</span>
        </div>
        {preview && <img src={preview} alt="preview" className="photo-preview" />}
      </div>

      <button type="submit" className="signup-button">
        {t('signup-button')}
      </button>

      <div className="signup-no-account">
        {t('have-account')} <Link to="/signin">{t('signin-button')}</Link>
      </div>
    </form>
  );
}
