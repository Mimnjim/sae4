import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/book_components/validation.css';

// Génère un numéro de commande unique
function generateOrderNumber() {
  const timestamp  = Date.now().toString(36).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random () * 9000);
  return `CMD-${timestamp}-${randomPart}`;
}

// Page de confirmation après réservation réussie
const Validation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const data = location.state || {};

  // Astuce React Pro : On génère le numéro directement dans le useState
  // en lui passant une fonction fléchée. 
  // Fini le useEffect complexe et les doubles rechargements !
  const [orderNumber] = useState(() => data.orderNumber || generateOrderNumber());

  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString('fr-FR')
    : null;

  const hasDetails = Boolean(data.prenom || data.nom || data.total || data.date || data.time);

  return (
    <div className="validation-container">
      <h2>{t('validation.title')}</h2>
      <p>{t('validation.orderNumber')}: <strong>{orderNumber}</strong></p>

      {hasDetails && (
        <div className="validation-details">
          <p>{t('validation.hello')} {data.prenom} {data.nom},</p>
          {data.total      && <p>{t('validation.total')}: <strong>{data.total}€</strong></p>}
          {formattedDate   && <p>{t('validation.date')}: {formattedDate}</p>}
          {data.time       && <p>{t('validation.time')}: {data.time}</p>}
        </div>
      )}

      <p>
        {t('validation.keepNumber')}
        {' '}
        {t('validation.emailSent')}
      </p>

      <Link to="/" className="home-link">{t('validation.backHome')}</Link>
    </div>
  );
};

export default Validation;
