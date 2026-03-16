import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

// Page de connexion
function Login({ setUser }) {
  const navigate = useNavigate();

  // Après connexion réussie, rediriger vers la page d'accueil
  function handleSuccess() {
    navigate('/');
  }

  return (
    <div>
      <h1>Connexion</h1>
      <LoginForm onSuccess={handleSuccess} setUser={setUser} />
      <p>
        <a href="/register">Pas de compte ? S'inscrire</a>
      </p>
    </div>
  );
}

export default Login;
