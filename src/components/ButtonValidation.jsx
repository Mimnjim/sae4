import { useNavigate } from 'react-router-dom';
import '../styles/validation.css';

// Bouton de validation réutilisable — gère à la fois une action (onClick)
// et/ou une navigation vers une autre page (navigateTo)
//
// Props :
//   text           → texte affiché dans le bouton
//   navigateTo     → route cible (ex: '/confirmation'), optionnel
//   navigationData → données passées à la page suivante via React Router (state)
//   disabled       → désactive le bouton si true
//   onClick        → fonction appelée au clic, avant la navigation
const ButtonValidation = ({ text, navigateTo, disabled, onClick, navigationData }) => {
  const navigate = useNavigate();

  // On exécute d'abord l'action (onClick) puis on navigue si une route est fournie
  const handleClick = () => {
    if (onClick) onClick();

    if (navigateTo) {
      // Si on a des données à transmettre, on les glisse dans le "state" de React Router
      // La page suivante pourra les lire avec useLocation().state
      if (navigationData) navigate(navigateTo, { state: navigationData });
      else navigate(navigateTo);
    }
  };

  return (
    <button
      type="button"
      className="validate-button"
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className="btn-text">{text}</span>

      {/* Élément décoratif (anneau + point) — aria-hidden pour ne pas le lire à voix haute */}
      <span className="btn-cursor" aria-hidden="true">
        <span className="ring" />
        <span className="dot" />
      </span>

      {/* Icône flèche — alt="" car purement décoratif, le texte du bouton suffit */}
      <span className="btn-icon" aria-hidden="true">
        <img src="/src/assets/icons/arrow-up-right.svg" alt="" />
      </span>
    </button>
  );
};

export default ButtonValidation;