import React from 'react';
import '../styles/ConfirmModal.css';
import { useTranslation } from 'react-i18next';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  const { t } = useTranslation();

  if (!isOpen) return null;
  return (
    <div className="cm confirm-overlay">
      <div className="cm confirm-window">
        <p className="cm confirm-message">{message}</p>
        <div className="cm confirm-buttons">
          <button className="cm btn btn-cancel" onClick={onCancel}>
            {t('cancel-button')}
          </button>
          <button className="cm btn btn-confirm" onClick={onConfirm}>
            {t('delete-button')}
          </button>
        </div>
      </div>
    </div>
  );
}
