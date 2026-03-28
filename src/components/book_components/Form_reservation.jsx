import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ButtonValidation from './ButtonValidation';
import Calendrier from './Calendrier';
import AuthPrompt from '../connexion_components/AuthPrompt';
import Conditions from './Conditions';
import '../../styles/components/book_components/form-reservation.css';

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
  const { t } = useTranslation();
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
  const [step1Error,   setStep1Error]   = useState(''); // Erreur validation étape 1

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

  const jwt = typeof window !== 'undefined' ? (localStorage.getItem('jwt') || localStorage.getItem('token')) : null;
  if (!jwt) return <AuthPrompt message={t('reservation.requiresLogin')} />;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === VALID_PROMO_CODE) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError(t('reservation.invalidPromo'));
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
          setSubmitError(data?.message || t('reservation.error'));
        }
      })
      .catch(() => setSubmitError(t('reservation.networkError')));
  };

  const goNext = () => {
    setStep1Error('');
    if (!step1IsComplete) {
      if (!date) setStep1Error(t('reservation.selectDate'));
      else if (!time) setStep1Error(t('reservation.selectTime'));
      else if (totalTickets === 0) setStep1Error(t('reservation.selectTickets'));
      return;
    }
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

  const goBack = () => {
    setStep(1);
  };

  return (
    <div className="form-reservation form-reservation--centered">

      {/* ── Colonne gauche ── sélection (toujours visible) ── */}
      <div className="form-reservation__left">

        <div className="reservation-intro">
          <h1 className="reservation-intro__title">{t('reservation.title')}</h1>
          <p className="reservation-intro__subtitle">{t('reservation.subtitle')}</p>
          <p className="reservation-intro__description">{t('reservation.description')}</p>
        </div>

        {/* R234 : titres sémantiques */}
        <h2 className="form-reservation__title">{t('reservation.selectDate')}</h2>
        <Calendrier date={date} setDate={setDate} />

        {/* R69 + R71 : label associé + mention obligatoire */}
        <label className="form-reservation__label">{t('reservation.time')} <span className="required">*</span></label>
        <div className="time-slots" role="list" aria-label={t('reservation.timeSlots')}>
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
          {t('reservation.language')}
        </label>
        <select
          id="res-language"
          className="form-reservation__input"
          value={langue}
          onChange={e => setLangue(e.target.value)}
        >
          {/* R93 : optgroup si on avait plusieurs langues par région — ici 2 options, pas nécessaire */}
          <option value="fr">{t('common.french')}</option>
          <option value="en">{t('common.english')}</option>
        </select>

        <div className="form-reservation__label">{t('reservation.tickets')}</div>
        <div className="form-reservation__tickets">
          <fieldset className="tickets-fieldset">
            <legend className="sr-only">{t('reservation.tickets')}</legend>
            <TicketRow label={t('reservation.fullPrice')}   price="9€"      count={pleinTarif}  onDecrement={() => setPleinTarif(Math.max(pleinTarif - 1, 0))}   onIncrement={() => { if (totalTickets < MAX_TICKETS) setPleinTarif(pleinTarif + 1); }}   canIncrement={totalTickets < MAX_TICKETS} />
            <TicketRow label={t('reservation.reducedPrice')}  price="6€"      count={tarifReduit} onDecrement={() => setTarifReduit(Math.max(tarifReduit - 1, 0))} onIncrement={() => { if (totalTickets < MAX_TICKETS) setTarifReduit(tarifReduit + 1); }} canIncrement={totalTickets < MAX_TICKETS} />
            <TicketRow label={t('reservation.free')}       price={t('common.free')} count={gratuit}     onDecrement={() => setGratuit(Math.max(gratuit - 1, 0))}         onIncrement={() => { if (totalTickets < MAX_TICKETS) setGratuit(gratuit + 1); }}         canIncrement={totalTickets < MAX_TICKETS} />
          </fieldset>
        </div>

        <div className="form-reservation__conditions">
          <Conditions />
        </div>
      </div>

      <div className="form-reservation__right">
        <div className="form-reservation__sticky-wrapper">
          <h2 className="form-reservation__title">{t('reservation.summary')}</h2>
          <div className="form-reservation__summary">
            <div><strong>{t('reservation.date')}:</strong> {date ? (date instanceof Date ? date.toLocaleDateString('fr-FR') : String(date)) : '—'}</div>
            <div><strong>{t('reservation.time')}:</strong> {time || '—'}</div>
            <div><strong>{t('reservation.language')}:</strong> {langue === 'fr' ? t('common.french') : t('common.english')}</div>
            <div style={{ marginTop: 8 }}><strong>{t('reservation.tickets')}:</strong></div>
            <div>{t('reservation.fullPrice')}: {pleinTarif}</div>
            <div>{t('reservation.reducedPrice')}: {tarifReduit}</div>
            <div>{t('common.free')}: {gratuit}</div>
            {promoApplied && <div className="summary-discount">{t('reservation.discount')} ({VALID_PROMO_CODE}): -{discount.toFixed(2)}€</div>}
            <div className="summary-final">{t('reservation.total')}: {finalTotal.toFixed(2)}€</div>
            <div className="summary-divider" />
            {totalTickets >= MAX_TICKETS && <div className="summary-max">{t('reservation.maxReached')} ({MAX_TICKETS})</div>}
            {totalTickets > 0 && totalTickets < MAX_TICKETS && <div className="summary-remaining">{MAX_TICKETS - totalTickets} {t('reservation.placesRemaining')}</div>}
          </div>
          
          {/* R85 : erreur validation étape 1 accessible */}
          {step1Error && <p className="form-error" role="alert">{step1Error}</p>}
          
          <button 
            className="btn btn-primary" 
            onClick={goNext} 
            disabled={!formIsComplete}
          >
            {t('reservation.next')}
          </button>
        </div>
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