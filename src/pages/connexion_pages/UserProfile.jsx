import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/connexion_components/user-profile.css';

function getJwt() {
  return localStorage.getItem('jwt') || localStorage.getItem('token');
}

function getAuthHeaders(extraHeaders = {}) {
  const jwt = getJwt();
  return {
    'Authorization':   `Bearer ${jwt}`,
    'X-Authorization': `Bearer ${jwt}`,
    ...extraHeaders,
  };
}

export default function UserProfile() {
  const navigate = useNavigate();

  const [user,           setUser]           = useState(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [showPassword,   setShowPassword]   = useState(false);
  const [errorMessage,   setErrorMessage]   = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reservations,   setReservations]   = useState([]);
  // R162 : confirmation dans le DOM plutôt que window.confirm()
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toastMessage,   setToastMessage]   = useState('');
  const [showToast,      setShowToast]      = useState(false);

  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' });

  useEffect(() => {
    const jwt = getJwt();
    if (!jwt) { navigate('/login'); return; }

    fetch('https://apimusee.tomdelavigne.fr/api/users.php', { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.user) { setErrorMessage('Impossible de charger le profil.'); return; }
        const fetchedUser = data.user;
        setUser(fetchedUser);
        setForm({ firstname: fetchedUser.firstname || '', lastname: fetchedUser.lastname || '', email: fetchedUser.email || '', password: '' });
        return fetch(`https://apimusee.tomdelavigne.fr/api/reservations.php?user_id=${fetchedUser.id}`, { headers: getAuthHeaders() });
      })
      .then(r => r?.json())
      .then(list => { if (list) setReservations(list); })
      .catch(() => setErrorMessage('Erreur réseau, veuillez réessayer.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setErrorMessage('');
    setSuccessMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/users.php', {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(form),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          setSuccessMessage('Profil mis à jour avec succès.');
        } else {
          setErrorMessage(data.message || 'Erreur lors de la mise à jour.');
        }
      })
      .catch(() => setErrorMessage('Erreur réseau, veuillez réessayer.'));
  };

  const handleDeleteReservation = (reservationId) => {
    fetch(`https://apimusee.tomdelavigne.fr/api/reservations.php?id=${reservationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setReservations(prev => prev.filter(r => r.id !== reservationId));
          setToastMessage('Réservation supprimée.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } else {
          setErrorMessage(data.message || 'Erreur lors de la suppression.');
        }
      })
      .catch(() => setErrorMessage('Erreur réseau, veuillez réessayer.'))
      .finally(() => setConfirmDeleteId(null));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (isLoading) return <div className="user-profile__loading">Chargement...</div>;
  if (!user)     return <div className="user-profile__error">Utilisateur non connecté.</div>;

  return (
    <div className="user-profile user-profile__container">
      <div className="user-profile__header">
        <div className="user-profile__title-section">
          <h2>Mon profil</h2>
        </div>
        <div className="user-profile__logout-section">
          <button type="button" className="btn btn-danger" onClick={handleLogout}>Se déconnecter</button>
        </div>
      </div>

      {/* R85 : messages dans le DOM */}
      {errorMessage   && <p className="form-error">{errorMessage}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <div className="user-profile__grid">
        <div className="form-group">
          <label className="user-label" htmlFor="user-firstname">Prénom</label>
          <input id="user-firstname" className="user-input" type="text" name="firstname" value={form.firstname} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="user-label" htmlFor="user-lastname">Nom</label>
          <input id="user-lastname" className="user-input" type="text" name="lastname" value={form.lastname} onChange={handleChange} />
        </div>
        <div className="form-group form-group--full">
          <label className="user-label" htmlFor="user-email">Email</label>
          <input id="user-email" className="user-input" type="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group form-group--full">
          <label className="user-label" htmlFor="user-password">
            Nouveau mot de passe (laisser vide pour ne pas changer)
          </label>
          <div className="user-profile__password-row">
            <input id="user-password" className="user-input" name="password" value={form.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} />
            {/* R76 : afficher/masquer le mot de passe */}
            <button type="button" className="user-profile__password-toggle" onClick={() => setShowPassword(c => !c)}>
              {showPassword ? 'Cacher' : 'Voir'}
            </button>
          </div>
        </div>
      </div>

      <div className="user-profile__actions">
        <button type="button" className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
      </div>

      <h3 className="user-profile__section-title">Mes réservations</h3>
      <div className="user-profile__reservations">
        {reservations.length === 0 ? (
          <p>Aucune réservation pour le moment.</p>
        ) : (
          reservations.map(reservation => (
            <div key={reservation.id} className="user-profile__reservation">
              <div>
                <strong>Réf :</strong> {reservation.reference || reservation.id}
                {' - '}
                <strong>Date :</strong> {reservation.reservation_date}
              </div>
              <div><strong>Créneau :</strong> {reservation.time_slot_label}</div>

              <div className="user-profile__reservation-actions">
                {/* R162 : confirmation dans le DOM plutôt que window.confirm() */}
                {confirmDeleteId === reservation.id ? (
                  <>
                    <p className="confirm-message">Confirmer la suppression ?</p>
                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteReservation(reservation.id)}>Oui, supprimer</button>
                    <button type="button" className="btn btn-light"  onClick={() => setConfirmDeleteId(null)}>Annuler</button>
                  </>
                ) : (
                  <button type="button" className="btn btn-light" onClick={() => setConfirmDeleteId(reservation.id)}>
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showToast && (
        <div className="user-profile__toast">
          <p>{toastMessage}</p>
          <button 
            type="button" 
            className="user-profile__toast-close" 
            onClick={() => setShowToast(false)}
            aria-label="Fermer la notification"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}