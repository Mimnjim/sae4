import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/components/connexion_components/AuthPrompt.css';

// Invite l'utilisateur non connecté à se connecter ou s'inscrire
export default function AuthPrompt({ message }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="auth-prompt">
      <div className="auth-prompt__container">
        <h3 className="auth-prompt__title">
          {message || t('auth.requiresLogin')}
        </h3>
        <p className="auth-prompt__desc">
          {t('auth.loginOrRegister')}
        </p>
        <div className="auth-prompt__actions">
          <button
            className="auth-prompt__btn auth-prompt__btn--primary"
            onClick={() => navigate('/login')}
          >
            {t('auth.login')}
          </button>
          <button
            className="auth-prompt__btn auth-prompt__btn--secondary"
            onClick={() => navigate('/register')}
          >
            {t('auth.register')}
          </button>
        </div>
      </div>
    </div>
  );
}