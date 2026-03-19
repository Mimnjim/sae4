import { Link } from 'react-router-dom';
import { ArrowUpRightStroke } from '@boxicons/react';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="elements-nav">
        <Link to="/" className="link-element-nav cursor-target">Accueil<ArrowUpRightStroke /></Link>
        <Link to="/experiences" className="link-element-nav cursor-target">Expériences<ArrowUpRightStroke /></Link>
        <Link to="/calendrier" className="link-element-nav cursor-target">Réserver<ArrowUpRightStroke /></Link>
        <Link to="/info-pratique" className="link-element-nav cursor-target">Infos pratiques<ArrowUpRightStroke /></Link>
      </div>
      
      <div className="language">
        <a href="#">FR</a> / <a href="#">EN</a>
      </div>
    </div>
  );
};

export default Navbar;