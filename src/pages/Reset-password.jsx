import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ResetPasswordForm from '../components/ResetPasswordForm';
import '../styles/reset-password.css';

// Page de réinitialisation du mot de passe
function ResetPassword() {
  const { t } = useTranslation();

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-card__header">
          <h1 className="reset-password-card__title">{t('auth.resetPassword')}</h1>
          <p className="reset-password-card__subtitle">{t('auth.resetPasswordSubtitle')}</p>
        </div>

        <ResetPasswordForm />

        <p className="reset-password-container">
          <Link to="/login">{t('auth.backToLogin')}</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
