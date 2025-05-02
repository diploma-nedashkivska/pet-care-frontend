import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUpStyle.css';

export default function SignUpForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/signup/', {
        full_name: fullName,
        email,
        password
      });
      navigate('/signin'); 
    } catch (error) {
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        alert(JSON.stringify(error.response.data));
      } else {
        console.error(error.message);
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

  const formClass = preview ? 'signup-form has-preview' : 'signup-form';

  return (
    <form className={formClass} onSubmit={submit}>
      <h2>{t('signup')}</h2>

      <div className="signup form-group">
        <label htmlFor="fullName">{t('fullName')}</label>
        <input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t('fullNamePlaceholder')} required />
      </div>

      <div className="signup form-group">
        <label htmlFor="email">{t('email')}</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} required />
      </div>

      <div className="signup form-group">
        <label htmlFor="password">{t('password')}</label>
        <div className="signup password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
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
        {t('have-account')} <Link to="/signin">{t('signin-button')}</Link>
      </div>
    </form>
  );
}
