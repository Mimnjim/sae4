import { useState } from 'react';
import ButtonValidation from './ButtonValidation';

// Formulaire d'inscription
// Props :
//   onSuccess → appelé après une inscription réussie (redirige vers la page de connexion)
function RegisterForm({ onSuccess }) {
  const [firstname,    setFirstname]    = useState('');
  const [lastname,     setLastname]     = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Le bouton est désactivé tant que tous les champs ne sont pas remplis
  const formIsComplete = Boolean(firstname && lastname && email && password);

  const handleSubmit = () => {
    setIsLoading(true);
    setErrorMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname }),
    })
      .then(res => res.json())
      .then(() => {
        setIsLoading(false);
        onSuccess(); // redirige vers la page de connexion
      })
      .catch(() => {
        // Affichage de l'erreur dans le DOM plutôt qu'une alert() navigateur
        setErrorMessage("Erreur lors de l'inscription. Vérifiez le serveur API.");
        setIsLoading(false);
      });
  };

  return (
    <div className="register-form">

      <div className="register-form__field">
        <label htmlFor="register-firstname">Prénom</label>
        <input
          id="register-firstname"
          className="form-reservation__input"
          type="text"
          value={firstname}
          onChange={e => setFirstname(e.target.value)}
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-lastname">Nom</label>
        <input
          id="register-lastname"
          className="form-reservation__input"
          type="text"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          className="form-reservation__input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-password">Mot de passe</label>
        <div className="register-form__password-row">
          <input
            id="register-password"
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

      {/* Message d'erreur affiché sous les champs si l'API renvoie une erreur */}
      {errorMessage && (
        <div className="form-error" role="alert">{errorMessage}</div>
      )}

      <ButtonValidation
        text={isLoading ? "Inscription en cours..." : "S'inscrire"}
        onClick={handleSubmit}
        disabled={isLoading || !formIsComplete}
      />

    </div>
  );
}

export default RegisterForm;