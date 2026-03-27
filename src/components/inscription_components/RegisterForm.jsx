import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonValidation from '../book_components/ButtonValidation';

// Évalue la force d'un mot de passe — retourne 0 (faible) à 3 (fort)
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;
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

  const formIsComplete = Boolean(firstname && lastname && email && password);

  // R203 : calcul de la force du mot de passe
  const strengthScore = password ? getPasswordStrength(password) : 0;

  const handleSubmit = () => {
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
          setErrorMessage(data.message || t('auth.registrationError'));
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
    <div className="register-form">

      <div className="register-form__field">
        {/* R71 : * indique champ obligatoire */}
        <label htmlFor="register-firstname">{t('form.firstName')} <span className="required">*</span></label>
        <input
          id="register-firstname"
          className="register-form__input"
          type="text"
          value={firstname}
          onChange={e => setFirstname(e.target.value)}
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-lastname">{t('form.lastName')} <span className="required">*</span></label>
        <input
          id="register-lastname"
          className="register-form__input"
          type="text"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-email">{t('form.email')} <span className="required">*</span></label>
        <input
          id="register-email"
          className="register-form__input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="register-form__field">
        <label htmlFor="register-password">{t('form.password')} <span className="required">*</span></label>
        <div className="register-form__password-row">
          <input
            id="register-password"
            className="register-form__input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* R76 : afficher/masquer le mot de passe */}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(current => !current)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M2 2l20 20" />
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8a20.1 20.1 0 0 1 4.26-5.25" />
                <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {/* R203 : indicateur de force du mot de passe */}
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
            <p className="password-strength__label">{STRENGTH_LABELS[strengthScore]}</p>
          </div>
        )}
      </div>

      {/* R71 : notice champs obligatoires */}
      <p className="form-note">{t('form.required')}</p>

      {/* R85 : message d'erreur dans le DOM */}
      {errorMessage && <p className="form-error">{errorMessage}</p>}

      {/* R18 : informer l'utilisateur qu'un email de confirmation sera envoyé */}
      <p className="form-note">{t('auth.confirmEmail')}</p>

      <ButtonValidation
        text={isLoading ? t('auth.registering') : t('auth.register')}
        onClick={handleSubmit}
        disabled={isLoading || !formIsComplete}
      />

    </div>
  );
}

export default RegisterForm;