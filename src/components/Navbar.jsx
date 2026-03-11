import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="elements-nav">
        <Link to="/">Accueil</Link>
        <Link to="/experiences">Expériences</Link>
        <Link to="/calendrier">Réserver</Link>
        <Link to="/info-pratique">Infos pratiques</Link>
      </div>
      
      <div className="language">
        <a href="#">FR</a> / <a href="#">EN</a>
      </div>
    </div>
  );
};

export default Navbar;