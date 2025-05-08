import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import '../styles/PartnersStyle.css';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

const PARTNER_TYPE = [
  { value: '', label: 'Усі' },
  { value: 'CLINIC', label: 'Ветеринарні клініки' },
  { value: 'GROOMING_SALON', label: 'Грумінг-салони' },
  { value: 'PET_STORE', label: 'Зоомагазини' },
];

export default function PartnersPage() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const handleError = (e) => {
    e.target.src = '/icons/pet-default.png';
  };
  const getRatingClass = (rating) => {
    if (rating >= 7) return 'rating-good';
    if (rating >= 4 && rating < 7) return 'rating-ok';
    return 'rating-bad';
  };
  useEffect(() => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    axios
      .get('http://localhost:8000/partners/')
      .then((res) => setPartners(res.data))
      .catch(console.error);
  }, [token]);

  const filtered = partners
    .filter((p) => !filterType || p.partner_type === filterType)
    .filter((p) => p.site_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Header />
      <div className="partners-container">
        <div className="partners title-with-icon">
          <img
            src="/icons/page-5-partner.png"
            alt="partner"
            className="partners icon-h1"
            onError={handleError}
          />
          <span>Сайти-партнери</span>
        </div>
        <hr />
        <div className="partners-header">
          <select
            className="partners-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {PARTNER_TYPE.map((opt) => (
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
                src={p.photo_url || '/icons/pet-default.png'}
                alt={p.site_name}
                className="partner-photo"
                onError={handleError}
              />
              <div className="partner-info">
                <h3>{p.site_name}</h3>
                <div className="partner-card-meta">
                  <span className="partner-card-type">
                    {PARTNER_TYPE.find((o) => o.value === p.partner_type)?.label}
                  </span>
                  <span className={`partner-card-rating ${getRatingClass(p.rating)}`}>
                    <span className="star">★</span>
                    <span className="rating-value">{p.rating}</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
