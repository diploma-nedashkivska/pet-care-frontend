import '../styles/PetStyle.css';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetModal from '../components/PetModal';
import { useAuth } from '../components/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import { useTranslation } from 'react-i18next';

export default function PetPage() {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [confirm, setConfirm] = useState({ isOpen: false, petId: null });
  const { t } = useTranslation();

  useEffect(() => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    fetchPets();
  }, [token]);

  function fetchPets() {
    axios
      .get('http://localhost:8000/pets/')
      .then((res) => setPets(res.data.payload))
      .catch(console.error);
  }

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
      ? axios.put(`http://localhost:8000/pets/${editingPet.id}/`, formData)
      : axios.post('http://localhost:8000/pets/', formData);

    request
      .then(() => {
        setModalOpen(false);
        fetchPets();
      })
      .catch((err) => {
        console.error(err);
        alert('Помилка збереження');
      });
  }

  function handleDeleteRequest(id) {
    setConfirm({ isOpen: true, petId: id });
  }

  function handleConfirmDelete() {
    axios
      .delete(`http://localhost:8000/pets/${confirm.petId}/`)
      .then(() => {
        setConfirm({ isOpen: false, petId: null });
        fetchPets();
      })
      .catch(console.error);
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
              <img src={p.photo_url || '/icons/pet-default.png'} alt={p.pet_name} />
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
