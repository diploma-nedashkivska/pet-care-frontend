import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import CalendarModal from '../components/CalendarModal';
import { useTranslation } from 'react-i18next';
import '../styles/CalendarStyle.css';
import Header from '../components/Header';
import EventsListModal from '../components/EventsListModal';
import ConfirmModal from '../components/ConfirmModal';

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTimeHM(time) {
  return time ? time.slice(0, 5) : '';
}

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [pets, setPets] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeks, setWeeks] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalDate, setModalDate] = useState(new Date());
  const [listModalOpen, setListModalOpen] = useState(false);
  const [listEvents, setListEvents] = useState([]);
  const [listDate, setListDate] = useState(null);
  const MONTHS = [
    t('january'),
    t('february'),
    t('march'),
    t('april'),
    t('may'),
    t('june'),
    t('july'),
    t('august'),
    t('september'),
    t('october'),
    t('november'),
    t('december'),
  ];
  const handleToggle = (evt) => {
    axios
      .patch(
        `http://localhost:8000/calendar/${evt.id}/`,
        { completed: !evt.completed },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        setEvents((ev) =>
          ev.map((e) => (e.id === evt.id ? { ...e, completed: !evt.completed } : e)),
        );
        setListEvents((le) =>
          le.map((e) => (e.id === evt.id ? { ...e, completed: !evt.completed } : e)),
        );
        if (!evt.completed) {
          axios
            .post(
              'http://localhost:8000/journal/',
              {
                pet: evt.pet,
                entry_type: evt.event_type,
                entry_title: evt.event_title,
                description: evt.description || '',
              },
              { headers: { Authorization: `Bearer ${token}` } },
            )
            .catch(console.error);
        }
      })
      .catch((err) => {
        console.error('Toggle error:', err.response?.status, err.response?.data);
      });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios
        .get('http://localhost:8000/pets/')
        .then((res) => setPets(res.data.payload || []))
        .catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setWeeks(buildCalendar(year, month));

    axios
      .get('http://localhost:8000/calendar/', {
        params: { year, month: month + 1 },
      })
      .then((res) => setEvents(res.data.payload || []))
      .catch(console.error);
  }, [currentDate]);

  const handlePrev = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const handleNext = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleCellClick = (date) => {
    setSelectedEvent(null);
    setModalDate(date);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedEvent(null);
    setModalDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), new Date().getDate()));
    setModalOpen(true);
  };

  const handleSave = (data) => {
    const payload = {
      pet: data.pet,
      event_type: data.event_type,
      event_title: data.event_title,
      start_date: data.start_date,
      ...(data.start_time ? { start_time: data.start_time } : {}),
      description: data.description,
      completed: data.completed,
    };
    const req = data.id
      ? axios.put(`http://localhost:8000/calendar/${data.id}/`, payload)
      : axios.post('http://localhost:8000/calendar/', payload);

    req
      .then(() => {
        setModalOpen(false);
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        return axios.get('http://localhost:8000/calendar/', {
          params: { year: y, month: m + 1 },
        });
      })
      .then((res) => setEvents(res.data.payload || []))
      .catch((err) => console.error('Validation errors:', err.response?.data));
  };

  const openConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const refreshEvents = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return axios
      .get('http://localhost:8000/calendar/', { params: { year: y, month: m + 1 } })
      .then((res) => setEvents(res.data.payload || []))
      .catch(console.error);
  };

  const handleConfirmDelete = () => {
    if (deleteId != null) {
      axios
        .delete(`http://localhost:8000/calendar/${deleteId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => refreshEvents())
        .catch(console.error)
        .finally(() => {
          setConfirmOpen(false);
          setDeleteId(null);
          setModalOpen(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      <Header />

      <div className="calendar page-container">
        <div className="calendar title-with-icon">
          <img
            src="/icons/page-2-calendar.png"
            alt="page-2-calendar"
            className="calendar icon-h1"
          />
          <span>Календар</span>
        </div>
        <hr />
        <div className="calendar-header">
          <div className="month-nav">
            <button className="nav-btn" onClick={handlePrev}>
              &larr;
            </button>
            <span className="month-label">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button className="nav-btn" onClick={handleNext}>
              &rarr;
            </button>
          </div>
          <button className="btn-add" onClick={handleAdd}>
            {t('add-button')}
          </button>
        </div>
        <table className="calendar-table">
          <thead>
            <tr>
              {[
                t('monday'),
                t('tuesday'),
                t('wednesday'),
                t('thursday'),
                t('friday'),
                t('saturday'),
                t('sunday'),
              ].map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i}>
                {week.map((day, j) => {
                  const iso = formatDateLocal(day);
                  const dayEvents = events.filter((e) => e.start_date === iso);
                  const sortedEvents = [...dayEvents].sort((a, b) => {
                    const ta = a.start_time,
                      tb = b.start_time;
                    if (ta && tb) return ta.localeCompare(tb);
                    if (ta && !tb) return -1;
                    if (!ta && tb) return 1;
                    return a.event_title.localeCompare(b.event_title);
                  });
                  const visible = sortedEvents.slice(0, 2);
                  const extra = sortedEvents.length - visible.length;

                  return (
                    <td
                      key={j}
                      onClick={() => handleCellClick(day)}
                      className={day.getMonth() !== currentDate.getMonth() ? 'other-month' : ''}
                    >
                      <div className="cell-date">{day.getDate()}</div>

                      {visible.map((evt) => (
                        <div
                          key={evt.id}
                          className="event-item"
                          onClick={(e) => {
                            if (e.target.tagName !== 'INPUT') {
                              e.stopPropagation();
                              setSelectedEvent(evt);
                              setModalDate(day);
                              setModalOpen(true);
                            }
                          }}
                        >
                          <label onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={!!evt.completed}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggle(evt);
                              }}
                            />
                          </label>
                          <span>
                            {formatTimeHM(evt.start_time)} {evt.event_title}
                          </span>
                        </div>
                      ))}

                      {extra > 0 && (
                        <div
                          className="more-events"
                          onClick={(e) => {
                            e.stopPropagation();
                            setListEvents(dayEvents);
                            setListDate(day);
                            setListModalOpen(true);
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
          onDelete={openConfirm}
        />
        {listModalOpen && (
          <EventsListModal
            date={listDate}
            events={listEvents}
            onClose={() => setListModalOpen(false)}
            onEdit={(evt) => {
              setSelectedEvent(evt);
              setModalDate(listDate);
              setListModalOpen(false);
              setModalOpen(true);
            }}
            onToggle={handleToggle}
          />
        )}
        <ConfirmModal
          isOpen={confirmOpen}
          message={t('confirm-delete-event')}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </>
  );
}
