import { useNavigate } from 'react-router-dom';
import '../styles/game-button.css';

function ButtonGame({ text, navigateTo }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(navigateTo);
  }

  return (
    <button className="game-button" onClick={handleClick}>
      {text}
    </button>
  );
}

export default ButtonGame;
