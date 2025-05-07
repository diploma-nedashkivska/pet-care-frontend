import React from 'react';
import '../styles/CalendarStyle.css';
import { useTranslation } from 'react-i18next';

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${d}.${m}.${y}`;
}

function formatTimeHM(time) {
  return time ? time.slice(0, 5) : '';
}

export default function EventsListModal({ date, events, onClose, onEdit, onToggle }) {
  const { t } = useTranslation();
  const iso = formatDateLocal(date);
  const sorted = [...events].sort((a, b) => {
    const ta = a.start_time;
    const tb = b.start_time;
    if (ta && tb) {
      return ta.localeCompare(tb);
    }
    if (ta && !tb) {
      return -1;
    }
    if (!ta && tb) {
      return 1;
    }
    return a.event_title.localeCompare(b.event_title);
  });

  return (
    <div className="calendar modal-overlay" onClick={onClose}>
      <div className="calendar modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="calendar close-btn" onClick={onClose}>
          <img src="/icons/close.png" alt="close" />
        </button>
        <h3>
          {t('events on')} {iso}
        </h3>
        <div className="events-list">
          {sorted.map((evt) => (
            <div
              key={evt.id}
              className="event-item"
              onClick={(e) => {
                if (e.target.tagName !== 'INPUT') {
                  onEdit(evt);
                }
              }}
            >
              <label onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={!!evt.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggle(evt);
                  }}
                />
              </label>
              <span className="event-link">
                {formatTimeHM(evt.start_time)} {evt.event_title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
