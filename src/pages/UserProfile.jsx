import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/user-profile.css';

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

export default function UserProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [reservations, setReservations] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // État du formulaire
  const [form, setForm] = useState({ 
    firstname: '', 
    lastname: '', 
    email: '', 
    password: '' 
  });

  useEffect(() => {
    const jwt = getJwt();
    if (!jwt) { 
      navigate('/login'); 
      return; 
    }

    // Récupération de l'utilisateur
    fetch('https://apimusee.tomdelavigne.fr/api/users.php', { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.user) { 
          setErrorMessage(t('profile.not_logged') || 'Non connecté'); 
          return; 
        }
        
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
      .then(list => { 
        if (list) setReservations(list); 
      })
      .catch(() => setErrorMessage(t('login.network_error') || 'Erreur réseau, veuillez réessayer.'))
      .finally(() => setIsLoading(false));
  }, [navigate, t]);

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
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          setSuccessMessage(t('profile.update_success') || 'Profil mis à jour !');
          // On vide le champ mot de passe par sécurité après modification
          setForm(prev => ({ ...prev, password: '' }));
        } else {
          setErrorMessage(data.message || 'Erreur lors de la mise à jour.');
        }
      })
      .catch(() => setErrorMessage(t('login.network_error') || 'Erreur réseau.'));
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
          setSuccessMessage(t('profile.delete_success') || 'Réservation supprimée.');
        } else {
          setErrorMessage(data.message || 'Erreur lors de la suppression.');
        }
      })
      .catch(() => setErrorMessage(t('login.network_error') || 'Erreur réseau.'))
      .finally(() => setConfirmDeleteId(null));
  };

  // Écrans de chargement et d'erreur
  if (isLoading) return <div className="user-profile__loading">{t('profile.loading') || 'Chargement...'}</div>;
  if (!user) return <div className="user-profile__error">{t('profile.not_logged') || 'Non connecté'}</div>;

  return (
    // <main> car c'est le contenu principal de cette page
    <main className="user-profile user-profile__container">
      
      {/* R234 : H1 obligatoire pour la page */}
      <h1>{t('profile.page_title') || 'Mon Espace'}</h1>

      {/* R85 : Messages de statut bien visibles */}
      {errorMessage && <p className="form-error" aria-live="assertive">{errorMessage}</p>}
      {successMessage && <p className="form-success" aria-live="polite">{successMessage}</p>}

      {/* ── Section Informations ── */}
      <section>
        <h2>{t('profile.info_title') || 'Mes informations'}</h2>
        
        {/* Transformation en vrai formulaire HTML5 */}
        <form className="user-profile__grid" onSubmit={handleSave}>
          <div className="form-group">
            <label className="user-label" htmlFor="user-firstname">{t('profile.firstname') || 'Prénom'}</label>
            <input id="user-firstname" className="user-input" type="text" name="firstname" value={form.firstname} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="user-label" htmlFor="user-lastname">{t('profile.lastname') || 'Nom'}</label>
            <input id="user-lastname" className="user-input" type="text" name="lastname" value={form.lastname} onChange={handleChange} required />
          </div>
          
          <div className="form-group form-group--full">
            <label className="user-label" htmlFor="user-email">{t('profile.email') || 'Email'}</label>
            <input id="user-email" className="user-input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group form-group--full">
            <label className="user-label" htmlFor="user-password">
              {t('profile.password_hint') || 'Nouveau mot de passe (laisser vide pour ne pas modifier)'}
            </label>
            <div className="user-profile__password-row">
              <input 
                id="user-password" 
                className="user-input" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                type={showPassword ? 'text' : 'password'} 
              />
              <button type="button" className="user-profile__password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {/* L'utilisation de texte brut est excellente pour l'accessibilité native ! */}
                {showPassword ? (t('profile.hide') || 'Masquer') : (t('profile.show') || 'Afficher')}
              </button>
            </div>
          </div>

          <div className="user-profile__actions form-group--full">
            {/* type="submit" pour valider avec la touche Entrée */}
            <button type="submit" className="btn btn-primary">{t('profile.save') || 'Enregistrer'}</button>
          </div>
        </form>
      </section>

      {/* ── Section Réservations ── */}
      <section style={{ marginTop: '3rem' }}>
        <h2 className="user-profile__section-title">{t('profile.reservations_title') || 'Mes réservations'}</h2>
        
        {reservations.length === 0 ? (
          <p>{t('profile.no_reservations') || "Vous n'avez aucune réservation en cours."}</p>
        ) : (
          // Sémantique : Une liste de données doit être un <ul> !
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
                      {/* R162 : Confirmation "in-place" */}
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

    </main>
  );
}