import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonValidation from './ButtonValidation';
import Calendrier from './Calendrier';
import AuthPrompt from './AuthPrompt';
import Conditions from './Conditions';
import '../styles/form-reservation.css';

const PRIX_PLEIN  = 9;
const PRIX_REDUIT = 6;
const MAX_TICKETS = 10;
const VALID_PROMO_CODE     = 'HUMAIN5';
const VALID_PROMO_DISCOUNT = 0.05;

const TIME_SLOTS = Array.from({ length: 8 }, (_, i) => {
  const start = String(10 + i).padStart(2, '0');
  const end   = String(11 + i).padStart(2, '0');
  return `${start}:00 - ${end}:00`;
});

function buildReservationBody({ prenom, nom, email, langue, date, time, tickets, promoApplied, promoCode }) {
  const formattedDate = date instanceof Date ? date.toISOString().substring(0, 10) : date;
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

const FormReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationData = location.state;

  const [prenom,       setPrenom]       = useState('');
  const [nom,          setNom]          = useState('');
  const [email,        setEmail]        = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [langue,       setLangue]       = useState('fr');
  const [date,         setDate]         = useState('');
  const [time,         setTime]         = useState('');
  const [pleinTarif,   setPleinTarif]   = useState(0);
  const [tarifReduit,  setTarifReduit]  = useState(0);
  const [gratuit,      setGratuit]      = useState(0);
  const [promoCode,    setPromoCode]    = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError,   setPromoError]   = useState('');
  const [submitError,  setSubmitError]  = useState(''); // R85 : erreur dans le DOM
  const [step] = useState(1); // on garde step=1 ici; la suite est une autre page

  const totalTickets = pleinTarif + tarifReduit + gratuit;
  const subtotal     = pleinTarif * PRIX_PLEIN + tarifReduit * PRIX_REDUIT;
  const discount     = promoApplied ? subtotal * VALID_PROMO_DISCOUNT : 0;
  const finalTotal   = +(subtotal - discount).toFixed(2);

  const formIsComplete =
    Boolean(prenom && nom && email && emailConfirm && date && time) &&
    email === emailConfirm &&
    totalTickets > 0;

  const step1IsComplete = Boolean(date && time && totalTickets > 0);
  useEffect(() => {
    if (!reservationData) return;
    if (reservationData.date) setDate(new Date(reservationData.date));
    if (reservationData.slot) setTime(reservationData.slot.split(' - ')[0]);
    if (reservationData.promoCode) {
      setPromoCode(reservationData.promoCode);
      if (reservationData.promoApplied) setPromoApplied(true);
    }
  }, []);

  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  if (!jwt) return <AuthPrompt message="Connectez-vous pour réserver votre visite" />;

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

  const handleSubmit = () => {
    setSubmitError('');
    const tickets = [
      pleinTarif  > 0 && { ticket_type: 'plein',   unit_price: PRIX_PLEIN,  quantity: pleinTarif  },
      tarifReduit > 0 && { ticket_type: 'reduit',  unit_price: PRIX_REDUIT, quantity: tarifReduit },
      gratuit     > 0 && { ticket_type: 'gratuit', unit_price: 0,           quantity: gratuit     },
    ].filter(Boolean);

    const body    = buildReservationBody({ prenom, nom, email, langue, date, time, tickets, promoApplied, promoCode });
    const headers = {
      'Content-Type':    'application/json',
      'Authorization':   `Bearer ${jwt}`,
      'X-Authorization': `Bearer ${jwt}`,
    };

    fetch('https://apimusee.tomdelavigne.fr/api/reservations.php', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success) {
          navigate('/confirmation', {
            state: { reservationId: data.reservation_id, summary: { tickets, total: finalTotal } },
          });
        } else {
          // R85 : message d'échec dans le DOM
          setSubmitError(data?.message || 'Erreur lors de la réservation.');
        }
      })
      .catch(() => setSubmitError('Erreur réseau, veuillez réessayer.'));
  };

  const goNext = () => {
    if (!step1IsComplete) return;
    navigate('/form-reservation/coordonnees', {
      state: {
        date: date instanceof Date ? date.toISOString() : date,
        time,
        langue,
        pleinTarif,
        tarifReduit,
        gratuit,
        promoCode,
        promoApplied,
      }
    });
  };

  const goBack = () => {}; // noop: step 2 is a separate page

  return (
    <div className="form-reservation form-reservation--centered">

      {/* ── Colonne gauche ── sélection (toujours visible) ── */}
      <div className="form-reservation__left">

        {/* R234 : titres sémantiques */}
        <h2 className="form-reservation__title">Sélectionner la date</h2>
        <Calendrier date={date} setDate={setDate} />

        {/* R69 + R71 : label associé + mention obligatoire */}
        <label className="form-reservation__label">Heure <span className="required">*</span></label>
        <div className="time-slots" role="list" aria-label="Créneaux horaires">
          {TIME_SLOTS.map(slot => {
            const [start, end] = slot.split(' - ');
            const selected = time === slot;
            return (
              <button
                key={slot}
                type="button"
                className={`time-slot ${selected ? 'time-slot--selected' : ''}`}
                onClick={() => setTime(slot)}
                disabled={!date}
                aria-pressed={selected}
              >
                <div className="time-slot__time">
                  <span className="time-slot__start">{start}</span>
                  <span className="time-slot__sep"> — </span>
                  <span className="time-slot__end">{end}</span>
                </div>
              </button>
            );
          })}
        </div>

        <label className="form-reservation__label" htmlFor="res-language">
          Langue de la visite
        </label>
        <select
          id="res-language"
          className="form-reservation__input"
          value={langue}
          onChange={e => setLangue(e.target.value)}
        >
          {/* R93 : optgroup si on avait plusieurs langues par région — ici 2 options, pas nécessaire */}
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
        </select>

        <div className="form-reservation__label">Nombre de billets</div>
        <div className="form-reservation__tickets">
          <fieldset className="tickets-fieldset">
            <legend className="sr-only">Nombre de billets</legend>
            <TicketRow label="Plein tarif"   price="9€"      count={pleinTarif}  onDecrement={() => setPleinTarif(Math.max(pleinTarif - 1, 0))}   onIncrement={() => { if (totalTickets < MAX_TICKETS) setPleinTarif(pleinTarif + 1); }}   canIncrement={totalTickets < MAX_TICKETS} />
            <TicketRow label="Tarif réduit (Étudiant / sénior)"  price="6€"      count={tarifReduit} onDecrement={() => setTarifReduit(Math.max(tarifReduit - 1, 0))} onIncrement={() => { if (totalTickets < MAX_TICKETS) setTarifReduit(tarifReduit + 1); }} canIncrement={totalTickets < MAX_TICKETS} />
            <TicketRow label="Gratuit (Jeune moins 26ans, enseignant, visiteurs handicapés)"       price="Gratuit" count={gratuit}     onDecrement={() => setGratuit(Math.max(gratuit - 1, 0))}         onIncrement={() => { if (totalTickets < MAX_TICKETS) setGratuit(gratuit + 1); }}         canIncrement={totalTickets < MAX_TICKETS} />
          </fieldset>
        </div>

        <div className="form-reservation__conditions">
          <Conditions />
        </div>
      
        {step === 1 && (
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={goNext} disabled={!step1IsComplete}>
              Suivant
            </button>
          </div>
        )}
      </div>

      <div className="form-reservation__right">
        {step === 1 ? (
          <>
            <h2 className="form-reservation__title">Récapitulatif</h2>
            <div className="form-reservation__summary">
              <div><strong>Date :</strong> {date ? (date instanceof Date ? date.toLocaleDateString('fr-FR') : String(date)) : '—'}</div>
              <div><strong>Heure :</strong> {time || '—'}</div>
              <div><strong>Langue :</strong> {langue === 'fr' ? 'Français' : 'Anglais'}</div>
              <div style={{ marginTop: 8 }}><strong>Billets :</strong></div>
              <div>Plein tarif : {pleinTarif}</div>
              <div>Tarif réduit : {tarifReduit}</div>
              <div>Gratuit : {gratuit}</div>
              {promoApplied && <div className="summary-discount">Réduction ({VALID_PROMO_CODE}) : -{discount.toFixed(2)}€</div>}
              <div className="summary-final">Total : {finalTotal.toFixed(2)}€</div>
              <div className="summary-divider" />
              {totalTickets >= MAX_TICKETS && <div className="summary-max">Nombre maximum de places atteint ({MAX_TICKETS})</div>}
              {totalTickets > 0 && totalTickets < MAX_TICKETS && <div className="summary-remaining">{MAX_TICKETS - totalTickets} place(s) restante(s)</div>}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="form-reservation__title">Coordonnées</h2>
              <button className="btn" onClick={goBack}>Retour</button>
            </div>

            <p className="form-required-notice">Les champs marqués d'un <span className="required">*</span> sont obligatoires.</p>

            <div className="form-recap-small" style={{ marginBottom: 12, background: 'rgba(0,0,0,0.06)', padding: 8, borderRadius: 8 }}>
              <div><strong>Date choisie :</strong> {date ? (date instanceof Date ? date.toLocaleDateString('fr-FR') : String(date)) : '—'}</div>
              <div><strong>Heure :</strong> {time || '—'}</div>
            </div>

            <label className="form-reservation__label" htmlFor="res-prenom">
              Prénom <span className="required">*</span>
            </label>
            <input id="res-prenom" className="form-reservation__input" type="text" placeholder="prénom" value={prenom} onChange={e => setPrenom(e.target.value)} />

            <label className="form-reservation__label" htmlFor="res-nom">
              Nom <span className="required">*</span>
            </label>
            <input id="res-nom" className="form-reservation__input" type="text" placeholder="nom" value={nom} onChange={e => setNom(e.target.value)} />

            <label className="form-reservation__label" htmlFor="res-email">
              E-mail <span className="required">*</span>
            </label>
            <input id="res-email" className="form-reservation__input" type="email" placeholder="e-mail" value={email} onChange={e => setEmail(e.target.value)} />

            <label className="form-reservation__label" htmlFor="res-email-confirm">
              Confirmez votre e-mail <span className="required">*</span>
            </label>
            <input id="res-email-confirm" className="form-reservation__input" type="email" placeholder="confirmez votre e-mail" value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)} />
            {email && emailConfirm && email !== emailConfirm && (
              <p className="form-error">Les adresses e-mail ne correspondent pas.</p>
            )}

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
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode.trim()}
                >
                  Appliquer
                </button>
              </div>
              {promoError   && <p className="promo-message error">{promoError}</p>}
              {promoApplied && <p className="promo-message success">Réduction de 5% appliquée</p>}
            </div>

            {submitError && <p className="form-error">{submitError}</p>}

            <ButtonValidation
              text="Confirmer ma réservation"
              onClick={handleSubmit}
              disabled={!formIsComplete}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Ligne de billet réutilisable
const TicketRow = ({ label, price, count, onDecrement, onIncrement, canIncrement }) => (
  <div className="form-reservation__ticket-row">
    <div className="ticket-label">{label}</div>
    <div className="ticket-price">{price}</div>
    <button type="button" className="form-reservation__btn" onClick={onDecrement} disabled={count === 0}>-</button>
    <div className="ticket-count">{count}</div>
    <button type="button" className="form-reservation__btn" onClick={onIncrement} disabled={!canIncrement}>+</button>
  </div>
);

export default FormReservation;