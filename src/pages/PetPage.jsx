import '../styles/PetStyle.css';
import Header from '../components/Header';
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import PetModal from '../components/PetModal';
import { useAuth } from '../components/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function PetPage() {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [confirm, setConfirm] = useState({ isOpen: false, petId: null });
  const { t } = useTranslation();
  const handleError = (e) => {
    e.target.src = '/icons/pet-default.png';
  };

  const fetchPets = useCallback(() => {
    api
      .get('/pets/')
      .then((res) => setPets(res.data.payload))
      .catch((err) => {
        console.error(err);
        toast.error(t('pets-fetch-error'));
      });
  }, [t]);

  useEffect(() => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    fetchPets();
  }, [token, fetchPets]);

  function handleAdd() {
    setEditingPet(null);
    setModalOpen(true);
  }

  function handleEdit(pet) {
    setEditingPet(pet);
    setModalOpen(true);
  }

  function handleSave(formData) {
    const request = editingPet
      ? api.put(`/pets/${editingPet.id}/`, formData)
      : api.post('/pets/', formData);

    request
      .then(() => {
        setModalOpen(false);
        const msg = editingPet ? t('pet-update-success') : t('pet-add-success');
        toast.success(msg);
        fetchPets();
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('pet-save-error'));
      });
  }

  function handleDeleteRequest(id) {
    setConfirm({ isOpen: true, petId: id });
  }

  function handleConfirmDelete() {
    api
      .delete(`/pets/${confirm.petId}/`)
      .then(() => {
        setConfirm({ isOpen: false, petId: null });
        toast.success(t('pet-delete-success'));
        fetchPets();
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('pet-delete-error'));
      });
  }

  function handleCancelDelete() {
    setConfirm({ isOpen: false, petId: null });
  }

  return (
    <>
      <Header />
      <div className="pets page-container">
        <div className="pets-header">
          <div className="pets title-with-icon">
            <img src="/icons/page-1-pets.png" alt="page-1-pets" className="pets icon-h1" />
            <span>{t('pets-page')}</span>
          </div>
          <button onClick={handleAdd} className="btn-add">
            {t('add-button')}
          </button>
        </div>
        <hr />
        <div className="pet-grid">
          {pets.map((p) => (
            <div key={p.id} className="pet-card">
              <img
                src={p.photo_url || '/icons/pet-default.png'}
                alt={p.pet_name}
                onError={handleError}
              />
              <h3 className="pet-name-breed">{p.pet_name}</h3>
              <p className="pet-name-breed">
                <i>{p.breed}</i>
              </p>
              <p>
                {t('gender')}: {p.sex === 'MALE' ? t('male') : t('female')}
              </p>
              <p>
                {t('birthday')}: {p.birthday}
              </p>
              <div className="pet-card-actions">
                <button onClick={() => handleEdit(p)}>{t('edit-button')}</button>
                <button onClick={() => handleDeleteRequest(p.id)}>{t('delete-button')}</button>
              </div>
            </div>
          ))}
        </div>

        <ConfirmModal
          isOpen={confirm.isOpen}
          message={t('pet-confirm-question')}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        <PetModal
          isOpen={modalOpen}
          initialData={editingPet}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      </div>
    </>
  );
}
