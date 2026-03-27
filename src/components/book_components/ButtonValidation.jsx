import { useNavigate } from 'react-router-dom';
import '../../styles/components/book_components/validation.css';

// Bouton réutilisable : action + navigation optionnelle
const ButtonValidation = ({ text, navigateTo, disabled, onClick, navigationData }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (navigateTo) {
      navigate(navigateTo, navigationData ? { state: navigationData } : undefined);
    }
  };

  return (
    <button
      type="button"
      className="validate-button"
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="btn-text">{text}</span>

      {/* Éléments décoratifs */}
      <span className="btn-cursor">
        <span className="ring" />
        <span className="dot" />
      </span>

      <span className="btn-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" focusable="false">
          <path d="M7 17l10-10M11 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </span>
    </button>
  );
};

export default ButtonValidation;
