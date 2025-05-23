import React, { useState, useEffect } from 'react';
import '../styles/JournalStyle.css';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const JournalSchema = (t) =>
  z.object({
    pet: z.string().min(1, t('selectPetPlaceholder')),
    entry_title: z.string().min(1, t('titlePlaceholder')),
  });

export default function JournalModal({ isOpen, onClose, onSave, onDelete, entryData, pets }) {
  const { t } = useTranslation();
  const TYPE_CHOICES = [
    { value: 'CHECKUP', label: t('checkup') },
    { value: 'VACCINATION', label: t('vaccination') },
    { value: 'FLEA_CTRL', label: t('flea_ctrl') },
    { value: 'GROOMING', label: t('grooming') },
    { value: 'BATH', label: t('bath') },
    { value: 'TRAINING', label: t('training') },
    { value: 'OTHER', label: t('other') },
  ];
  const [form, setForm] = useState({
    id: null,
    pet: '',
    entry_type: 'OTHER',
    entry_title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    if (entryData) {
      setForm({
        id: entryData.id,
        pet: String(entryData.pet),
        entry_type: String(entryData.entry_type || 'OTHER'),
        entry_title: entryData.entry_title,
        description: entryData.description || '',
      });
    } else {
      setForm({ id: null, pet: '', entry_type: 'OTHER', entry_title: '', description: '' });
    }
  }, [entryData, isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setForm({ id: null, pet: '', entry_type: 'OTHER', entry_title: '', description: '' });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let schema = JournalSchema(t);
    if (form.id) {
      schema = schema.partial({ pet: true });
    }
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0]] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onSave(form);
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="journal modal-overlay">
      <div className="journal modal-window">
        <button className="journal close-btn" onClick={handleClose}>
          <img src="/icons/close.png" alt="close" />
        </button>
        <h2>{form.id ? t('edit-journal-entry') : t('add-journal-entry')}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="journal-form">
            <label>{t('title')}</label>
            <input
              name="entry_title"
              value={form.entry_title}
              onChange={handleChange}
              onFocus={() => clearError('entry_title')}
              placeholder={errors.entry_title || t('titlePlaceholder')}
              className={errors.entry_title ? 'input-error' : ''}
            />
          </div>
          <div className="journal-form-row">
            <div className="journal-form">
              <label>{t('pet')}</label>
              <select
                name="pet"
                value={form.pet}
                onChange={handleChange}
                onFocus={() => clearError('pet')}
                className={errors.pet ? 'input-error' : ''}
              >
                <option value="" disabled>
                  {errors.pet || t('selectPetPlaceholder')}
                </option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.pet_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="journal-form">
              <label>{t('type')}</label>
              <select name="entry_type" value={form.entry_type} onChange={handleChange}>
                <option value="" disabled>
                  {errors.entry_type || t('selectTypePlaceholder')}
                </option>
                {TYPE_CHOICES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="journal-form">
            <label>{t('description')}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t('descriptionEntryPlaceholder')}
            />
          </div>
          <div className="journal modal-buttons">
            {form.id && (
              <button type="button" className="delete-btn" onClick={() => onDelete(form.id)}>
                {t('delete-button')}
              </button>
            )}
            <button type="submit">{t('save-button')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
