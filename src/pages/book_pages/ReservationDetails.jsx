import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ButtonValidation from '../../components/book_components/ButtonValidation';
import Conditions from '../../components/book_components/Conditions';
import '../../styles/components/book_components/form-reservation.css';

const PRIX_PLEIN  = 9;
const PRIX_REDUIT = 6;
const VALID_PROMO_CODE     = 'HUMAIN5';
const VALID_PROMO_DISCOUNT = 0.05;

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

const ReservationDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const selection = location.state;

  useEffect(() => {
    if (!selection) {
      navigate('/form-reservation');
    }
  }, [selection]);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [promoCode, setPromoCode] = useState(selection?.promoCode || '');
  const [promoApplied, setPromoApplied] = useState(Boolean(selection?.promoApplied));
  const [promoError, setPromoError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const date = selection?.date ? new Date(selection.date) : null;
  const time = selection?.time || '';
  const langue = selection?.langue || 'fr';
  const pleinTarif = selection?.pleinTarif || 0;
  const tarifReduit = selection?.tarifReduit || 0;
  const gratuit = selection?.gratuit || 0;

  const totalTickets = pleinTarif + tarifReduit + gratuit;
  const subtotal = pleinTarif * PRIX_PLEIN + tarifReduit * PRIX_REDUIT;
  const discount = promoApplied ? subtotal * VALID_PROMO_DISCOUNT : 0;
  const finalTotal = +(subtotal - discount).toFixed(2);

  const formIsComplete = Boolean(prenom && nom && email && emailConfirm && email === emailConfirm && totalTickets > 0);

  const jwt = typeof window !== 'undefined' ? (localStorage.getItem('jwt') || localStorage.getItem('token')) : null;
  if (!jwt) return <div style={{ padding: 24 }}><p>{t('form.login_required') || (localStorage.getItem('lang') === 'en' ? 'Please log in to book your visit.' : 'Connectez-vous pour réserver votre visite.')}</p></div>;

  const handleApplyPromo = () => {
    const code = (promoCode || '').trim().toUpperCase();
    if (code === VALID_PROMO_CODE) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError(t('form.invalid_code') || (localStorage.getItem('lang') === 'en' ? 'Invalid promo code' : 'Code promo invalide'));
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

  if (!selection) return null;

  return (
    <div className="form-reservation form-reservation--centered" style={{ padding: '9rem 5rem' }}>
      <div className="form-reservation__left">
        <div className="reservation-intro">
          <h1 className="reservation-intro__title">{localStorage.getItem('lang') === 'en' ? 'Finalize your reservation' : 'Finalisez votre réservation'}</h1>
          <p className="reservation-intro__description">{localStorage.getItem('lang') === 'en' ? 'Complete your personal information' : 'Complétez vos informations personnelles'}</p>
        </div>

        <h2 className="form-reservation__title">{localStorage.getItem('lang') === 'en' ? 'Contact Details' : 'Coordonnées'}</h2>

        <p className="form-required-notice">{localStorage.getItem('lang') === 'en' ? 'Fields marked with <span className="required">*</span> are required.' : 'Les champs marqués d\'un <span className="required">*</span> sont obligatoires.'}</p>

        <div className="reservation-recap">
          <div className="reservation-recap__item">
            <span className="reservation-recap__label">{localStorage.getItem('lang') === 'en' ? 'Selected date:' : 'Date choisie :'}</span>
            <span className="reservation-recap__value">{date ? date.toLocaleDateString('fr-FR') : '—'}</span>
          </div>
          <div className="reservation-recap__item">
            <span className="reservation-recap__label">{localStorage.getItem('lang') === 'en' ? 'Time:' : 'Heure :'}</span>
            <span className="reservation-recap__value">{time || '—'}</span>
          </div>
        </div>

        <label className="form-reservation__label" htmlFor="res-prenom">{localStorage.getItem('lang') === 'en' ? 'First Name' : 'Prénom'} <span className="required">*</span></label>
        <input id="res-prenom" className="form-reservation__input" type="text" placeholder={localStorage.getItem('lang') === 'en' ? 'first name' : 'prénom'} value={prenom} onChange={e => setPrenom(e.target.value)} />

        <label className="form-reservation__label" htmlFor="res-nom">{localStorage.getItem('lang') === 'en' ? 'Last Name' : 'Nom'} <span className="required">*</span></label>
        <input id="res-nom" className="form-reservation__input" type="text" placeholder={localStorage.getItem('lang') === 'en' ? 'last name' : 'nom'} value={nom} onChange={e => setNom(e.target.value)} />

        <label className="form-reservation__label" htmlFor="res-email">{localStorage.getItem('lang') === 'en' ? 'Email' : 'E-mail'} <span className="required">*</span></label>
        <input id="res-email" className="form-reservation__input" type="email" placeholder={localStorage.getItem('lang') === 'en' ? 'email' : 'e-mail'} value={email} onChange={e => setEmail(e.target.value)} />

        <label className="form-reservation__label" htmlFor="res-email-confirm">{localStorage.getItem('lang') === 'en' ? 'Confirm your email' : 'Confirmez votre e-mail'} <span className="required">*</span></label>
        <input id="res-email-confirm" className="form-reservation__input" type="email" placeholder={localStorage.getItem('lang') === 'en' ? 'confirm email' : 'confirmez votre e-mail'} value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)} />
        {/* R85 : erreur comparaison emails accessible */}
        {email && emailConfirm && email !== emailConfirm && (
          <p className="form-error" role="alert">{localStorage.getItem('lang') === 'en' ? 'Email addresses do not match.' : 'Les adresses e-mail ne correspondent pas.'}</p>
        )}

        <div className="promo-section">
          <label className="promo-label" htmlFor="res-promo">{t('form.promo_code') || (localStorage.getItem('lang') === 'en' ? 'Promo Code' : 'Code promo')}</label>
          <div className="promo-row">
            <input id="res-promo" className="form-reservation__input" type="text" placeholder={localStorage.getItem('lang') === 'en' ? 'Enter promo code' : 'Entrez le code promo'} value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(''); }} disabled={promoApplied} />
            <button type="button" className="form-reservation__btn" onClick={handleApplyPromo} disabled={promoApplied || !promoCode.trim()}>{localStorage.getItem('lang') === 'en' ? 'Apply' : 'Appliquer'}</button>
          </div>
          {/* R85 : messages de code promo accessibles */}
          {promoError && <p className="promo-message error" role="alert">{promoError}</p>}
          {promoApplied && <p className="promo-message success" role="status" aria-live="polite">{localStorage.getItem('lang') === 'en' ? '5% discount applied' : 'Réduction de 5% appliquée'}</p>}
        </div>

        {/* R85 : erreur soumission accessible */}
        {submitError && <p className="form-error" role="alert">{submitError}</p>}

        <ButtonValidation text={t('form.confirm_booking')} onClick={handleSubmit} disabled={!formIsComplete} />
      </div>

      <div className="form-reservation__right">
        <div className="form-reservation__sticky-wrapper">
          <h2 className="form-reservation__title">{localStorage.getItem('lang') === 'en' ? 'Summary' : 'Récapitulatif'}</h2>
          <div className="form-reservation__summary">
            <div><strong>{localStorage.getItem('lang') === 'en' ? 'Date:' : 'Date :'}</strong> {date ? date.toLocaleDateString(localStorage.getItem('lang') === 'en' ? 'en-US' : 'fr-FR') : '—'}</div>
            <div><strong>{localStorage.getItem('lang') === 'en' ? 'Time:' : 'Heure :'}</strong> {time || '—'}</div>
            <div><strong>{localStorage.getItem('lang') === 'en' ? 'Language:' : 'Langue :'}</strong> {langue === 'fr' ? (localStorage.getItem('lang') === 'en' ? 'French' : 'Français') : (localStorage.getItem('lang') === 'en' ? 'English' : 'Anglais')}</div>
            <div style={{ marginTop: 8 }}><strong>{localStorage.getItem('lang') === 'en' ? 'Tickets:' : 'Billets :'}</strong></div>
            <div>{localStorage.getItem('lang') === 'en' ? 'Full price:' : 'Plein tarif :'} {pleinTarif}</div>
            <div>{localStorage.getItem('lang') === 'en' ? 'Reduced rate:' : 'Tarif réduit :'} {tarifReduit}</div>
            <div>{localStorage.getItem('lang') === 'en' ? 'Free:' : 'Gratuit :'} {gratuit}</div>
            {promoApplied && <div className="summary-discount">{localStorage.getItem('lang') === 'en' ? 'Discount' : 'Réduction'} ({VALID_PROMO_CODE}) : -{discount.toFixed(2)}€</div>}
            <div className="summary-final">{localStorage.getItem('lang') === 'en' ? 'Total:' : 'Total :'} {finalTotal.toFixed(2)}€</div>
            <div className="summary-divider" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
