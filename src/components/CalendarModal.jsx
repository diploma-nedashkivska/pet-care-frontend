// src/components/CalendarModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/CalendarStyle.css';

export default function CalendarModal({
  isOpen, onClose, onSave, onDelete,
  eventData, date, pets
}) {
  const [form, setForm] = useState({
    id: null,
    pet: pets.length ? pets[0].id : null,      // за замовчуванням перша тварина
    event_title: '',
    start_date: date.toISOString().slice(0, 10),
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
      setForm(f => ({
        ...f,
        id: null,
        pet: pets.length ? pets[0].id : null,
        start_date: date.toISOString().slice(0, 10),
        event_title: '',
        start_time: '',
        description: '',
        completed: false,
      }));
    }
  }, [eventData, date, pets]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{form.id ? 'Редагувати подію' : 'Додати подію'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Вибір тварини */}
          <label>Тварина</label>
          <select
            name="pet"
            value={form.pet || ''}
            onChange={handleChange}
            required
          >
            {pets.map(p => (
              <option key={p.id} value={p.id}>
                {p.pet_name}
              </option>
            ))}
          </select>

          <label>Заголовок</label>
          <input
            name="event_title"
            value={form.event_title}
            onChange={handleChange}
            required
          />

          <label>Дата</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />

          <label>Час</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
          />

          <label>Опис</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            /> Виконано
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
