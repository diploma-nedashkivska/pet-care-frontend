import React from 'react';
import '../styles/CalendarStyle.css';

export default function EventsListModal({ date, events, onClose, onEdit }) {
  const iso = date.toISOString().slice(0,10);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Події на {iso}</h3>
        <div className="events-list">
          {events.map(evt => (
            <div
              key={evt.id}
              className="event-item"
              onClick={() => onEdit(evt)}
            >
              <label>
                <input
                  type="checkbox"
                  checked={evt.completed}
                  readOnly
                />
              </label>
              <span className="event-link">
                {evt.start_time} {evt.event_title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
