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

    fetch('/sae4_api/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        // On stocke le token JWT et les infos utilisateur pour les réutiliser partout
        localStorage.setItem('jwt',  data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoading(false);
        onSuccess();
      })
      .catch(() => {
        // On affiche le message d'erreur dans le DOM plutôt qu'une alert()
        setErrorMessage('Erreur lors de la connexion. Vérifiez le serveur API.');
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
            className="btn btn-light"
            onClick={() => setShowPassword(current => !current)}
          >
            {showPassword ? 'Cacher' : 'Voir'}
          </button>
        </div>
      </div>

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