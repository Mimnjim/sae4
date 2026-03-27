import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonValidation from '../components/ButtonValidation';
import Conditions from '../components/Conditions';
import '../styles/form-reservation.css';

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

  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  if (!jwt) return <div style={{ padding: 24 }}><p>Connectez-vous pour réserver votre visite.</p></div>;

  const handleApplyPromo = () => {
    const code = (promoCode || '').trim().toUpperCase();
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
          setSubmitError(data?.message || 'Erreur lors de la réservation.');
        }
      })
      .catch(() => setSubmitError('Erreur réseau, veuillez réessayer.'));
  };

  if (!selection) return null;

  return (
    <div className="form-reservation" style={{ padding: 24 }}>
      <div className="form-reservation__left">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="form-reservation__title">Coordonnées</h2>
          <button className="btn" onClick={() => navigate(-1)}>Retour</button>
        </div>

        <p className="form-required-notice">Les champs marqués d'un <span className="required">*</span> sont obligatoires.</p>

        <div className="form-recap-small" style={{ marginBottom: 12, background: 'rgba(0,0,0,0.06)', padding: 8, borderRadius: 8 }}>
          <div><strong>Date choisie :</strong> {date ? date.toLocaleDateString('fr-FR') : '—'}</div>
          <div><strong>Heure :</strong> {time || '—'}</div>
        </div>

        <label className="form-reservation__label" htmlFor="res-prenom">Prénom <span className="required">*</span></label>
        <input id="res-prenom" className="form-reservation__input" type="text" value={prenom} onChange={e => setPrenom(e.target.value)} />

        <label className="form-reservation__label" htmlFor="res-nom">Nom <span className="required">*</span></label>
        <input id="res-nom" className="form-reservation__input" type="text" value={nom} onChange={e => setNom(e.target.value)} />

        <label className="form-reservation__label" htmlFor="res-email">E-mail <span className="required">*</span></label>
        <input id="res-email" className="form-reservation__input" type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label className="form-reservation__label" htmlFor="res-email-confirm">Confirmez votre e-mail <span className="required">*</span></label>
        <input id="res-email-confirm" className="form-reservation__input" type="email" value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)} />
        {email && emailConfirm && email !== emailConfirm && (
          <p className="form-error">Les adresses e-mail ne correspondent pas.</p>
        )}

        <div className="promo-section">
          <label className="promo-label" htmlFor="res-promo">Code promo</label>
          <div className="promo-row">
            <input id="res-promo" className="form-reservation__input" type="text" value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(''); }} disabled={promoApplied} />
            <button type="button" className="form-reservation__btn" onClick={handleApplyPromo} disabled={promoApplied || !promoCode.trim()}>Appliquer</button>
          </div>
          {promoError && <p className="promo-message error">{promoError}</p>}
          {promoApplied && <p className="promo-message success">Réduction de 5% appliquée</p>}
        </div>

        {submitError && <p className="form-error">{submitError}</p>}

        <ButtonValidation text="Confirmer ma réservation" onClick={handleSubmit} disabled={!formIsComplete} />
      </div>

      <div className="form-reservation__right">
        <h2 className="form-reservation__title">Récapitulatif</h2>
        <div className="form-reservation__summary">
          <div><strong>Date :</strong> {date ? date.toLocaleDateString('fr-FR') : '—'}</div>
          <div><strong>Heure :</strong> {time || '—'}</div>
          <div style={{ marginTop: 8 }}><strong>Billets :</strong></div>
          <div>Plein tarif : {pleinTarif}</div>
          <div>Tarif réduit : {tarifReduit}</div>
          <div>Gratuit : {gratuit}</div>
          {promoApplied && <div className="summary-discount">Réduction ({VALID_PROMO_CODE}) : -{discount.toFixed(2)}€</div>}
          <div className="summary-final">Total : {finalTotal.toFixed(2)}€</div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
