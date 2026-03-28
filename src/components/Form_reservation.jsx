import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const [submitError,  setSubmitError]  = useState(''); 
  
  // Utilisation d'un state modifiable pour l'étape
  const [step, setStep] = useState(1); 

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

  const { t } = useTranslation();
  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  if (!jwt) return <AuthPrompt message={t('authPrompt.default_message')} />;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === VALID_PROMO_CODE) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError(t('form.invalid_code'));
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
          setSubmitError(data?.message || 'Erreur lors de la réservation.');
        }
      })
      .catch(() => setSubmitError('Erreur réseau, veuillez réessayer.'));
  };

  // Gère le passage à l'étape 2
  const goNext = () => {
    if (step1IsComplete) setStep(2);
  };

  // Gère le retour à l'étape 1
  const goBack = () => {
    setStep(1);
  };

  return (
    <div className="form-reservation form-reservation--centered">

      {/* ── Colonne gauche ── sélection (toujours visible) ── */}
      <div className="form-reservation__left">

        <h2 className="form-reservation__title">{t('form.select_date')}</h2>
        
        <Calendrier date={date} setDate={setDate} />

        {/* Accessibilité : Fieldset + Legend pour grouper les boutons radio */}
        <fieldset className="time-slots-fieldset" style={{ border: 'none', padding: 0 }}>
          <legend className="form-reservation__label">
            {t('form.time_label')} <span className="required" title="Obligatoire">*</span>
          </legend>
          
          <div className="time-slots">
            {TIME_SLOTS.map(slot => {
              const [start, end] = slot.split(' - ');
              return (
                <label 
                  key={slot} 
                  className={`time-slot ${time === slot ? 'time-slot--selected' : ''}`}
                >
                  <input 
                    type="radio" 
                    name="time_slot" 
                    value={slot}
                    className="sr-only"
                    checked={time === slot}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={!date}
                  />
                  <div className="time-slot__time">
                    <span className="time-slot__start">{start}</span>
                    <span className="time-slot__sep"> — </span>
                    <span className="time-slot__end">{end}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="form-reservation__label" htmlFor="res-language">
          {t('form.language_label')}
        </label>
        <select
          id="res-language"
          className="form-reservation__input"
          value={langue}
          onChange={e => setLangue(e.target.value)}
        >
          <option value="fr">{t('form.lang_fr')}</option>
          <option value="en">{t('form.lang_en')}</option>
        </select>

        <div className="form-reservation__label">{t('form.tickets_label')}</div>
        <div className="form-reservation__tickets">
          <fieldset className="tickets-fieldset">
            <legend className="sr-only">{t('form.tickets_label')}</legend>
            <TicketRow label={t('form.price_full')}   price="9€"      count={pleinTarif}  onDecrement={() => setPleinTarif(Math.max(pleinTarif - 1, 0))}   onIncrement={() => { if (totalTickets < MAX_TICKETS) setPleinTarif(pleinTarif + 1); }}   canIncrement={totalTickets < MAX_TICKETS} />
            <TicketRow label={t('form.price_reduced')}  price="6€"      count={tarifReduit} onDecrement={() => setTarifReduit(Math.max(tarifReduit - 1, 0))} onIncrement={() => { if (totalTickets < MAX_TICKETS) setTarifReduit(tarifReduit + 1); }} canIncrement={totalTickets < MAX_TICKETS} />
            <TicketRow label={t('form.price_free')}       price="Gratuit" count={gratuit}     onDecrement={() => setGratuit(Math.max(gratuit - 1, 0))}         onIncrement={() => { if (totalTickets < MAX_TICKETS) setGratuit(gratuit + 1); }}         canIncrement={totalTickets < MAX_TICKETS} />
          </fieldset>
        </div>

        <div className="form-reservation__conditions">
          <Conditions />
        </div>
      
        {step === 1 && (
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={goNext} disabled={!step1IsComplete}>
              {t('form.next')}
            </button>
          </div>
        )}
      </div>

      {/* ── Colonne de droite ── Résumé (Étape 1) ou Coordonnées (Étape 2) ── */}
      <div className="form-reservation__right">
        {step === 1 ? (
          <>
            <h2 className="form-reservation__title">{t('form.summary')}</h2>
            <div className="form-reservation__summary">
              <div><strong>{t('form.date')} :</strong> {date ? (date instanceof Date ? date.toLocaleDateString() : String(date)) : '—'}</div>
              <div><strong>{t('form.time_label')} :</strong> {time || '—'}</div>
              <div><strong>{t('form.language')} :</strong> {langue === 'fr' ? t('form.lang_fr') : t('form.lang_en')}</div>
              <div style={{ marginTop: 8 }}><strong>{t('form.tickets')} :</strong></div>
              <div>{t('form.price_full')} : {pleinTarif}</div>
              <div>{t('form.price_reduced')} : {tarifReduit}</div>
              <div>{t('form.price_free')} : {gratuit}</div>
              {promoApplied && <div className="summary-discount">{t('form.discount_applied')} ({VALID_PROMO_CODE}) : -{discount.toFixed(2)}€</div>}
              <div className="summary-final">{t('form.total')} : {finalTotal.toFixed(2)}€</div>
              <div className="summary-divider" />
              {totalTickets >= MAX_TICKETS && <div className="summary-max">{t('form.max_reached')} ({MAX_TICKETS})</div>}
              {totalTickets > 0 && totalTickets < MAX_TICKETS && <div className="summary-remaining">{t('form.remaining', { count: MAX_TICKETS - totalTickets })}</div>}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="form-reservation__title">{t('form.contact_details')}</h2>
              <button type="button" className="btn" onClick={goBack}>{t('form.back')}</button>
            </div>

            <p className="form-required-notice">{t('form.required_notice')}</p>

            <div className="form-recap-small" style={{ marginBottom: 12, background: 'rgba(0,0,0,0.06)', padding: 8, borderRadius: 8 }}>
              <div><strong>Date choisie :</strong> {date ? (date instanceof Date ? date.toLocaleDateString('fr-FR') : String(date)) : '—'}</div>
              <div><strong>Heure :</strong> {time || '—'}</div>
            </div>

            <label className="form-reservation__label" htmlFor="res-prenom">
              {t('form.first_name')} <span className="required" title="Obligatoire">*</span>
            </label>
            <input id="res-prenom" className="form-reservation__input" type="text" placeholder={t('form.placeholders.first_name')} value={prenom} onChange={e => setPrenom(e.target.value)} required />

            <label className="form-reservation__label" htmlFor="res-nom">
              {t('form.last_name')} <span className="required" title="Obligatoire">*</span>
            </label>
            <input id="res-nom" className="form-reservation__input" type="text" placeholder={t('form.placeholders.last_name')} value={nom} onChange={e => setNom(e.target.value)} required />

            <label className="form-reservation__label" htmlFor="res-email">
              {t('form.email')} <span className="required" title="Obligatoire">*</span>
            </label>
            <input id="res-email" className="form-reservation__input" type="email" placeholder={t('form.placeholders.email')} value={email} onChange={e => setEmail(e.target.value)} required />

            <label className="form-reservation__label" htmlFor="res-email-confirm">
              {t('form.confirm_email')} <span className="required" title="Obligatoire">*</span>
            </label>
            <input id="res-email-confirm" className="form-reservation__input" type="email" placeholder={t('form.placeholders.confirm_email')} value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)} required />
            {email && emailConfirm && email !== emailConfirm && (
              <p className="form-error">{t('form.emails_mismatch')}</p>
            )}

            <div className="promo-section">
              <label className="promo-label" htmlFor="res-promo">{t('form.promo_code')}</label>
              <div className="promo-row">
                <input
                  id="res-promo"
                  className="form-reservation__input"
                  type="text"
                  placeholder={t('form.placeholders.promo')}
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
                  {t('form.apply')}
                </button>
              </div>
              {promoError   && <p className="promo-message error">{promoError}</p>}
              {promoApplied && <p className="promo-message success">{t('form.promo_success')}</p>}
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
    <button type="button" className="form-reservation__btn" onClick={onDecrement} disabled={count === 0}>
      -
      <span className="sr-only">Retirer un billet {label}</span>
    </button>
    <div className="ticket-count" aria-live="polite">{count}</div>
    <button type="button" className="form-reservation__btn" onClick={onIncrement} disabled={!canIncrement}>
      +
      <span className="sr-only">Ajouter un billet {label}</span>
    </button>
  </div>
);

export default FormReservation;