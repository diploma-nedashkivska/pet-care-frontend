import React, { useState, useEffect } from 'react';
import '../styles/CalendarStyle.css';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const EventSchema = (t) =>
  z.object({
    pet: z.string().min(1, t('selectPetPlaceholder')),
    event_title: z.string().min(1, t('titlePlaceholder')),
    start_date: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? new Date(val) : val),
      z.date({ required_error: ' ' }),
    ),
  });

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CalendarModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  eventData,
  date,
  pets,
}) {
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
    event_type: 'OTHER',
    event_title: '',
    start_date: formatDateLocal(date),
    start_time: '',
    description: '',
    completed: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    if (eventData) {
      setForm({
        id: eventData.id,
        pet: String(eventData.pet),
        event_type: String(eventData.event_type || 'OTHER'),
        event_title: eventData.event_title,
        start_date: eventData.start_date,
        start_time: eventData.start_time || '',
        description: eventData.description || '',
        completed: !!eventData.completed,
      });
    } else {
      setForm((f) => ({
        ...f,
        id: null,
        pet: '',
        event_type: 'OTHER',
        start_date: formatDateLocal(date),
        event_title: '',
        start_time: '',
        description: '',
        completed: false,
      }));
    }
  }, [eventData, date, pets]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let schema = EventSchema(t);
    if (form.id) {
      schema = schema.partial({ pet: true });
    }
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
    onSave(form);
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="calendar modal-overlay">
      <div className="calendar modal-window">
        <button className="calendar close-btn" onClick={onClose}>
          <img src="/icons/close.png" alt="close" />
        </button>
        <h2>{form.id ? t('edit-event') : t('add-event')}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="calendar-form">
            <label>{t('title')}</label>
            <input
              name="event_title"
              value={form.event_title}
              onChange={handleChange}
              onFocus={() => clearError('event_title')}
              placeholder={errors.event_title || t('titlePlaceholder')}
              className={errors.event_title ? 'input-error' : ''}
            />
          </div>
          <div className="calendar-form-row">
            <div className="calendar-form">
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
                  <option key={p.id} value={String(p.id)}>
                    {p.pet_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="calendar-form">
              <label>{t('type')}</label>
              <select name="event_type" value={form.event_type} onChange={handleChange}>
                <option value="" disabled>
                  {errors.event_type || t('selectTypePlaceholder')}
                </option>
                {TYPE_CHOICES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="calendar-form">
            <label>{t('date')}</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              onFocus={() => clearError('start_date')}
              className={errors.start_date ? 'input-error' : ''}
            />
          </div>

          <div className="calendar-form">
            <label>{t('time')}</label>
            <input type="time" name="start_time" value={form.start_time} onChange={handleChange} />
          </div>
          <div className="calendar-form">
            <label>{t('description')}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t('descriptionEventPlaceholder')}
            />
          </div>
          <div className="calendar-form checkbox-group">
            <label className="checkbox-label">
              {t('completed')}
              <input
                type="checkbox"
                name="completed"
                checked={form.completed}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="calendar modal-buttons">
            {form.id && (
              <button type="button" onClick={() => onDelete(form.id)}>
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
