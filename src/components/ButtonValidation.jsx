import { useNavigate } from 'react-router-dom';
import '../styles/validation.css';

const ButtonValidation = ({ text, navigateTo, disabled, onClick, navigationData }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    if (navigateTo) {
      if (navigationData) {
        navigate(navigateTo, { state: navigationData });
      } else {
        navigate(navigateTo);
      }
    }
  };

  return (
    <button 
      className="validate-button" 
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default ButtonValidation;
