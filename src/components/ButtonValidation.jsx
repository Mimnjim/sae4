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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-hidden="true" focusable="false">
          <path d="M7 17l10-10M11 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </span>
    </button>
  );
};

export default ButtonValidation;