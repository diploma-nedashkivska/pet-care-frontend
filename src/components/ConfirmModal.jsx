import React from 'react';
import '../styles/ConfirmModal.css';

export default function ConfirmModal({ isOpen, message = 'Ви впевнені?', onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="cm confirm-overlay">
      <div className="cm confirm-window">
        <p className="cm confirm-message">{message}</p>
        <div className="cm confirm-buttons">
          <button className="cm btn btn-cancel" onClick={onCancel}>
            Скасувати
          </button>
          <button className="cm btn btn-confirm" onClick={onConfirm}>
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
}
