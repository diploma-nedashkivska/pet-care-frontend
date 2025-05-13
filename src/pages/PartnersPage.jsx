import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import '../styles/PartnersStyle.css';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { toast } from 'react-toastify';

export default function PartnersPage() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [ratingCategory, setRatingCategory] = useState('');

  const PARTNER_TYPE = [
    { value: '', label: t('all') },
    { value: 'CLINIC', label: t('veterinary-clinics') },
    { value: 'GROOMING_SALON', label: t('grooming-salons') },
    { value: 'PET_STORE', label: t('pet-stores') },
  ];

  const RATING_OPTIONS = [
    { value: '', label: t('all') },
    { value: 'rating-good', label: t('good') },
    { value: 'rating-ok', label: t('ok') },
    { value: 'rating-bad', label: t('bad') },
  ];

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
      .catch((err) => {
        console.error(err);
        toast.error(t('partners-fetch-error'));
      });
    axios
      .get('http://localhost:8000/partners/watchlist/')
      .then((r) => setWatchlist(r.data.payload))
      .catch((err) => {
        console.error(err);
        toast.error(t('watchlist-fetch-error'));
      });
  }, [token, t]);

  const filtered = partners
    .filter((p) => !filterType || p.partner_type === filterType)
    .filter((p) => p.site_name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (!ratingCategory) return true;
      return getRatingClass(p.rating) === ratingCategory;
    })
    .filter((p) => !showWatchlist || watchlist.includes(p.id));

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
          <span>{t('partners-page')}</span>
        </div>
        <hr />
        <div className="partners-header">
          {!showWatchlist && (
            <div className="partners-header-filters">
              <label className="partners-filter-label">
                {t('type')}:&nbsp;
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
              </label>
              <label className="partners-filter-label">
                {t('rating')}:&nbsp;
                <select
                  className="partners-filter"
                  value={ratingCategory}
                  onChange={(e) => setRatingCategory(e.target.value)}
                >
                  {RATING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="search-group">
            <input
              className="partners-search"
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className={`watchlist-filter-btn ${showWatchlist ? 'active' : ''}`}
              onClick={() => setShowWatchlist((f) => !f)}
            >
              {showWatchlist ? t('all-partners') : t('watchlist')}
            </button>
          </div>
        </div>

        <div className="partners-grid">
          {filtered.map((p) => (
            <div key={p.id} className="partner-card-wrapper">
              <a
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
              <button
                className="watch-toggle-btn"
                onClick={() => {
                  const url = `http://localhost:8000/partners/watchlist/${p.id}/`;
                  if (watchlist.includes(p.id)) {
                    axios
                      .delete(url)
                      .then(() => setWatchlist((wl) => wl.filter((i) => i !== p.id)));
                  } else {
                    axios.post(url).then(() => setWatchlist((wl) => [...wl, p.id]));
                  }
                }}
              >
                {watchlist.includes(p.id) ? (
                  <img src="/icons/page-4-like-after.png" className="img-like" alt="after" />
                ) : (
                  <img src="/icons/page-4-like-before.png" className="img-like" alt="before" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
