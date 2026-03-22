import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/user-profile.css';

// ─── Fonctions utilitaires ────────────────────────────────────────────────────

// Récupère le JWT stocké au moment de la connexion
// On vérifie les deux clés possibles pour la compatibilité
function getJwt() {
  return localStorage.getItem('jwt') || localStorage.getItem('token');
}

// Construit les headers d'authentification communs à tous les appels API
function getAuthHeaders(extraHeaders = {}) {
  const jwt = getJwt();
  return {
    'Authorization':   `Bearer ${jwt}`,
    'X-Authorization': `Bearer ${jwt}`,
    ...extraHeaders,
  };
}

// ─── Composant ────────────────────────────────────────────────────────────────

// Page de profil : modification des infos personnelles + liste des réservations
export default function UserProfile() {
  const navigate = useNavigate();

  const [user,           setUser]           = useState(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [showPassword,   setShowPassword]   = useState(false);
  const [errorMessage,   setErrorMessage]   = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reservations,   setReservations]   = useState([]);

  // Champs du formulaire de modification du profil
  const [form, setForm] = useState({
    firstname: '',
    lastname:  '',
    email:     '',
    password:  '',
  });

  // Chargement du profil et des réservations au montage du composant
  useEffect(() => {
    const jwt = getJwt();

    // Si pas de JWT, l'utilisateur n'est pas connecté → on le redirige
    if (!jwt) {
      navigate('/login');
      return;
    }

    fetch('https://apimusee.tomdelavigne.fr/api/users.php', { headers: getAuthHeaders() })
      .then(response => response.json())
      .then(data => {
        if (!data.success || !data.user) {
          setErrorMessage('Impossible de charger le profil.');
          return;
        }

        const fetchedUser = data.user;
        setUser(fetchedUser);
        setForm({
          firstname: fetchedUser.firstname || '',
          lastname:  fetchedUser.lastname  || '',
          email:     fetchedUser.email     || '',
          password:  '',
        });

        // On enchaîne le fetch des réservations une fois qu'on a l'id utilisateur
        return fetch(`https://apimusee.tomdelavigne.fr/api/reservations.php?user_id=${fetchedUser.id}`, {
          headers: getAuthHeaders(),
        });
      })
      .then(response => response?.json())
      .then(list => { if (list) setReservations(list); })
      .catch(() => setErrorMessage('Erreur réseau, veuillez réessayer.'))
      .finally(() => setIsLoading(false));
  }, []);

  // Met à jour un seul champ du formulaire sans écraser les autres
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Envoie les modifications du profil à l'API
  const handleSave = () => {
    setErrorMessage('');
    setSuccessMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/users.php', {
      method:  'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body:    JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          // On met à jour le localStorage pour que le reste de l'app soit cohérent
          localStorage.setItem('user', JSON.stringify(data.user));
          setSuccessMessage('Profil mis à jour avec succès.');
        } else {
          setErrorMessage(data.message || 'Erreur lors de la mise à jour.');
        }
      })
      .catch(() => setErrorMessage('Erreur réseau, veuillez réessayer.'));
  };

  // Supprime une réservation après confirmation
  const handleDeleteReservation = (reservationId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette réservation ?')) return;

    fetch(`https://apimusee.tomdelavigne.fr/api/reservations.php?id=${reservationId}`, {
      method:  'DELETE',
      headers: getAuthHeaders(),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Retire la réservation supprimée de la liste sans recharger l'API
          setReservations(prev => prev.filter(r => r.id !== reservationId));
          setSuccessMessage('Réservation supprimée.');
        } else {
          setErrorMessage(data.message || 'Erreur lors de la suppression.');
        }
      })
      .catch(() => setErrorMessage('Erreur réseau, veuillez réessayer.'));
  };

  // ─── Rendus conditionnels ────────────────────────────────────────────────────

  if (isLoading) return <div className="user-profile__loading">Chargement...</div>;
  if (!user)     return <div className="user-profile__error">Utilisateur non connecté.</div>;

  // ─── Rendu principal ─────────────────────────────────────────────────────────

  return (
    <div className="user-profile user-profile__container">
      <h2>Mon profil</h2>

      {/* Messages de retour (erreur ou succès) affichés dans le DOM, pas en alert() */}
      {errorMessage   && <div className="form-error"   role="alert">{errorMessage}</div>}
      {successMessage && <div className="form-success" role="status">{successMessage}</div>}

      <div className="user-profile__grid">
        <div className="form-group">
          <label className="user-label" htmlFor="user-firstname">Prénom</label>
          <input
            id="user-firstname"
            className="user-input"
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="user-label" htmlFor="user-lastname">Nom</label>
          <input
            id="user-lastname"
            className="user-input"
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group--full">
          <label className="user-label" htmlFor="user-email">Email</label>
          <input
            id="user-email"
            className="user-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group--full">
          <label className="user-label" htmlFor="user-password">
            Nouveau mot de passe (laisser vide pour ne pas changer)
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
            {/* Bouton pour afficher/masquer le mot de passe */}
            <button
              type="button"
              className="user-profile__password-toggle"
              onClick={() => setShowPassword(current => !current)}
            >
              {showPassword ? 'Cacher' : 'Voir'}
            </button>
          </div>
        </div>
      </div>

      <div className="user-profile__actions">
        <button className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
      </div>

      {/* Liste des réservations */}
      <h3 className="user-profile__section-title">Mes réservations</h3>
      <div className="user-profile__reservations">
        {reservations.length === 0 ? (
          <p>Aucune réservation pour le moment.</p>
        ) : (
          reservations.map(reservation => (
            <div key={reservation.id} className="user-profile__reservation">
              <div>
                <strong>Réf :</strong> {reservation.reference || reservation.id}
                {' — '}
                <strong>Date :</strong> {reservation.reservation_date}
              </div>
              <div>
                <strong>Créneau :</strong> {reservation.time_slot_label}
              </div>
              <div className="user-profile__reservation-actions">
                <button
                  className="btn btn-light"
                  onClick={() => handleDeleteReservation(reservation.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}