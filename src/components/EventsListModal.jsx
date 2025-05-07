import React from 'react';
import '../styles/CalendarStyle.css';

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTimeHM(time) {
  return time ? time.slice(0, 5) : '';
}

export default function EventsListModal({ date, events, onClose, onEdit, onToggle }) {
  const iso = formatDateLocal(date);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>Події на {iso}</h3>
        <div className="events-list">
          {events.map((evt) => (
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
