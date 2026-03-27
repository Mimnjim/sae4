import { useNavigate } from 'react-router-dom';
import '../styles/AuthPrompt.css';

const DEFAULT_MESSAGE = 'Vous devez être connecté pour réserver';

// Invite l'utilisateur non connecté à se connecter ou s'inscrire
export default function AuthPrompt({ message }) {
  const navigate = useNavigate();

  return (
    <div className="auth-prompt">
      <div className="auth-prompt__container">
        <h3 className="auth-prompt__title">
          {message || DEFAULT_MESSAGE}
        </h3>
        <p className="auth-prompt__desc">
          Connectez-vous ou créez un compte pour poursuivre.
        </p>
        <div className="auth-prompt__actions">
          <button
            className="auth-prompt__btn auth-prompt__btn--primary"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
          <button
            className="auth-prompt__btn auth-prompt__btn--secondary"
            onClick={() => navigate('/register')}
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}