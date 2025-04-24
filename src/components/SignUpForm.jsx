import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/SignUpStyle.css';

export default function SignUpForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChooseClick = () => fileInputRef.current?.click();

  const formClass = preview ? 'signup-form has-preview' : 'signup-form';

  return (
    <form className={formClass}>
      <h2>{t('signup')}</h2>

      <div className="form-group">
        <label htmlFor="fullName">{t('fullName')}</label>
        <input id="fullName" type="text" placeholder={t('fullNamePlaceholder')} required />
      </div>

      <div className="signup form-group">
        <label htmlFor="email">{t('email')}</label>
        <input id="email" type="email" placeholder={t('emailPlaceholder')} required />
      </div>

      <div className="signup form-group">
        <label htmlFor="password">{t('password')}</label>
        <div className="signup password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            required
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
        {t('have-account')} <Link to="/">{t('signin-button')}</Link>
      </div>
    </form>
  );
}
