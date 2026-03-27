import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginForm from '../../components/connexion_components/LoginForm';
import '../../styles/components/connexion_components/login.css';

// Page de connexion
function Login({ setUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">{t('pages.login.title')}</h1>
        </div>
        <LoginForm onSuccess={() => navigate('/')} setUser={setUser} />

        {/* R204 : lien de réinitialisation du mot de passe */}
        <p><Link to="/reset-password">{t('pages.login.forgotPassword')}</Link></p>
      </div>

      <p><Link to="/register">{t('pages.login.noAccount')}</Link></p>
    </div>
  );
}

export default Login;