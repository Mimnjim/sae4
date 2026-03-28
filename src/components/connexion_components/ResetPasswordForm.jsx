import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// R203 : Évalue la force d'un mot de passe — retourne 0 (faible) à 4 (très fort)
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;
  return score;
}

// Formulaire de réinitialisation du mot de passe
function ResetPasswordForm() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const STRENGTH_LABELS = ['', t('auth.weak'), t('auth.medium'), t('auth.strong'), t('auth.veryStrong')];
  const STRENGTH_CLASSES = ['', 'weak', 'medium', 'strong', 'very-strong'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState(token ? 'reset' : 'request'); // 'request' ou 'reset'

  // R203 : calcul de la force du mot de passe
  const strengthScore = password ? getPasswordStrength(password) : 0;

  // Étape 1 : Demander l'email
  const handleRequestReset = () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/request-reset.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          setErrorMessage(data.message || t('auth.resetEmailError'));
          setIsLoading(false);
          return;
        }
        setSuccessMessage(t('auth.resetEmailSent'));
        setEmail('');
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage(t('auth.networkError'));
        setIsLoading(false);
      });
  };

  // Étape 2 : Réinitialiser le mot de passe avec le token
  const handleResetPassword = () => {
    if (password !== confirmPassword) {
      setErrorMessage(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setErrorMessage(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    fetch('https://apimusee.tomdelavigne.fr/api/reset-password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          setErrorMessage(data.message || t('auth.resetError'));
          setIsLoading(false);
          return;
        }
        setSuccessMessage(t('auth.passwordResetSuccess'));
        setPassword('');
        setConfirmPassword('');
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage(t('auth.networkError'));
        setIsLoading(false);
      });
  };

  // Étape 1 : Demander l'email pour envoyer le lien
  if (step === 'request') {
    return (
      <div className="reset-password-form">
        <div className="reset-password-form__field">
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            className="reset-password-form__input"
            type="email"
            placeholder={t('form.emailPlaceholder')}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* R185 : Messages d'erreur accessibles au lecteur d'écran */}
        {errorMessage && <p className="reset-password-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="reset-password-success" role="status" aria-live="polite">{successMessage}</p>}

        <p className="reset-password-note">{t('auth.resetInstructions')}</p>

        <div className="reset-password-form__actions">
          <button
            className="reset-password-btn"
            onClick={handleRequestReset}
            disabled={isLoading || !email}
          >
            {isLoading ? t('auth.sending') : t('auth.sendResetLink')}
          </button>
        </div>
      </div>
    );
  }

  // Étape 2 : Formulaire de réinitialisation avec token
  return (
    <div className="reset-password-form">
      <div className="reset-password-form__field">
        <label htmlFor="new-password">{t('form.newPassword')}</label>
        <div className="reset-password-form__password-row">
          <input
            id="new-password"
            className="reset-password-form__input"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('form.passwordPlaceholder')}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
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

        {/* R203 : Indicateur de force du mot de passe */}
        {password && (
          <div className={`password-strength password-strength--${STRENGTH_CLASSES[strengthScore]}`} role="status" aria-live="polite">
            <div className="password-strength__bar" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`password-strength__segment ${i < strengthScore ? 'active' : ''}`}
                  aria-label={`Segments de force: ${strengthScore} sur 4`}
                />
              ))}
            </div>
            <p className="password-strength__label">{STRENGTH_LABELS[strengthScore]}</p>
          </div>
        )}
      </div>

      <div className="reset-password-form__field">
        <label htmlFor="confirm-password">{t('form.confirmPassword')}</label>
        <div className="reset-password-form__password-row">
          <input
            id="confirm-password"
            className="reset-password-form__input"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('form.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
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

      {/* R185 : Messages d'erreur accessibles au lecteur d'écran */}
      {errorMessage && <p className="reset-password-error" role="alert">{errorMessage}</p>}
      {successMessage && <p className="reset-password-success" role="status" aria-live="polite">{successMessage}</p>}

      <div className="reset-password-form__actions">
        <button
          className="reset-password-btn"
          onClick={handleResetPassword}
          disabled={isLoading || !password || !confirmPassword}
        >
          {isLoading ? t('auth.updating') : t('auth.updatePassword')}
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
