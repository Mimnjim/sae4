import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from '@boxicons/react';

const Navbar = ({ user, setUser }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Langues
  const [openLang, setOpenLang] = useState(false);
  const [lang, setLang] = useState((localStorage.getItem('lang') || 'fr').toUpperCase());
  const dropdownRef = useRef(null);
  const labelLang = t('gateway.languages');
  

  // Synchroniser l'état lang avec i18n.language directement
  useEffect(() => {
    setLang((i18n.language || 'fr').toUpperCase());
  }, [i18n.language]);
  const [showNavbarBlack, setShowNavbarBlack] = useState(false);
  const lastScrollY = useRef(0);
  
  // Déterminer si on est sur la page d'accueil
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Sur la page d'accueil: transparent au début, noir à partir de 4100px
      // Sur les autres pages: toujours noir
      if (isHomepage) {
        if(currentScrollY > 4100) {
          setShowNavbarBlack(true);
        } else {
          setShowNavbarBlack(false);
        }
      } else {
        // Sur les autres pages, toujours afficher la navbar noire
        setShowNavbarBlack(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    // Vérifier l'état initial au montage
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);



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
    const langCode = newLang === 'FR' ? 'fr' : 'en';
    i18n.changeLanguage(langCode);
    setLang(newLang);
    localStorage.setItem('lang', langCode);
    setOpenLang(false);
  };

  let authLinks;
  if (user) {
    authLinks = (
      <Link to="/profile" className="cursor-target">Mon compte</Link>
    );
  } else {
    authLinks = (
      <>
        <Link to="/login" className="login-btn cursor-target">{t('navbar.login')} <ArrowUpRight /></Link>
      </>
    );
  }

  return (
    <div className={`navbar ${showNavbarBlack ? 'navbar--black' : 'navbar--noblack'}`}>
      <div className="elements-nav">
        {/* <Link to="/"><img src="/img/Logo_expo.svg" alt="Logo" className="logo-expo cursor-target" /></Link> */}
        <Link to="/"><img src="/img/petit_logo_white.svg" alt="Logo" className="logo-expo cursor-target" /></Link>

        <div className="elements-nav__infos">
          <Link to="/experiences" className="cursor-target">{t('navbar.experiences')} <ArrowUpRight /></Link>
          <Link to="/form-reservation" className="cursor-target">{t('navbar.reservation')} <ArrowUpRight /></Link>
          <Link to="/infos-pratiques" className="cursor-target">{t('navbar.info')} <ArrowUpRight /></Link>
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
              <div onClick={() => changeLang('FR')} className="cursor-target">{t('gateway.french')}</div>
              <div onClick={() => changeLang('EN')} className="cursor-target">{t('gateway.english')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;