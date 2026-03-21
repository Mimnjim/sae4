import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Fonction de déconnexion
  function handleLogout() {
    localStorage.clear();
    setUser(null);
    navigate('/');
  }

  // Préparer les liens selon si l'utilisateur est connecté ou non
  let authLinks;
  if (user) {
    authLinks = (
      <>
        <Link to="/profile">{user.firstname}</Link>
        <button onClick={handleLogout}>Déconnexion</button>
      </>
    );
  } else {
    authLinks = (
      <>
        <Link to="/login">Connexion</Link>
        <Link to="/register">Inscription</Link>
      </>
    );
  }

  return (
    <div className="navbar">
      <div className="elements-nav">
        <Link to="/">Accueil</Link>
        <Link to="/experiences">Expériences</Link>
        <Link to="/form-reservation">Réserver</Link>
        <Link to="/info-pratique">Infos pratiques</Link>
        
        {authLinks}
      </div>
      
      <div className="language">
        <a href="#">FR</a> / <a href="#">EN</a>
      </div>
    </div>
  );
};

export default Navbar;