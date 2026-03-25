import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from '@boxicons/react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Langues
  const [openLang, setOpenLang] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'FR');
  const dropdownRef = useRef(null);
  const labelLang = lang === 'FR' ? 'Langues' : 'Languages';
  

  // Apparaition de la navbar au scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Toujours visible en haut
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        // scroll vers le bas → cacher
        setShowNavbar(false);
      } else {
        // scroll vers le haut → afficher
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  function handleLogout() {
    localStorage.clear();
    setUser(null);
    navigate('/');
  }

  // Fermer si clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenLang(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Changer langue
  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    setOpenLang(false);
  };

  let authLinks;
  if (user) {
    authLinks = (
      <>
        <Link to="/profile">{user.firstname}</Link>
        <button onClick={handleLogout} className="cursor-target">
          Déconnexion <ArrowUpRight />
        </button>
      </>
    );
  } else {
    authLinks = (
      <>
        <Link to="/login" className="login-btn cursor-target">Connexion <ArrowUpRight /></Link>
      </>
    );
  }

  return (
    <div className={`navbar ${showNavbar ? 'navbar--visible' : 'navbar--hidden'}`}>
      <div className="elements-nav">
        {/* <Link to="/"><img src="/img/Logo_expo.svg" alt="Logo" className="logo-expo cursor-target" /></Link> */}
        <Link to="/"><img src="/img/petit_logo_white.svg" alt="Logo" className="logo-expo cursor-target" /></Link>

        <div className="elements-nav__infos">
          <Link to="/experiences" className="cursor-target">Expériences <ArrowUpRight /></Link>
          <Link to="/form-reservation" className="cursor-target">Réserver <ArrowUpRight /></Link>
          <Link to="/info-pratique" className="cursor-target">Infos pratiques <ArrowUpRight /></Link>
        </div>
      </div>

      <div className="language" ref={dropdownRef}>
        {authLinks}

        {/* DROPDOWN LANGUE */}
        <div className="lang-dropdown">
          <button onClick={() => setOpenLang(!openLang)} className="lang-btn cursor-target">
            {labelLang} ({lang}) ▼
          </button>

          {openLang && (
            <div className="lang-menu">
              <div onClick={() => changeLang('FR')}>Français</div>
              <div onClick={() => changeLang('EN')}>English</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;