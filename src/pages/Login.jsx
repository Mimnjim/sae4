import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/login.css';


// Page de connexion
function Login({ setUser }) {
  const navigate = useNavigate();

  // Après connexion réussie, rediriger vers la page d'accueil
  function handleSuccess() {
    navigate('/');
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">Connexion</h1>
        </div>
        <LoginForm onSuccess={handleSuccess} setUser={setUser} />
      </div>
      <p>
        <a href="/register">Pas de compte ? S'inscrire</a>
      </p>
    </div>
  );
}

export default Login;
