import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import '../styles/Header.css';

export default function UserProfile({ isOpen, onClose, onUpdate }) {
  const { logout } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    photo: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    axios.get('http://localhost:8000/profile/')
      .then(({ data }) => {
        console.log('Профіль:', data);
        const user = data.payload ?? data;
        setForm({
          full_name: user.full_name,
          email: user.email,
          password: '',
          photo: null,
        });
        setPreview(user.photo_url);
      })
      .catch(err => console.error(err));
  }, [isOpen]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm(f => ({ ...f, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('full_name', form.full_name);
    payload.append('email', form.email);
    if (form.password) payload.append('password', form.password);
    if (form.photo) payload.append('photo', form.photo);

    try {
      const { data } = await axios.put('http://localhost:8000/profile/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error(error.response.data);
      alert('Не вдалося зберегти зміни');
    }
  };

  if (!isOpen) return null;
  return (
    <div className="user modal-overlay">
      <div className="user modal-window" onClick={e => e.stopPropagation()}>
        <button className="user close-btn" onClick={onClose}>
          <img src="/icons/close.png" alt="Закрити" />
        </button>
        <h2>Редагувати профіль</h2>
        <div className="user modal-content">
          <div className="user avatar-column">
            <img
              src={preview || '/icons/user.png'}
              alt="avatar"
              className="user avatar-image"
            />
          </div>
          <div className="user form-column">
            <form onSubmit={handleSubmit}>
              <label>
                Ім’я
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Новий пароль
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Залиште порожнім, якщо не міняти"
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
                <button type="submit">Зберегти</button>
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
              Вийти з акаунту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
