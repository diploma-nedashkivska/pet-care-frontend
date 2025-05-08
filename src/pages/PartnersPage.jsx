import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import '../styles/PartnersStyle.css';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

const TYPE_OPTIONS = [
  { value: '', label: 'Усі' },
  { value: 'CLINIC', label: 'Ветеринарні клініки' },
  { value: 'GROOMING', label: 'Грумінг-салони' },
  { value: 'PET_STORE', label: 'Зоомагазини' },
];

export default function PartnersPage() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    axios
      .get('http://localhost:8000/partners/')
      .then((res) => setPartners(res.data))
      .catch(console.error);
  }, [token]);

  const filtered = partners
    .filter((p) => !filterType || p.partner_type === filterType)
    .filter(
      (p) =>
        p.site_name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <>
      <Header />
      <div className="partners-container">
        <div className="partners-header">
          <select
            className="partners-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            className="partners-search"
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="partners-grid">
          {filtered.map((p) => (
            <a
              key={p.id}
              href={p.site_url}
              className="partner-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={p.photo_url || '/icons/default-partner.png'}
                alt={p.site_name}
                className="partner-photo"
              />
              <div className="partner-info">
                <h3>{p.site_name}</h3>
                <p>{TYPE_OPTIONS.find((o) => o.value === p.partner_type)?.label}</p>
                <p>⭐ {p.rating}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
