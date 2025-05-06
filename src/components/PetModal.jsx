import React, { useState, useEffect, useRef } from 'react';
import '../styles/PetStyle.css';

export default function PetModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    pet_name: '',
    breed: '',
    sex: 'FEMALE',
    birthday: '',
  });

  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        pet_name: initialData.pet_name || '',
        breed: initialData.breed || '',
        sex: initialData.sex || 'FEMALE',
        birthday: initialData.birthday || '',
      });
      setPhoto(null);
    } else {
      setForm({
        pet_name: '',
        breed: '',
        sex: 'FEMALE',
        birthday: '',
      });
    }
  }, [initialData, isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
  };

  const handleChooseClick = () => fileInputRef.current?.click();

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('pet_name', form.pet_name);
    data.append('breed', form.breed);
    data.append('sex', form.sex);
    data.append('birthday', form.birthday);
    if (photo) {
      data.append('photo', photo);
    }
    onSave(data);
  }

  if (!isOpen) return null;

  return (
    <div className="pet modal-overlay">
      <div className="pet modal-window">
        <button className="pet close-btn" onClick={onClose}>
          <img src="/icons/close.png" alt="Закрити" />
        </button>
        <h2>{initialData ? 'Редагувати тварину' : 'Додати тварину'}</h2>
        <form onSubmit={handleSubmit}>
          <div className='pet-form'>
            <label>Ім’я:</label>
            <input name="pet_name" value={form.pet_name} onChange={handleChange} required />
          </div>
          <div className='pet-form'>
            <label>Порода:</label>
            <input name="breed" value={form.breed} onChange={handleChange} required />
          </div>
          <div className='pet-form'>
            <label>Стать: </label>
            <select name="sex" value={form.sex} onChange={handleChange}>
              <option value="MALE">Чоловіча</option>
              <option value="FEMALE">Жіноча</option>
            </select>
          </div>
          <div className='pet-form'>
            <label>День народження:</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              required
            />
          </div>
          <div className='pet-form'>
            <label>Фотографія </label>
            <div className="custom-file-input">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />

              <button type="button" onClick={handleChooseClick}>
                Обрати файл
              </button>
              <span>{photo ? photo.name : 'Файл не обрано'}</span>
            </div>
          </div>

          <div className="pet modal-buttons">
            <button type="submit">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
}
