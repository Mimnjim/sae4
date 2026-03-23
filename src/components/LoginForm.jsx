import { useState } from 'react';
import ButtonValidation from './ButtonValidation';

// Formulaire de connexion
// Props :
//   onSuccess → appelé après une connexion réussie (pour rediriger l'utilisateur)
//   setUser   → met à jour l'état global de l'utilisateur connecté
function LoginForm({ onSuccess, setUser }) {
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = () => {
    setIsLoading(true);
    setErrorMessage(''); // on efface l'erreur précédente à chaque nouvelle tentative

    fetch('https://apimusee.tomdelavigne.fr/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          setErrorMessage(data.message || 'Email ou mot de passe invalide');
          setIsLoading(false);
          return;
        }

        // On stocke le token JWT et les infos utilisateur pour les réutiliser partout
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoading(false);
        onSuccess();
      })
      .catch(() => {
        setErrorMessage('Erreur réseau — impossible de contacter le serveur.');
        setIsLoading(false);
      });
  };

  return (
    <div className="login-form">

      <div className="login-form__field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className="form-reservation__input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">Mot de passe</label>
        <div className="login-form__password-row">
          <input
            id="login-password"
            className="form-reservation__input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* Bouton pour afficher/masquer le mot de passe */}
          <button
            type="button"
            className="btn btn-light password-toggle"
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Cacher le mot de passe' : 'Voir le mot de passe'}
            onClick={() => setShowPassword(current => !current)}
          >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M2 2l20 20" />
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8a20.1 20.1 0 0 1 4.26-5.25" />
                  <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
          </button>
        </div>
      </div>

      {/* Indication que tous les champs doivent être remplis */}
      <p className="form-note" aria-hidden="false">Tous les champs sont obligatoires</p>

      {/* Message d'erreur affiché dans la page plutôt qu'une alert() navigateur */}
      {errorMessage && (
        <div className="form-error" role="alert">{errorMessage}</div>
      )}

      <ButtonValidation
        text={isLoading ? 'Connexion...' : 'Se connecter'}
        onClick={handleSubmit}
        disabled={isLoading || !email || !password}
      />

    </div>
  );
}

export default LoginForm;