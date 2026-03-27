import { useNavigate } from 'react-router-dom';
import '../../styles/components/experiences_components/game-button.css';

const ButtonGame = ({ text, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <button className="game-button" onClick={() => navigate(navigateTo)}>
      {text}
    </button>
  );
};

export default ButtonGame;