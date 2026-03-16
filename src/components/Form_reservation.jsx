import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonValidation from './ButtonValidation';
import Calendrier from './Calendrier';
import '../styles/form-reservation.css';

const FormReservation = () => {
    const navigate = useNavigate();
  // Récupérer les données passées depuis le calendrier
  const location = useLocation();
  const reservationData = location.state;

  // Champs du formulaire
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [langue, setLangue] = useState('fr');
  // Billets
  const [pleinTarif, setPleinTarif] = useState(0);
  const [tarifReduit, setTarifReduit] = useState(0);
  const [gratuit, setGratuit] = useState(0);
  const MAX_TICKETS = 10;
  const totalTickets = pleinTarif + tarifReduit + gratuit;
  // Promo
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  // Prix
  const PRIX_PLEIN = 9;
  const PRIX_REDUIT = 6;
  const total = pleinTarif * PRIX_PLEIN + tarifReduit * PRIX_REDUIT;
  const discount = promoApplied ? +(total * 0.05) : 0;
  const finalTotal = +(total - discount).toFixed(2);

  // Pré-remplir les champs date et time si des données viennent du calendrier
  useEffect(() => {
    if (reservationData) {
      // Formater la date pour l'input HTML (format YYYY-MM-DD obligatoire)
      if (reservationData.date) {
        const selectedDate = new Date(reservationData.date);
        setDate(selectedDate);
      }
      
      // Extraire l'heure de début du créneau (ex: "10:00 - 11:00" devient "10:00")
      if (reservationData.slot) {
        const startTime = reservationData.slot.split(' - ')[0];
        setTime(startTime);
      }
      // If reservationData contains promo info (from game), apply it
      if (reservationData.promoCode) {
        setPromoCode(reservationData.promoCode);
        if (reservationData.promoApplied) setPromoApplied(true);
      }
    }
  }, []);

  // Fonction appelée quand on clique sur le bouton
  const handleSubmit = () => {
    // Validation simple
    console.log('Prénom:', prenom);
    console.log('Nom:', nom);
    console.log('Email:', email);
    console.log('Email Confirm:', emailConfirm);
    console.log('Date:', date);
    console.log('Heure:', time);
    console.log('Langue:', langue);
    console.log('Billets:', { pleinTarif, tarifReduit, gratuit });
    // Redirection vers la page de confirmation en passant l'état
    navigate('/confirmation', {
      state: {
        prenom,
        nom,
        email,
        date,
        time,
        langue,
        billets: { pleinTarif, tarifReduit, gratuit },
        total: finalTotal,
        promoCode: promoApplied ? promoCode : undefined,
      }
    });
  };

  // Vérifier si tous les champs sont remplis
  let formIsComplete = false;
  if (
    prenom && nom && email && emailConfirm && date && time &&
    email === emailConfirm && (pleinTarif + tarifReduit + gratuit) > 0
  ) {
    formIsComplete = true;
  }

  return (
    <div className="form-reservation">
      <div className="form-reservation__left">
        <div className="form-reservation__title">Sélectionner la date</div>
        <Calendrier date={date} setDate={setDate} />
        <div className="form-reservation__label">Sélectionner l'heure</div>
        <select
          className="form-reservation__input"
          value={time}
          onChange={e => setTime(e.target.value)}
          disabled={!date}
        >
          <option value="">Choisir...</option>
          {Array.from({length: 8}, (_, i) => {
            const startHour = 10 + i;
            const endHour = startHour + 1;
            const label = `${startHour}h00 - ${endHour}h00`;
            return <option key={label} value={label}>{label}</option>;
          })}
        </select>
        <div className="form-reservation__label">Langues disponibles</div>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ marginRight: '1rem' }}>Français / Anglais</span>
          <select
            className="form-reservation__input"
            value={langue}
            onChange={e => setLangue(e.target.value)}
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </div>
        <div className="form-reservation__label">Sélectionner le nombre de billets</div>
        <div className="form-reservation__tickets">
          <div className="form-reservation__ticket-row">
            <span>Plein Tarif</span>
            <span>9euros</span>
            <button className="form-reservation__btn" onClick={() => setPleinTarif(Math.max(pleinTarif - 1, 0))} disabled={pleinTarif === 0}>-</button>
            <span>{pleinTarif}</span>
            <button
              className="form-reservation__btn"
              onClick={() => { if (totalTickets < MAX_TICKETS) setPleinTarif(pleinTarif + 1); }}
              disabled={totalTickets >= MAX_TICKETS}
            >+</button>
          </div>
          <div className="form-reservation__ticket-row">
            <span>Tarif Réduit</span>
            <span>6euros</span>
            <button className="form-reservation__btn" onClick={() => setTarifReduit(Math.max(tarifReduit - 1, 0))} disabled={tarifReduit === 0}>-</button>
            <span>{tarifReduit}</span>
            <button
              className="form-reservation__btn"
              onClick={() => { if (totalTickets < MAX_TICKETS) setTarifReduit(tarifReduit + 1); }}
              disabled={totalTickets >= MAX_TICKETS}
            >+</button>
          </div>
          <div className="form-reservation__ticket-row">
            <span>Gratuit</span>
            <span>Gratuit</span>
            <button className="form-reservation__btn" onClick={() => setGratuit(Math.max(gratuit - 1, 0))} disabled={gratuit === 0}>-</button>
            <span>{gratuit}</span>
            <button
              className="form-reservation__btn"
              onClick={() => { if (totalTickets < MAX_TICKETS) setGratuit(gratuit + 1); }}
              disabled={totalTickets >= MAX_TICKETS}
            >+</button>
          </div>
        </div>
        <div className="form-reservation__conditions">
          <details>
            <summary>Conditions de gratuité</summary>
            <ul>
              <li>Enfants -12 ans</li>
              <li>Personnes handicapées</li>
            </ul>
          </details>
          <details>
            <summary>Conditions du tarif réduit</summary>
            <ul>
              <li>Étudiants</li>
              <li>Demandeurs d'emploi</li>
            </ul>
          </details>
        </div>
      </div>
      <div className="form-reservation__right">
        <div className="form-reservation__title">Coordonnées</div>
        <input
          className="form-reservation__input"
          type="text"
          placeholder="prénom"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
        />
        <input
          className="form-reservation__input"
          type="text"
          placeholder="nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />
        <input
          className="form-reservation__input"
          type="email"
          placeholder="e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="form-reservation__input"
          type="email"
          placeholder="confirmez votre e-mail"
          value={emailConfirm}
          onChange={e => setEmailConfirm(e.target.value)}
        />
        <div className="promo-section">
          <label className="promo-label">Code promo</label>
          <div className="promo-row">
            <input
              className="form-reservation__input"
              type="text"
              placeholder="Entrez le code promo"
              value={promoCode}
              onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
              disabled={promoApplied}
            />
            <button
              className="form-reservation__btn"
              onClick={() => {
                const code = promoCode.trim().toUpperCase();
                if (code === 'HUMAIN5') {
                  setPromoApplied(true);
                  setPromoError('');
                } else {
                  setPromoApplied(false);
                  setPromoError('Code invalide');
                }
              }}
              disabled={promoApplied || !promoCode.trim()}
            >Appliquer</button>
          </div>
          {promoError && <div className="promo-message error">{promoError}</div>}
          {promoApplied && <div className="promo-message success">Réduction de 5% appliquée</div>}
        </div>
        <div className="form-reservation__summary" style={{ margin: '1rem 0' }}>
          <div>Récapitulatif :</div>
          <div>Plein tarif: {pleinTarif} × {PRIX_PLEIN}€</div>
          <div>Tarif réduit: {tarifReduit} × {PRIX_REDUIT}€</div>
          <div>Gratuit: {gratuit}</div>
          <div className="summary-subtotal">Sous-total: {total.toFixed(2)}€</div>
          {promoApplied && (
            <div className="summary-discount">Réduction (HUMAIN5): -{(discount).toFixed(2)}€</div>
          )}
          <div className="summary-final">Total à payer: {finalTotal.toFixed(2)}€</div>
          {totalTickets >= MAX_TICKETS && (
            <div className="summary-max">Nombre maximum de places atteint ({MAX_TICKETS})</div>
          )}
          {totalTickets > 0 && totalTickets < MAX_TICKETS && (
            <div className="summary-remaining">{MAX_TICKETS - totalTickets} place(s) restante(s)</div>
          )}
        </div>
        <ButtonValidation
          text="Confirmer ma réservation"
          navigateTo="/confirmation"
          onClick={handleSubmit}
          disabled={!formIsComplete}
        />
      </div>
    </div>
  );
};

export default FormReservation;