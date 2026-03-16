//Page de confirmation finale de réservation
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/validation.css';

const Validation = () => {
  const location = useLocation();
  const data = location.state || {};
  const [orderNumber, setOrderNumber] = useState(data.orderNumber || '');

  useEffect(() => {
    if (!orderNumber) {
      const gen = () => {
        const t = Date.now().toString(36).toUpperCase();
        const r = Math.floor(1000 + Math.random() * 9000);
        return `CMD-${t}-${r}`;
      };
      setOrderNumber(gen());
    }
  }, []);

  return (
    <div className="validation-container">
      <h2>Votre commande a bien été enregistrée</h2>
      <p>
        Numéro de commande : <strong>{orderNumber}</strong>
      </p>

      { (data.prenom || data.nom || data.total || data.date || data.time) && (
        <div className="validation-details">
          <p>Bonjour {data.prenom || ''} {data.nom || ''},</p>
          {data.total && <p>Montant total : <strong>{data.total}€</strong></p>}
          {data.date && <p>Date : {typeof data.date === 'string' ? data.date : new Date(data.date).toLocaleDateString()}</p>}
          {data.time && <p>Heure : {data.time}</p>}
        </div>
      )}

      <p>Conservez bien ce numéro pour toute correspondance. Un récapitulatif vous a été envoyé par e-mail si l'adresse fournie est valide.</p>
      <Link to="/" className="home-link">Retour à l'accueil</Link>
    </div>
  );
};

export default Validation;
