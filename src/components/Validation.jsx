import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/validation.css';

// Génère un numéro de commande unique
function generateOrderNumber() {
  const timestamp  = Date.now().toString(36).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${timestamp}-${randomPart}`;
}

// Page de confirmation après réservation réussie
export default function Validation() {
  const location = useLocation();
  const data = location.state || {};
  const { t } = useTranslation();

  // Astuce React Pro : On génère le numéro directement dans le useState
  // en lui passant une fonction fléchée. 
  // Fini le useEffect complexe et les doubles rechargements !
  const [orderNumber] = useState(() => data.orderNumber || generateOrderNumber());

  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString('fr-FR')
    : null;

  const hasDetails = Boolean(data.prenom || data.nom || data.total || data.date || data.time);

  return (
    // Sémantique HTML : <main> indique que c'est le contenu principal de la page
    <main className="validation-container">
      
      {/* R234 : Sur une nouvelle page, le titre principal doit TOUJOURS être un H1 */}
      <h1>{t('validation.title')}</h1>
      
      <p>
        {t('validation.order_number')} : <strong>{orderNumber}</strong>
      </p>

      {hasDetails && (
        <div className="validation-details">
          <p>{t('validation.greeting', { prenom: data.prenom, nom: data.nom })}</p>
          
          {/* Accessibilité : Une liste d'informations doit être un <ul> ! */}
          <ul>
            {data.total && (
              <li>{t('validation.total')} : <strong>{data.total}€</strong></li>
            )}
            {formattedDate && (
              <li>{t('validation.date')} : {formattedDate}</li>
            )}
            {data.time && (
              <li>{t('validation.time')} : {data.time}</li>
            )}
          </ul>
        </div>
      )}

      <p>
        {t('validation.keep_number')}
        <br />
        {/* Il te manquait la traduction pour la phrase en dur, je l'ai rajoutée */}
        {t('validation.email_notice') || "Un récapitulatif vous a été envoyé par e-mail si l'adresse fournie est valide."}
      </p>

      {/* Le composant Link natif compile en vraie balise <a> accessible */}
      <Link to="/" className="home-link">
        {t('validation.back_home')}
      </Link>
      
    </main>
  );
}