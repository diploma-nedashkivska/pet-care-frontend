import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useAuth } from '../components/AuthContext';
import Header from '../components/Header';
import JournalModal from '../components/JournalModal';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/JournalStyle.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function JournalPage() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [pets, setPets] = useState([]);
  const [entries, setEntries] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterPet, setFilterPet] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const TYPE_CHOICES = [
    { value: '', label: t('all') },
    { value: 'CHECKUP', label: t('checkup') },
    { value: 'VACCINATION', label: t('vaccination') },
    { value: 'FLEA_CTRL', label: t('flea_ctrl') },
    { value: 'GROOMING', label: t('grooming') },
    { value: 'BATH', label: t('bath') },
    { value: 'TRAINING', label: t('training') },
    { value: 'OTHER', label: t('other') },
  ];
  const fetchEntries = useCallback(() => {
    api
      .get('/journal/')
      .then((res) => setEntries(res.data.payload || []))
      .catch((err) => {
        console.error(err);
        toast.error(t('journal-fetch-error'));
      });
  }, [t]);

  useEffect(() => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api
      .get('/pets/')
      .then((res) => setPets(res.data.payload || []))
      .catch((err) => {
        console.error(err);
        toast.error(t('pets-fetch-error'));
      });
    fetchEntries();
  }, [token, fetchEntries, t]);

  const handleAdd = () => {
    setSelectedEntry(null);
    setModalOpen(true);
  };

  const handleSave = (form) => {
    const payload = {
      pet: form.pet,
      entry_type: form.entry_type,
      entry_title: form.entry_title,
      description: form.description,
    };
    const req = form.id ? api.put(`/journal/${form.id}/`, payload) : api.post(`/journal/`, payload);

    req
      .then(() => {
        toast.success(form.id ? t('journal-update-success') : t('journal-add-success'));
        setModalOpen(false);
        fetchEntries();
      })
      .catch((err) => {
        console.error(err.response?.data);
        toast.error(t('journal-save-error'));
      });
  };

  const openConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    api
      .delete(`/journal/${deleteId}/`)
      .then(() => {
        toast.success(t('journal-delete-success'));
        fetchEntries();
      })
      .catch((err) => {
        console.error(err.response?.data);
        toast.error(t('journal-delete-error'));
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
        setModalOpen(false);
      });
  };

  const filtered = entries
    .filter((e) => !filterType || e.entry_type === filterType)
    .filter((e) => !filterPet || e.pet === parseInt(filterPet))
    .sort((a, b) => a.id - b.id);

  return (
    <>
      <Header />
      <div className="journal page-container">
        <div className="journal title-with-icon">
          <img src="/icons/page-3-journal.png" alt="journal" className="calendar icon-h1" />
          <span>{t('journal')}</span>
        </div>
        <hr />
        <div className="journal-header journal-header--with-filter">
          <div className="journal-header-filters">
            <label className="journal-filter-label">
              {t('type')}:&nbsp;
              <select
                className="journal-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {TYPE_CHOICES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="journal-filter-label">
              {t('pet')}:&nbsp;
              <select
                className="journal-filter"
                value={filterPet}
                onChange={(e) => setFilterPet(e.target.value)}
              >
                <option value="">{t('all')}</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.pet_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button className="btn-add" onClick={handleAdd}>
            {t('add-button')}
          </button>
        </div>
        <table className="journal-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>{t('pet')}</th>
              <th>{t('title')}</th>
              <th>{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                onClick={() => {
                  setSelectedEntry(e);
                  setModalOpen(true);
                }}
              >
                <td>{e.id}</td>
                <td>{pets.find((p) => p.id === e.pet)?.pet_name || '—'}</td>
                <td>{e.entry_title}</td>
                <td>{new Date(e.created_at).toLocaleDateString('uk-UA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <JournalModal
          isOpen={modalOpen}
          entryData={selectedEntry}
          pets={pets}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={openConfirm}
        />
        <ConfirmModal
          isOpen={confirmOpen}
          message={t('confirm-delete-entry')}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </>
  );
}
