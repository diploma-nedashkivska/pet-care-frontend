import React, { useState, useEffect } from 'react';
import '../styles/PetStyle.css';

export default function PetModal({
  isOpen, 
  onClose,
  onSave, 
  initialData, 
}) {
  const [form, setForm] = useState({
    pet_name: '',
    breed: '',
    sex: 'FEMALE',
    birthday: '',
    photo_url: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        pet_name: initialData.pet_name || '',
        breed: initialData.breed || '',
        sex: initialData.sex || 'FEMALE',
        birthday: initialData.birthday || '',
        photo_url: initialData.photo_url || '',
      });
    } else {
      // чиста форма
      setForm({
        pet_name: '',
        breed: '',
        sex: 'FEMALE',
        birthday: '',
        photo_url: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('pet_name', form.pet_name);
    data.append('breed', form.breed);
    data.append('sex', form.sex);
    data.append('birthday', form.birthday);
    data.append('photo_url', form.photo_url);
    onSave(form);
  }

  return (
    <div className="pet modal-overlay">
      <div className="pet modal-window">
        <h2>{initialData ? 'Редагувати тварину' : 'Додати тварину'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Ім’я:
            <input name="pet_name" value={form.pet_name} onChange={handleChange} required />
          </label>
          <label>
            Порода:
            <input name="breed" value={form.breed} onChange={handleChange} required />
          </label>
          <label>
            Стать:
            <select name="sex" value={form.sex} onChange={handleChange}>
              <option value="MALE">Чоловіча</option>
              <option value="FEMALE">Жіноча</option>
            </select>
          </label>
          <label>
            День народження:
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Фото (URL):
            <input name="photo_url" value={form.photo_url} onChange={handleChange} />
          </label>
          <div className="pet modal-buttons">
            <button type="button" onClick={onClose}>
              Скасувати
            </button>
            <button type="submit">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
}
