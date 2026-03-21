import { useNavigate } from 'react-router-dom';
import '../styles/AuthPrompt.css';

// Message affiché par défaut si le parent n'en passe pas un via la prop "message"
const DEFAULT_MESSAGE = 'Vous devez être connecté pour réserver';

// Ce composant s'affiche quand un utilisateur non connecté essaie de faire une action réservée
// Il reçoit une prop "message" optionnelle pour personnaliser le titre
export default function AuthPrompt({ message }) {
  // useNavigate permet de changer de page sans recharger (navigation React Router)
  const navigate = useNavigate();

  return (
    <div className="auth-prompt">
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
  );
}