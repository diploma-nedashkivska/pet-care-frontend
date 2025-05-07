// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import CalendarModal from '../components/CalendarModal';
import { useTranslation } from 'react-i18next';
import '../styles/CalendarStyle.css';
import Header from '../components/Header';

const MONTHS_UA = [
  'Січень','Лютий','Березень','Квітень',
  'Травень','Червень','Липень','Серпень',
  'Вересень','Жовтень','Листопад','Грудень'
];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  let current = 1 - ((firstDay + 6) % 7);
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(year, month, current));
      current++;
    }
    weeks.push(week);
  }
  return weeks;
}

export default function CalendarPage() {
  const { token } = useAuth();
  const { t } = useTranslation();

  const [pets, setPets] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeks, setWeeks] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalDate, setModalDate] = useState(new Date());

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios.get('http://localhost:8000/pets/')
        .then(res => setPets(res.data.payload || []))
        .catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setWeeks(buildCalendar(year, month));

    axios.get('http://localhost:8000/calendar/', {
      params: { year, month: month + 1 }
    })
      .then(res => setEvents(res.data.payload || []))
      .catch(console.error);
  }, [currentDate]);

  const handlePrev = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const handleNext = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleAdd = () => {
    setSelectedEvent(null);
    setModalDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      new Date().getDate()
    ));
    setModalOpen(true);
  };

  // залишаємо для кліку по порожній клітинці
  const handleCellClick = date => {
    setSelectedEvent(null);
    setModalDate(date);
    setModalOpen(true);
  };

  const handleSave = data => {
    const payload = {
      pet: data.pet,
      event_title: data.event_title,
      start_date: data.start_date,
      start_time: data.start_time,
      description: data.description,
      completed: data.completed
    };
    const req = data.id
      ? axios.put(`http://localhost:8000/calendar/${data.id}/`, payload)
      : axios.post('http://localhost:8000/calendar/', payload);

    req.then(() => {
      setModalOpen(false);
      // оновлюємо події
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth();
      return axios.get('http://localhost:8000/calendar/', {
        params: { year: y, month: m + 1 }
      });
    })
    .then(res => setEvents(res.data.payload || []))
    .catch(err => console.error('Validation errors:', err.response?.data));
  };

  const handleDelete = id => {
    axios.delete(`http://localhost:8000/calendar/${id}/`)
      .then(() => {
        setModalOpen(false);
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        return axios.get('http://localhost:8000/calendar/', {
          params: { year: y, month: m + 1 }
        });
      })
      .then(res => setEvents(res.data.payload || []))
      .catch(err => console.error('Validation errors:', err.response?.data));
  };

  return (
    <>
      <Header />

      <div className="page-container">
        <div className="calendar-header">
          <button onClick={handlePrev}>&larr;</button>
          <h2>
            {currentDate.getFullYear()} — {MONTHS_UA[currentDate.getMonth()]}
          </h2>
          <button onClick={handleNext}>&rarr;</button>
          <button className="btn-add" onClick={handleAdd}>
            {t('add-button')}
          </button>
        </div>

        <table className="calendar-table">
          <thead>
            <tr>{['пн','вт','ср','чт','пт','сб','нд']
              .map(d => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i}>
                {week.map((day, j) => {
                  const iso = day.toISOString().slice(0, 10);
                  const dayEvents = events.filter(e => e.start_date === iso);
                  const visible = dayEvents.slice(0, 2);
                  const extra = dayEvents.length - visible.length;

                  return (
                    <td
                      key={j}
                      onClick={() => handleCellClick(day)}
                      className={day.getMonth() !== currentDate.getMonth() ? 'other-month' : ''}
                    >
                      <div className="cell-date">{day.getDate()}</div>

                      {visible.map(evt => (
                        <div
                          key={evt.id}
                          className="event-item"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                            setModalDate(day);
                            setModalOpen(true);
                          }}
                        >
                          <label>
                            <input type="checkbox" checked={evt.completed} readOnly/>
                          </label>
                          <span>{evt.start_time} {evt.event_title}</span>
                        </div>
                      ))}

                      {extra > 0 && (
                        <div
                          className="more-events"
                          onClick={e => {
                            e.stopPropagation();
                            // відкриваємо модалку для перегляду/додавання
                            setSelectedEvent(null);
                            setModalDate(day);
                            setModalOpen(true);
                          }}
                        >
                          +{extra}…
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <CalendarModal
          isOpen={modalOpen}
          date={modalDate}
          eventData={selectedEvent}
          pets={pets}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
