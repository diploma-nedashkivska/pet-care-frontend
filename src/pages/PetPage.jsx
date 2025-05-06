import '../styles/PetStyle.css';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetModal from '../components/PetModal';
import { useAuth } from '../components/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function PetPage() {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [confirm, setConfirm] = useState({ isOpen: false, petId: null });

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

  function handleDelete(id) {
    if (!window.confirm('Видалити тварину?')) return;
    axios.delete(`http://localhost:8000/pets/${id}/`).then(fetchPets).catch(console.error);
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
          <div className="title-with-icon">
            <img src="/icons/page-1-pets.png" alt="page-1-pets" className="icon-h1" />
            <span>Профілі тварин</span>
          </div>
          <button onClick={handleAdd} className="btn-add">
            Додати
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
              <p>Стать: {p.sex === 'MALE' ? 'Чоловіча' : 'Жіноча'}</p>
              <p>Дата народження: {p.birthday}</p>
              <div className="pet-card-actions">
                <button onClick={() => handleEdit(p)}>Редагувати</button>
                <button onClick={() => handleDeleteRequest(p.id)}>Видалити</button>
              </div>
            </div>
          ))}
        </div>

        <ConfirmModal
          isOpen={confirm.isOpen}
          message="Дійсно хочете видалити профіль тварини?"
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
