import React, { useState, useEffect, useRef } from 'react';
import '../styles/PetStyle.css';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const PetSchema = (t) =>
  z.object({
    pet_name: z.string().min(1, t('fullNamePlaceholder')),
    breed: z.string().min(1, t('breedPlaceholder')),
    birthday: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? new Date(val) : val),
      z
        .date({
          required_error: '',
        })
        .min(new Date('1950-01-01'), { required_error: '' })
        .max(new Date(), { required_error: '' }),
    ),
  });

export default function PetModal({ isOpen, onClose, onSave, initialData }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    pet_name: '',
    breed: '',
    sex: 'FEMALE',
    birthday: '',
  });

  const [errors, setErrors] = useState({});
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
      setErrors({});
    } else {
      setForm({
        pet_name: '',
        breed: '',
        sex: 'FEMALE',
        birthday: '',
      });
      setPhoto(null);
      setErrors({});
    }
  }, [initialData, isOpen]);

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

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

    const schema = PetSchema(t);
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
        <h2>{initialData ? t('edit-pet') : t('add-pet')}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="pet-form">
            <label>{t('fullName')}</label>
            <input
              name="pet_name"
              value={form.pet_name}
              onChange={handleChange}
              onFocus={() => clearError('pet_name')}
              placeholder={errors.pet_name || t('fullNamePlaceholder')}
              className={errors.pet_name ? 'input-error' : ''}
            />
          </div>
          <div className="pet-form">
            <label>{t('breed')}</label>
            <input
              name="breed"
              value={form.breed}
              onChange={handleChange}
              onFocus={() => clearError('breed')}
              placeholder={errors.breed || t('breedPlaceholder')}
              className={errors.breed ? 'input-error' : ''}
            />
          </div>
          <div className="pet-form">
            <label>{t('gender')}</label>
            <select name="sex" value={form.sex} onChange={handleChange}>
              <option value="MALE">{t('male')}</option>
              <option value="FEMALE">{t('female')}</option>
            </select>
          </div>
          <div className="pet-form">
            <label>{t('birthday')}</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              onFocus={() => clearError('birthday')}
              className={errors.birthday ? 'input-error' : ''}
            />
          </div>
          <div className="pet-form">
            <label>{t('photo')}</label>
            <div className="custom-file-input">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />

              <button type="button" onClick={handleChooseClick}>
                {t('chooseFile')}
              </button>
              <span>{photo ? photo.name : t('noFileChosen')}</span>
            </div>
          </div>

          <div className="pet modal-buttons">
            <button type="submit">{t('save-button')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
