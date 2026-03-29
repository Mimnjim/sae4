import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonValidation from '../book_components/ButtonValidation';

// R203 : Évalue la force d'un mot de passe — retourne 0 (faible) à 3 (fort)
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))     score++;
  return score;
}

// Formulaire d'inscription
function RegisterForm({ onSuccess }) {
  const { t } = useTranslation();
  const STRENGTH_LABELS = ['', t('auth.weak'), t('auth.medium'), t('auth.strong'), t('auth.veryStrong')];
  const STRENGTH_CLASSES = ['', 'weak', 'medium', 'strong', 'very-strong'];
  const [firstname,    setFirstname]    = useState('');
  const [lastname,     setLastname]     = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Toujours sécuriser les traductions de tableaux pour éviter les crashs si la clé manque
  const strengthLabels = t('register.strength_labels', { returnObjects: true }) || ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  
  const formIsComplete = Boolean(firstname && lastname && email && password);
  const strengthScore = password ? getPasswordStrength(password) : 0;

  // R28 : Données sensibles transmises via POST (pas en clair dans URL)
  const handleSubmit = () => {
    setIsLoading(true);
    setErrorMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // R28 : body contient les données sensibles (pas dans URL)
      body: JSON.stringify({ email, password, firstname, lastname }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          // R26 : Message générique pour ne pas exposer l'existence d'un compte
          const genericMessage = t('auth.registrationError') || 'Une erreur est survenue';
          setErrorMessage(data.message === 'Email déjà utilisé' ? genericMessage : (data.message || genericMessage));
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        onSuccess();
      })
      .catch(() => {
        setErrorMessage(t('auth.networkErrorContact'));
        setIsLoading(false);
      });
  };

  return (
    // Transformation en vrai formulaire HTML5
    <form className="register-form" onSubmit={handleSubmit}>

      {/* R69 : Étiquette associée à chaque champ */}
      <div className="register-form__field">
        {/* R71 : * indique champ obligatoire */}
        <label htmlFor="register-firstname">{t('form.firstName')} <span className="required" aria-label="obligatoire">*</span></label>
        {/* R95 : type="text" approprié pour prénom */}
        <input
          id="register-firstname"
          className="register-form__input"
          type="text"
          value={firstname}
          onChange={e => setFirstname(e.target.value)}
          aria-required="true"
        />
      </div>

      {/* R69 : Étiquette associée à chaque champ */}
      <div className="register-form__field">
        {/* R71 : * indique champ obligatoire */}
        <label htmlFor="register-lastname">{t('form.lastName')} <span className="required" aria-label="obligatoire">*</span></label>
        {/* R95 : type="text" approprié pour nom */}
        <input
          id="register-lastname"
          className="register-form__input"
          type="text"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
          aria-required="true"
        />
      </div>

      {/* R69 : Étiquette associée à chaque champ */}
      <div className="register-form__field">
        {/* R71 : * indique champ obligatoire */}
        <label htmlFor="register-email">{t('form.email')} <span className="required" aria-label="obligatoire">*</span></label>
        {/* R95 : type="email" approprié pour adresse email */}
        <input
          id="register-email"
          className="register-form__input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-required="true"
        />
      </div>

      {/* R69 : Étiquette associée à chaque champ */}
      <div className="register-form__field">
        {/* R71 : * indique champ obligatoire */}
        <label htmlFor="register-password">{t('form.password')} <span className="required" aria-label="obligatoire">*</span></label>
        <div className="register-form__password-row">
          {/* R95 : type dynamique pour password ou text selon showPassword */}
          <input
            id="register-password"
            className="register-form__input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-required="true"
          />
          {/* R76 : Afficher/masquer le mot de passe */}
          {/* R116 : SVG décoratives avec aria-label et focusable="false" */}
          {/* R185 : Contenu accessible au lecteur d'écran via aria-label */}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(current => !current)}
            aria-label={showPassword ? t('form.hidePassword') || 'Masquer le mot de passe' : t('form.showPassword') || 'Afficher le mot de passe'}
            aria-pressed={showPassword}
          >
            {/* Texte caché pour lecteur d'écran */}
            <span className="sr-only">
              {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            </span>

            {/* SVG cachés avec aria-hidden */}
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

        {/* R203 : Indicateur de force du mot de passe */}
        {/* R185 : Accessible au lecteur d'écran */}
        {password && (
          <div className={`password-strength password-strength--${STRENGTH_CLASSES[strengthScore]}`} role="status" aria-live="polite">
            <div className="password-strength__bar" aria-hidden="true">
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

      {/* R71 : Notice indiquant les champs obligatoires */}
      <p className="form-note">{t('form.required')}</p>

      {/* R85 : Message d'erreur affiché dans le DOM après soumission */}
      {/* R185 : Message d'erreur accessible */}
      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

      {/* R18 : Information sur le processus de confirmation par email */}
      <p className="form-note">{t('auth.confirmEmail')}</p>

      <ButtonValidation
        text={isLoading ? t('auth.registering') : t('auth.register')}
        onClick={handleSubmit}
        disabled={isLoading || !formIsComplete}
        type="submit" // On s'assure que le composant sait qu'il doit déclencher le submit !
      />

    </form>
  );
}