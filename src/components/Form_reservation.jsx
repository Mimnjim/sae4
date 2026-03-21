import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonValidation from './ButtonValidation';
import Calendrier from './Calendrier';
import AuthPrompt from './AuthPrompt';
import Conditions from './Conditions';
import '../styles/form-reservation.css';

// ─── Constantes ────────────────────────────────────────────────────────────────

const PRIX_PLEIN  = 9;
const PRIX_REDUIT = 6;
const MAX_TICKETS = 10;
const VALID_PROMO_CODE    = 'HUMAIN5';
const VALID_PROMO_DISCOUNT = 0.05; // 5%

// Génère les créneaux horaires de 10h à 17h (10:00-11:00, 11:00-12:00, etc.)
// Sorti du JSX pour ne pas recalculer à chaque rendu
const TIME_SLOTS = Array.from({ length: 8 }, (_, i) => {
  const start = String(10 + i).padStart(2, '0');
  const end   = String(11 + i).padStart(2, '0');
  return `${start}:00 - ${end}:00`;
});

// ─── Fonction utilitaire : construction du body API ────────────────────────────

// Séparée de handleSubmit pour que la logique métier soit testable indépendamment
function buildReservationBody({ prenom, nom, email, langue, date, time, tickets, promoApplied, promoCode }) {
  // Formate la date en YYYY-MM-DD pour l'API
  const formattedDate = date instanceof Date
    ? date.toISOString().substring(0, 10)
    : date;

  return {
    contact_firstname: prenom,
    contact_lastname:  nom,
    contact_email:     email,
    language:          langue,
    reservation_date:  formattedDate,
    time_slot:         time,
    tickets,
    reservation_type:  'standard',
    promo_code:        promoApplied ? promoCode : null,
  };
}

// ─── Composant ────────────────────────────────────────────────────────────────

const FormReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Données éventuellement passées depuis une autre page (ex: page calendrier ou jeu)
  const reservationData = location.state;

  // --- État : informations personnelles ---
  const [prenom,        setPrenom]        = useState('');
  const [nom,           setNom]           = useState('');
  const [email,         setEmail]         = useState('');
  const [emailConfirm,  setEmailConfirm]  = useState('');
  const [langue,        setLangue]        = useState('fr');

  // --- État : date et créneau horaire ---
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // --- État : billets ---
  const [pleinTarif,  setPleinTarif]  = useState(0);
  const [tarifReduit, setTarifReduit] = useState(0);
  const [gratuit,     setGratuit]     = useState(0);

  // --- État : code promo ---
  const [promoCode,    setPromoCode]    = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError,   setPromoError]   = useState('');

  // --- Calculs dérivés (pas de useState, recalculés à chaque rendu) ---
  const totalTickets = pleinTarif + tarifReduit + gratuit;
  const subtotal     = pleinTarif * PRIX_PLEIN + tarifReduit * PRIX_REDUIT;
  const discount     = promoApplied ? subtotal * VALID_PROMO_DISCOUNT : 0;
  const finalTotal   = +(subtotal - discount).toFixed(2);

  // Le formulaire est complet si tous les champs obligatoires sont remplis
  const formIsComplete =
    Boolean(prenom && nom && email && emailConfirm && date && time) &&
    email === emailConfirm &&
    totalTickets > 0;

  // --- Pré-remplissage depuis les données de navigation ---
  useEffect(() => {
    if (!reservationData) return;

    if (reservationData.date) {
      setDate(new Date(reservationData.date));
    }
    if (reservationData.slot) {
      // Le créneau est au format "10:00 - 11:00", on extrait juste l'heure de début
      setTime(reservationData.slot.split(' - ')[0]);
    }
    // Si le jeu a transmis un code promo, on le pré-remplit
    if (reservationData.promoCode) {
      setPromoCode(reservationData.promoCode);
      if (reservationData.promoApplied) setPromoApplied(true);
    }
  }, []); // [] = s'exécute une seule fois au montage du composant

  // --- Vérification de l'authentification ---
  // On lit le JWT dans localStorage pour savoir si l'utilisateur est connecté
  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  if (!jwt) {
    return <AuthPrompt message="Connectez-vous pour réserver votre visite" />;
  }

  // --- Validation du code promo ---
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === VALID_PROMO_CODE) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Code invalide');
    }
  };

  // --- Soumission du formulaire ---
  const handleSubmit = () => {
    // Construction du tableau de billets (on n'envoie que les types > 0)
    const tickets = [
      pleinTarif  > 0 && { ticket_type: 'plein',   unit_price: PRIX_PLEIN,  quantity: pleinTarif  },
      tarifReduit > 0 && { ticket_type: 'reduit',  unit_price: PRIX_REDUIT, quantity: tarifReduit },
      gratuit     > 0 && { ticket_type: 'gratuit', unit_price: 0,           quantity: gratuit     },
    ].filter(Boolean); // .filter(Boolean) supprime les "false" du tableau

    const body    = buildReservationBody({ prenom, nom, email, langue, date, time, tickets, promoApplied, promoCode });
    const headers = {
      'Content-Type':   'application/json',
      'Authorization':  `Bearer ${jwt}`,
      'X-Authorization': `Bearer ${jwt}`,
    };

    fetch('/sae4_api/api/reservations.php', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        if (data?.success) {
          // Succès : on redirige vers la page de confirmation avec le résumé
          navigate('/confirmation', {
            state: {
              reservationId: data.reservation_id,
              summary: { tickets, total: finalTotal },
            },
          });
        } else {
          alert(data?.message || 'Erreur lors de la réservation');
        }
      })
      .catch(() => alert('Erreur réseau, veuillez réessayer.'));
  };

  // ─── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="form-reservation">

      {/* ── Colonne gauche : date, billets ── */}
      <div className="form-reservation__left">
        <div className="form-reservation__title">Sélectionner la date</div>
        <Calendrier date={date} setDate={setDate} />

        <label className="form-reservation__label" htmlFor="res-time">
          Sélectionner l'heure
        </label>
        <select
          id="res-time"
          className="form-reservation__input"
          value={time}
          onChange={e => setTime(e.target.value)}
          disabled={!date} // désactivé tant qu'aucune date n'est choisie
        >
          <option value="">Choisir...</option>
          {TIME_SLOTS.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>

        <label className="form-reservation__label" htmlFor="res-language">
          Langue de la visite
        </label>
        <select
          id="res-language"
          className="form-reservation__input"
          value={langue}
          onChange={e => setLangue(e.target.value)}
        >
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
        </select>

        {/* Sélection des billets */}
        <div className="form-reservation__label">Nombre de billets</div>
        <div className="form-reservation__tickets">
          <fieldset className="tickets-fieldset" aria-labelledby="tickets-legend">
            <legend id="tickets-legend" className="sr-only">Nombre de billets</legend>

            <TicketRow
              label="Plein tarif"
              price="9€"
              count={pleinTarif}
              onDecrement={() => setPleinTarif(Math.max(pleinTarif - 1, 0))}
              onIncrement={() => { if (totalTickets < MAX_TICKETS) setPleinTarif(pleinTarif + 1); }}
              canIncrement={totalTickets < MAX_TICKETS}
            />
            <TicketRow
              label="Tarif réduit"
              price="6€"
              count={tarifReduit}
              onDecrement={() => setTarifReduit(Math.max(tarifReduit - 1, 0))}
              onIncrement={() => { if (totalTickets < MAX_TICKETS) setTarifReduit(tarifReduit + 1); }}
              canIncrement={totalTickets < MAX_TICKETS}
            />
            <TicketRow
              label="Gratuit"
              price="Gratuit"
              count={gratuit}
              onDecrement={() => setGratuit(Math.max(gratuit - 1, 0))}
              onIncrement={() => { if (totalTickets < MAX_TICKETS) setGratuit(gratuit + 1); }}
              canIncrement={totalTickets < MAX_TICKETS}
            />
          </fieldset>
        </div>

        <div className="form-reservation__conditions">
          <Conditions />
        </div>
      </div>

      {/* ── Colonne droite : coordonnées, résumé ── */}
      <div className="form-reservation__right">
        <div className="form-reservation__title">Coordonnées</div>

        <label className="form-reservation__label" htmlFor="res-prenom">Prénom</label>
        <input
          id="res-prenom"
          className="form-reservation__input"
          type="text"
          placeholder="prénom"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
        />

        <label className="form-reservation__label" htmlFor="res-nom">Nom</label>
        <input
          id="res-nom"
          className="form-reservation__input"
          type="text"
          placeholder="nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />

        <label className="form-reservation__label" htmlFor="res-email">E-mail</label>
        <input
          id="res-email"
          className="form-reservation__input"
          type="email"
          placeholder="e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="form-reservation__label" htmlFor="res-email-confirm">
          Confirmez votre e-mail
        </label>
        <input
          id="res-email-confirm"
          className="form-reservation__input"
          type="email"
          placeholder="confirmez votre e-mail"
          value={emailConfirm}
          onChange={e => setEmailConfirm(e.target.value)}
          // aria-invalid signale aux lecteurs d'écran que le champ est en erreur
          aria-invalid={email && emailConfirm && email !== emailConfirm ? true : undefined}
          aria-describedby={email !== emailConfirm ? 'email-error' : undefined}
        />
        {email && emailConfirm && email !== emailConfirm && (
          // role="alert" : le lecteur d'écran lit ce message automatiquement dès qu'il apparaît
          <div id="email-error" className="form-error" role="alert">
            Les adresses e-mail ne correspondent pas.
          </div>
        )}

        {/* Code promo */}
        <div className="promo-section">
          <label className="promo-label" htmlFor="res-promo">Code promo</label>
          <div className="promo-row">
            <input
              id="res-promo"
              className="form-reservation__input"
              type="text"
              placeholder="Entrez le code promo"
              value={promoCode}
              onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
              disabled={promoApplied}
            />
            <button
              type="button"
              className="form-reservation__btn"
              aria-label="Appliquer le code promotionnel"
              aria-describedby="promo-message"
              onClick={handleApplyPromo}
              disabled={promoApplied || !promoCode.trim()}
            >
              Appliquer
            </button>
          </div>
          {promoError && (
            <div id="promo-message" className="promo-message error" role="status">
              {promoError}
            </div>
          )}
          {promoApplied && (
            <div id="promo-message" className="promo-message success" role="status">
              Réduction de 5% appliquée
            </div>
          )}
        </div>

        {/* Récapitulatif */}
        <div className="form-reservation__summary">
          <div>Récapitulatif :</div>
          <div>Plein tarif : {pleinTarif} × {PRIX_PLEIN}€</div>
          <div>Tarif réduit : {tarifReduit} × {PRIX_REDUIT}€</div>
          <div>Gratuit : {gratuit}</div>
          {promoApplied && (
            <div className="summary-discount">
              Réduction ({VALID_PROMO_CODE}) : -{discount.toFixed(2)}€
            </div>
          )}
          <div className="summary-final">Total : {finalTotal.toFixed(2)}€</div>
          <div className="summary-divider" aria-hidden="true" />
          {totalTickets >= MAX_TICKETS && (
            <div className="summary-max">
              Nombre maximum de places atteint ({MAX_TICKETS})
            </div>
          )}
          {totalTickets > 0 && totalTickets < MAX_TICKETS && (
            <div className="summary-remaining">
              {MAX_TICKETS - totalTickets} place(s) restante(s)
            </div>
          )}
        </div>

        <ButtonValidation
          text="Confirmer ma réservation"
          onClick={handleSubmit}
          disabled={!formIsComplete}
        />
      </div>
    </div>
  );
};

