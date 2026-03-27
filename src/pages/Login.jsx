import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/login.css';

// Page de connexion
function Login({ setUser }) {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">Connexion</h1>
        </div>
        <LoginForm onSuccess={() => navigate('/')} setUser={setUser} />

        {/* R204 : lien de réinitialisation du mot de passe */}
        <p><Link to="/reset-password">Mot de passe oublié ?</Link></p>
      </div>

      <p><Link to="/register">Pas de compte ? S'inscrire</Link></p>
    </div>
  );
}

export default Login;