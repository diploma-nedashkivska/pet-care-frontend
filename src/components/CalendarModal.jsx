import React, { useState, useEffect } from 'react';
import '../styles/CalendarStyle.css';

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
  const [form, setForm] = useState({
    id: null,
    pet: '',
    event_title: '',
    start_date: formatDateLocal(date),
    start_time: '',
    description: '',
    completed: false,
  });

  useEffect(() => {
    if (eventData) {
      setForm({
        id: eventData.id,
        pet: eventData.pet,
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>{form.id ? 'Редагувати подію' : 'Додати подію'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label>Тварина</label>
          <select name="pet" value={form.pet} onChange={handleChange} required>
            <option value="" disabled>
              Оберіть тварину
            </option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.pet_name}
              </option>
            ))}
          </select>

          <label>Заголовок</label>
          <input name="event_title" value={form.event_title} onChange={handleChange} required />

          <label>Дата</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />

          <label>Час</label>
          <input type="time" name="start_time" value={form.start_time} onChange={handleChange} />

          <label>Опис</label>
          <textarea name="description" value={form.description} onChange={handleChange} />

          <label>
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />{' '}
            Виконано
          </label>

          <div className="modal-buttons">
            <button type="submit">Зберегти</button>
            {form.id && (
              <button type="button" onClick={() => onDelete(form.id)}>
                Видалити
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
