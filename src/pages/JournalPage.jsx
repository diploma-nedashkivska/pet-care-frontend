import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import Header from '../components/Header';
import JournalModal from '../components/JournalModal';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/JournalStyle.css';
import { useTranslation } from 'react-i18next';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('uk-UA');
}

export default function JournalPage() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [pets, setPets] = useState([]);
  const [entries, setEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    axios
      .get('http://localhost:8000/pets/')
      .then((res) => setPets(res.data.payload || []))
      .catch(console.error);
    fetchEntries();
  }, [token]);

  const fetchEntries = () => {
    axios
      .get('http://localhost:8000/journal/')
      .then((res) => setEntries(res.data.payload || []))
      .catch(console.error);
  };

  const handleAdd = () => {
    setSelectedEntry(null);
    setModalOpen(true);
  };

  const handleSave = (form) => {
    const payload = {
      pet: form.pet,
      entry_title: form.entry_title,
      description: form.description,
    };
    const req = form.id
      ? axios.put(`http://localhost:8000/journal/${form.id}/`, payload)
      : axios.post('http://localhost:8000/journal/', payload);

    req
      .then(() => {
        setModalOpen(false);
        fetchEntries();
      })
      .catch((err) => console.error(err.response?.data));
  };

  const openConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:8000/journal/${deleteId}/`)
      .then(() => fetchEntries())
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
        setModalOpen(false);
      });
  };

  return (
    <>
      <Header />
      <div className="journal page-container">
        <div className="journal title-with-icon">
          <img src="/icons/page-3-journal.png" alt="journal" className="calendar icon-h1" />
          <span>Журнал</span>
        </div>
        <hr />
        <div className="journal-header">
          <button className="btn-add" onClick={handleAdd}>
            {t('add-button')}
          </button>
        </div>
        <table className="journal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('pet')}</th>
              <th>{t('title')}</th>
              <th>{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
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
                <td>{formatDate(e.created_at)}</td>
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
