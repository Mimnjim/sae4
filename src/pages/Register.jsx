import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

// Page d'inscription
function Register() {
  const navigate = useNavigate();

  // Après inscription réussie, montrer la page d'information "vérifiez votre e-mail"
  function handleSuccess() {
    navigate('/register/sent');
  }

  return (
    <div>
      <h1>Inscription</h1>
      <RegisterForm onSuccess={handleSuccess} />
      <p>
        <a href="/login">Déjà un compte ? Se connecter</a>
      </p>
    </div>
  );
}

export default Register;
