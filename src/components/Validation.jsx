import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/validation.css';

// Génère un numéro de commande unique basé sur le timestamp + un nombre aléatoire
// Ex : "CMD-LX4K2A-4823"
function generateOrderNumber() {
  const timestamp  = Date.now().toString(36).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${timestamp}-${randomPart}`;
}

// Page de confirmation affichée après une réservation réussie
// Les données sont passées via le state React Router depuis FormReservation
const Validation = () => {
  const location = useLocation();
  const data = location.state || {};

  // Si un numéro de commande existe déjà (ex: retour arrière), on le conserve
  // Sinon on en génère un nouveau
  const [orderNumber, setOrderNumber] = useState(data.orderNumber || '');

  useEffect(() => {
    if (!orderNumber) setOrderNumber(generateOrderNumber());
  }, []); // [] = s'exécute une seule fois au montage, pas à chaque rendu

  // Formate la date en français si c'est un objet Date ou une chaîne ISO
  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString('fr-FR')
    : null;

  // On affiche le bloc de détails seulement si au moins une info est disponible
  const hasDetails = data.prenom || data.nom || data.total || data.date || data.time;

  return (
    <div className="validation-container">
      <h2>Votre commande a bien été enregistrée</h2>
      <p>
        Numéro de commande : <strong>{orderNumber}</strong>
      </p>

      {hasDetails && (
        <div className="validation-details">
          <p>Bonjour {data.prenom} {data.nom},</p>
          {data.total && <p>Montant total : <strong>{data.total}€</strong></p>}
          {formattedDate && <p>Date : {formattedDate}</p>}
          {data.time    && <p>Heure : {data.time}</p>}
        </div>
      )}

      <p>
        Conservez bien ce numéro pour toute correspondance.
        Un récapitulatif vous a été envoyé par e-mail si l'adresse fournie est valide.
      </p>

      <Link to="/" className="home-link">Retour à l'accueil</Link>
    </div>
  );
};

export default Validation;