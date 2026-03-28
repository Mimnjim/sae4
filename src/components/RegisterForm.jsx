import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonValidation from './ButtonValidation';

// Évalue la force d'un mot de passe — retourne 0 (faible) à 3 (fort)
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))     score++;
  return score;
}

const STRENGTH_CLASSES = ['', 'weak', 'medium', 'strong', 'very-strong'];

export default function RegisterForm({ onSuccess }) {
  const [firstname,    setFirstname]    = useState('');
  const [lastname,     setLastname]     = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { t } = useTranslation();
  
  // Toujours sécuriser les traductions de tableaux pour éviter les crashs si la clé manque
  const strengthLabels = t('register.strength_labels', { returnObjects: true }) || ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  
  const formIsComplete = Boolean(firstname && lastname && email && password);
  const strengthScore = password ? getPasswordStrength(password) : 0;

  const handleSubmit = (e) => {
    // Essentiel : on bloque le rechargement de la page par le navigateur
    if (e) e.preventDefault();

    setIsLoading(true);
    setErrorMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          setErrorMessage(data.message || t('register.error_message') || "Erreur lors de l'inscription. Vérifiez les champs.");
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        onSuccess();
      })
      .catch(() => {
        setErrorMessage(t('login.network_error') || "Erreur réseau — impossible de contacter le serveur.");
        setIsLoading(false);
      });
  };

  return (
    // Transformation en vrai formulaire HTML5
    <form className="register-form" onSubmit={handleSubmit}>

      <div className="register-form__field">
        <label htmlFor="register-firstname">
          {t('form.first_name')} <span className="required" title="Obligatoire">*</span>
        </label>
        <input
          id="register-firstname"
          className="form-reservation__input"
          type="text"
          value={firstname}
          onChange={e => setFirstname(e.target.value)}
          required // Accessibilité native
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-lastname">
          {t('form.last_name')} <span className="required" title="Obligatoire">*</span>
        </label>
        <input
          id="register-lastname"
          className="form-reservation__input"
          type="text"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
          required
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-email">
          {t('form.email')} <span className="required" title="Obligatoire">*</span>
        </label>
        <input
          id="register-email"
          className="form-reservation__input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-password">
          {t('form.password') || 'Mot de passe'} <span className="required" title="Obligatoire">*</span>
        </label>
        
        {/* R203 : Énoncer les règles de sécurité explicitement avant la saisie */}
        <p className="form-note" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
          {t('register.password_rules') || '8 caractères minimum, dont 1 majuscule, 1 chiffre et 1 caractère spécial.'}
        </p>

        <div className="register-form__password-row">
          <input
            id="register-password"
            className="form-reservation__input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          <button
            type="button"
            className="btn btn-light password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* Texte caché pour lecteur d'écran */}
            <span className="sr-only">
              {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            </span>

            {/* SVG cachés avec aria-hidden */}
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

        {/* Jauge de force (ne s'affiche que si l'utilisateur a commencé à taper) */}
        {password && (
          <div className={`password-strength password-strength--${STRENGTH_CLASSES[strengthScore]}`}>
            <div className="password-strength__bar">
              {[1, 2, 3, 4].map(i => (
                <span
                  key={i}
                  className={`password-strength__segment ${i <= strengthScore ? 'active' : ''}`}
                />
              ))}
            </div>
            {/* Le label se met à jour en temps réel */}
            <p className="password-strength__label">{strengthLabels[strengthScore]}</p>
          </div>
        )}
      </div>

      <p className="form-note">{t('register.required_notice')}</p>
      
      <p className="form-note">{t('register.confirmation_notice')}</p>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <ButtonValidation
        text={isLoading ? t('register.loading') : t('register.submit')}
        onClick={handleSubmit}
        disabled={isLoading || !formIsComplete}
        type="submit" // On s'assure que le composant sait qu'il doit déclencher le submit !
      />

    </form>
  );
}