// ─── Composant interne : ligne de billet ──────────────────────────────────────

// Sorti en composant séparé car la même structure se répète 3 fois
// Props :
//   label       → nom du type de billet ("Plein tarif", etc.)
//   price       → prix affiché ("9€", "Gratuit", etc.)
//   count       → quantité actuelle
//   onDecrement → appelé quand on clique sur "-"
//   onIncrement → appelé quand on clique sur "+"
//   canIncrement → false si on a atteint MAX_TICKETS
const TicketRow = ({ label, price, count, onDecrement, onIncrement, canIncrement }) => (
  <div className="form-reservation__ticket-row" role="group" aria-label={label}>
    <div className="ticket-label">{label}</div>
    <div className="ticket-price">{price}</div>
    <button
      type="button"
      className="form-reservation__btn"
      aria-label={`Retirer un billet ${label}`}
      onClick={onDecrement}
      disabled={count === 0}
    >
      -
    </button>
    {/* aria-live="polite" : le lecteur d'écran annonce le changement de quantité */}
    <div className="ticket-count" aria-live="polite" aria-atomic="true">
      {count}
    </div>
    <button
      type="button"
      className="form-reservation__btn"
      aria-label={`Ajouter un billet ${label}`}
      onClick={onIncrement}
      disabled={!canIncrement}
    >
      +
    </button>
  </div>
);

export default FormReservation;