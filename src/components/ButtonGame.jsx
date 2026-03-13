import { useNavigate } from 'react-router-dom';
import '../styles/game-button.css';

const ButtonGame = ({ text, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <button className="game-button" onClick={handleClick}>
      {text}
    </button>
  );
};

export default ButtonGame;
