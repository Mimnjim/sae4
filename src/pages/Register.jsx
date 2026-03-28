import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RegisterForm from '../components/RegisterForm';
import '../styles/register.css';

// Page d'inscription
function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-card__header">
          <h1 className="register-card__title">{t('register.title')}</h1>
        </div>

        <RegisterForm onSuccess={() => navigate('/login')} />

        <p className="register-card__login-link">
          <Link to="/login">{t('register.have_account')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;