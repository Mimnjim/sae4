import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import '../styles/register.css';


// Page d'inscription
function Register() {
  const navigate = useNavigate();

  // Après inscription réussie, montrer la page d'information "vérifiez votre e-mail"
  function handleSuccess() {
    navigate('/register/sent');
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-card__header">
          <h1 className="register-card__title">Inscription</h1>
        </div>

        <RegisterForm onSuccess={handleSuccess} />

        <p style={{ marginTop: '12px', textAlign: 'center' }}>
          <a href="/login">Déjà un compte ? Se connecter</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
