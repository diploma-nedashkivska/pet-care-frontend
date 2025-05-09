import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { z } from 'zod';
import '../styles/Header.css';

const ProfileSchema = (t) =>
  z.object({
    fullName: z.string().min(1, t('error-signup-fullName')),
    email: z.string().email(t('error-signup-email')),
    password: z.string().min(6, t('error-signup-password')).optional().or(z.literal('')),
  });

export default function UserProfile({ isOpen, onClose, onUpdate }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const handleError = (e) => {
    e.target.src = '/icons/user.png';
  };
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    axios
      .get('http://localhost:8000/profile/')
      .then(({ data }) => {
        const user = data.payload ?? data;
        setForm({
          fullName: user.full_name,
          email: user.email,
          password: '',
          photo: null,
        });
        setPreview(user.photo_url);
        setErrors({});
      })
      .catch((err) => console.error(err));
  }, [isOpen]);

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm((f) => ({ ...f, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = ProfileSchema(t);
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const payload = new FormData();
    payload.append('full_name', form.fullName);
    payload.append('email', form.email);
    if (form.password) payload.append('password', form.password);
    if (form.photo) payload.append('photo', form.photo);

    try {
      const { data } = await axios.patch('http://localhost:8000/profile/', payload);
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="user modal-overlay">
      <div className="user modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="user close-btn" onClick={onClose}>
          <img src="/icons/close.png" alt="Закрити" />
        </button>
        <h2>{t('edit-profile')}</h2>
        <div className="user modal-content">
          <div className="user avatar-column">
            <img
              src={preview || '/icons/user.png'}
              alt="avatar"
              className="user avatar-image"
              onError={handleError}
            />
          </div>
          <div className="user form-column">
            <form onSubmit={handleSubmit} noValidate>
              <label>
                {t('fullName')}
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onFocus={() => clearError('fullName')}
                  placeholder={errors.fullName || ''}
                  className={errors.fullName ? 'input-error' : ''}
                />
              </label>
              <label>
                {t('email')}
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => clearError('email')}
                  placeholder={errors.email || ''}
                  className={errors.email ? 'input-error' : ''}
                />
              </label>
              <label>
                {t('new-password')}
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => clearError('password')}
                  placeholder={errors.password || t('new-passwordPlaceholder')}
                  className={errors.password ? 'input-error' : ''}
                />
              </label>
              {/* <label>
                Фото профілю
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </label> */}
              <div className="user buttons">
                {/* <button type="button" onClick={onClose}>Закрити</button> */}
                <button type="submit">{t('save-button')}</button>
              </div>
            </form>
            <button
              className="user logout-button"
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
            >
              {t('signout-button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
