//Page de confirmation finale de réservation
import { Link } from 'react-router-dom';
import '../styles/validation.css';

const Validation = () => {
  return (
    <div className="validation-container">
      <h2>Votre réservation a été confirmée !</h2>
      <p>Merci d'avoir réservé avec nous. Nous avons hâte de vous accueillir !</p>
      <Link to="/" className="home-link">Retour à l'accueil</Link>
    </div>
  );
};

export default Validation;
