import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonValidation from '../book_components/ButtonValidation';

// Formulaire de connexion
function LoginForm({ onSuccess, setUser }) {
  const { t } = useTranslation();
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // R28 : Données sensibles transmises via POST (pas dans l'URL)
  const handleSubmit = () => {
    setIsLoading(true);
    setErrorMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // R28 : Body contient les données sensibles
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          // R26 : Message générique pour ne pas exposer l'existence du compte
          setErrorMessage(t('auth.invalidCredentials') || 'Vérifiez vos identifiants');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('jwt', data.token);
        
        // Fetch complete user data to get role and other fields
        const headers = {
          'Authorization': `Bearer ${data.token}`,
          'X-Authorization': `Bearer ${data.token}`,
        };
        return fetch('https://apimusee.tomdelavigne.fr/api/users.php', { headers })
          .then(r => r.json())
          .then(userData => {
            const completeUser = userData.user || data.user;
            localStorage.setItem('user', JSON.stringify(completeUser));
            setUser(completeUser);
            setIsLoading(false);
            onSuccess();
          });
      })
      .catch(() => {
        setErrorMessage(t('auth.networkError'));
        setIsLoading(false);
      });
  };

  return (
    <div className="login-form">

      {/* R69 : Étiquette associée à chaque champ */}
      <div className="login-form__field">
        {/* R71 : * indique champ obligatoire */}
        <label htmlFor="login-email">{t('form.email')} <span className="required" aria-label="obligatoire">*</span></label>
        {/* R95 : type="email" approprié */}
        <input
          id="login-email"
          className="login-form__input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-required="true"
        />
      </div>

      {/* R69 : Étiquette associée à chaque champ */}
      <div className="login-form__field">
        {/* R71 : * indique champ obligatoire */}
        <label htmlFor="login-password">{t('form.password')} <span className="required" aria-label="obligatoire">*</span></label>
        <div className="login-form__password-row">
          {/* R95 : type dynamique selon showPassword */}
          <input
            id="login-password"
            className="login-form__input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-required="true"
          />
          {/* R76 : Afficher/masquer le mot de passe */}
          {/* R116/R185 : SVG décoratives avec aria-label et aria-hidden */}
          {/* R165 : Focus clavier sur le bouton */}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(current => !current)}
            aria-label={showPassword ? t('form.hidePassword') || 'Masquer le mot de passe' : t('form.showPassword') || 'Afficher le mot de passe'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true">
                <path d="M2 2l20 20" />
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8a20.1 20.1 0 0 1 4.26-5.25" />
                <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* R71 : Notice indiquant les champs obligatoires */}
      <p className="form-note">{t('form.required')}</p>

      {/* R85 : Message d'erreur affiché après soumission */}
      {/* R185 : Accessible au lecteur d'écran */}
      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

      <ButtonValidation
        text={isLoading ? t('auth.logging') : t('auth.login')}
        onClick={handleSubmit}
        disabled={isLoading || !email || !password}
      />

    </div>
  );
}
export default LoginForm;