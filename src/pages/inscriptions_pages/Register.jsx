import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RegisterForm from '../../components/inscription_components/RegisterForm';
import '../../styles/components/inscription_components/register.css';

// Page d'inscription
function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-card__header">
          <h1 className="register-card__title">{t('pages.register.title')}</h1>
        </div>

        <RegisterForm onSuccess={() => navigate('/login')} />

        <p className="register-card__login-link">
          <Link to="/login">{t('pages.register.hasAccount')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;