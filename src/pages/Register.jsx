import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/inscription_components/RegisterForm';
import '../styles/components/inscription_components/register.css';

// Page d'inscription
function Register() {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-card__header">
          <h1 className="register-card__title">Inscription</h1>
        </div>

        <RegisterForm onSuccess={() => navigate('/login')} />

        <p className="register-card__login-link">
          <Link to="/login">Déjà un compte ? Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;