import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonValidation from './ButtonValidation';

// Formulaire de connexion
export default function LoginForm({ onSuccess, setUser }) {
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { t } = useTranslation();

  const handleSubmit = (e) => {
    // Si appelé via le bouton type="submit", on évite le rechargement de la page
    if (e) e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          // R85 : Un message clair est envoyé au DOM en cas d'erreur
          setErrorMessage(data.message || t('login.invalid_credentials') || 'Email ou mot de passe invalide');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoading(false);
        onSuccess();
      })
      .catch(() => {
        setErrorMessage(t('login.network_error') || 'Erreur réseau');
        setIsLoading(false);
      });
  };

  return (
    // R166 : Remplacer la div par un form permet la validation avec la touche "Entrée" !
    <form className="login-form" onSubmit={handleSubmit}>

      <div className="login-form__field">
        {/* R69 + R71 : Label explicite et champ obligatoire */}
        <label htmlFor="login-email">
          {t('form.email')} <span className="required" title="Obligatoire">*</span>
        </label>
        <input
          id="login-email"
          className="form-reservation__input"
          type="email" // R95 : Le bon type HTML5 !
          value={email}
          onChange={e => setEmail(e.target.value)}
          required // Attribut HTML5 natif au lieu de aria-required
        />
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">
          {t('form.password') || 'Mot de passe'} <span className="required" title="Obligatoire">*</span>
        </label>
        
        <div className="login-form__password-row">
          <input
            id="login-password"
            className="form-reservation__input"
            type={showPassword ? 'text' : 'password'} // R76 : Affichage en clair
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          {/* R76 : Bouton d'affichage du mot de passe */}
          <button
            type="button" // Très important dans un <form> pour ne pas le soumettre !
            className="btn btn-light password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* R185 : Le texte pour les lecteurs d'écran (Sans ARIA !) */}
            <span className="sr-only">
              {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            </span>
            
            {showPassword ? (
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M2 2l20 20" />
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8a20.1 20.1 0 0 1 4.26-5.25" />
                <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
              </svg>
            ) : (
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <p className="form-note">{t('login.all_required')}</p>

      {/* R85 : Message d'erreur */}
      {errorMessage && <p className="form-error">{errorMessage}</p>}

      {/* On peut garder ton ButtonValidation s'il supporte type="submit" */}
      <ButtonValidation
        text={isLoading ? t('login.loading') : t('login.submit')}
        onClick={handleSubmit}
        disabled={isLoading || !email || !password}
        type="submit" // Assure-toi que ButtonValidation accepte cette prop !
      />

    </form>
  );
}