import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/components/connexion_components/user-profile.css';

// Fonctions utilitaires sorties du composant pour plus de clarté
function getJwt() {
  return localStorage.getItem('jwt') || localStorage.getItem('token');
}

function getAuthHeaders(extraHeaders = {}) {
  const jwt = getJwt();
  return {
    'Authorization': `Bearer ${jwt}`,
    'X-Authorization': `Bearer ${jwt}`,
    ...extraHeaders,
  };
}

export default function UserProfile({ user: propUser = null, setUser: propSetUser = null }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user,           setUser]           = useState(propUser);
  const [isLoading,      setIsLoading]      = useState(!propUser);  // Si propUser existe, pas besoin de charger
  const [showPassword,   setShowPassword]   = useState(false);
  const [errorMessage,   setErrorMessage]   = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [reservations, setReservations] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toastMessage,   setToastMessage]   = useState('');
  const [showToast,      setShowToast]      = useState(false);

  const [form, setForm] = useState(propUser ? { firstname: propUser.firstname || '', lastname: propUser.lastname || '', email: propUser.email || '', password: '' } : { firstname: '', lastname: '', email: '', password: '' });

  // Utiliser setUser du prop si disponible, sinon utiliser l'état local
  const updateUser = propSetUser || setUser;

  useEffect(() => {
    const jwt = getJwt();
    if (!jwt) { 
      navigate('/login'); 
      return; 
    }

    // Toujours charger l'utilisateur depuis l'API pour obtenir les données complètes incluant le rôle
    fetch('https://apimusee.tomdelavigne.fr/api/users.php', { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.user) { setErrorMessage(t('profile.loadError')); return; }
        const fetchedUser = data.user;
        setUser(fetchedUser);
        
        // Pré-remplissage du formulaire
        setForm({ 
          firstname: fetchedUser.firstname || '', 
          lastname: fetchedUser.lastname || '', 
          email: fetchedUser.email || '', 
          password: '' 
        });
        
        // Enchaînement : récupération des réservations
        return fetch(`https://apimusee.tomdelavigne.fr/api/reservations.php?user_id=${fetchedUser.id}`, { headers: getAuthHeaders() });
      })
      .then(r => r?.json())
      .then(list => { if (list) setReservations(list); })
      .catch(() => setErrorMessage(t('profile.networkError')))
      .finally(() => setIsLoading(false));
  }, [propUser]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    // Essentiel dans un vrai <form>
    if (e) e.preventDefault();
    
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
          updateUser(data.user);  // Utiliser updateUser qui peut être propSetUser ou setUser local
          localStorage.setItem('user', JSON.stringify(data.user));
          setSuccessMessage(t('profile.updateSuccess'));
        } else {
          setErrorMessage(data.message || t('profile.updateError'));
        }
      })
      .catch(() => setErrorMessage(t('profile.networkError')));
  };

  const handleDeleteReservation = (reservationId) => {
    fetch(`https://apimusee.tomdelavigne.fr/api/reservations.php?id=${reservationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Mise à jour de l'affichage en supprimant la résa de la liste locale
          setReservations(prev => prev.filter(r => r.id !== reservationId));
          setToastMessage(t('profile.reservationDeleted'));
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } else {
          setErrorMessage(data.message || t('profile.deleteError'));
        }
      })
      .catch(() => setErrorMessage(t('profile.networkError')))
      .finally(() => setConfirmDeleteId(null));
  };

  const handleLogout = () => {
    localStorage.clear();
    updateUser(null);  // Met à jour le state App.jsx
    navigate('/');
  };

  if (isLoading) return <div className="user-profile__loading">{t('profile.loading')}</div>;
  if (!user)     return <div className="user-profile__error">{t('profile.notConnected')}</div>;

  return (
    <div className="user-profile user-profile__container">
      <div className="user-profile__header">
        <div className="user-profile__title-section">
          <h2>{t('profile.myProfile')}</h2>
        </div>
        <div className="user-profile__logout-section">
          {/* R234 : Titre hiérarchisé et accessible */}
          {/* Affiche le bouton dashboard si l'utilisateur est admin */}
          {user?.role === 'admin' && (
            <Link to="/backoffice" className="btn btn-primary" aria-label={t('profile.dashboard') || 'Aller au tableau de bord administrateur'}>
              {t('profile.dashboard')}
            </Link>
          )}
          <button type="button" className="btn btn-danger" onClick={handleLogout}>{t('profile.logout')}</button>
        </div>
      </div>

      {/* R85 : messages d'erreur et succès dans le DOM avec rôles accessibilité */}
      {errorMessage   && <p className="form-error" role="alert">{errorMessage}</p>}
      {successMessage && <p className="form-success" role="status" aria-live="polite">{successMessage}</p>}

      <div className="user-profile__grid">
        <div className="form-group">
          <label className="user-label" htmlFor="user-firstname">{t('form.firstName')}</label>
          <input id="user-firstname" className="user-input" type="text" name="firstname" value={form.firstname} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="user-label" htmlFor="user-lastname">{t('form.lastName')}</label>
          <input id="user-lastname" className="user-input" type="text" name="lastname" value={form.lastname} onChange={handleChange} />
        </div>
        <div className="form-group form-group--full">
          <label className="user-label" htmlFor="user-email">{t('form.email')}</label>
          <input id="user-email" className="user-input" type="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group form-group--full">
          <label className="user-label" htmlFor="user-password">
            {t('profile.newPassword')}
          </label>
          <div className="user-profile__password-row">
            <input id="user-password" className="user-input" name="password" value={form.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} />
            {/* R76 : afficher/masquer le mot de passe */}
            <button type="button" className="user-profile__password-toggle" onClick={() => setShowPassword(c => !c)}>
              {showPassword ? t('profile.hide') : t('profile.show')}
            </button>
          </div>
        </div>
      </div>

      <div className="user-profile__actions">
        <button type="button" className="btn btn-primary" onClick={handleSave}>{t('profile.save')}</button>
      </div>

      <section style={{ marginTop: '3rem' }}>
        <h2 className="user-profile__section-title">{t('profile.reservations_title') || 'Mes réservations'}</h2>
        
        {reservations.length === 0 ? (
          <p>{t('profile.no_reservations') || "Vous n'avez aucune réservation en cours."}</p>
        ) : (
          <ul className="user-profile__reservations" style={{ listStyle: 'none', padding: 0 }}>
            {reservations.map(reservation => (
              <li key={reservation.id} className="user-profile__reservation">
                <div>
                  <strong>{t('profile.reference') || 'Réf'} :</strong> {reservation.reference || reservation.id}
                  <br />
                  <strong>{t('form.date') || 'Date'} :</strong> {reservation.reservation_date}
                </div>
                
                <div>
                  <strong>{t('profile.slot') || 'Créneau'} :</strong> {reservation.time_slot_label}
                </div>

                <div className="user-profile__reservation-actions">
                  {confirmDeleteId === reservation.id ? (
                    <>
                      <p className="confirm-message" style={{ margin: '0 10px 0 0', fontWeight: 'bold' }}>
                        {t('profile.delete_confirm') || 'Êtes-vous sûr ?'}
                      </p>
                      <button type="button" className="btn btn-danger" onClick={() => handleDeleteReservation(reservation.id)}>
                        {t('profile.yes_delete') || 'Oui'}
                      </button>
                      <button type="button" className="btn btn-light" onClick={() => setConfirmDeleteId(null)}>
                        {t('profile.cancel') || 'Annuler'}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-light" onClick={() => setConfirmDeleteId(reservation.id)}>
                      {t('profile.delete') || 'Annuler cette réservation'}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showToast && (
        <div className="user-profile__toast">
          <p>{toastMessage}</p>
          <button 
            type="button" 
            className="user-profile__toast-close" 
            onClick={() => setShowToast(false)}
            aria-label={t('profile.closeNotification')}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}