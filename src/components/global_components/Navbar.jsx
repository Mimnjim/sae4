import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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

  // R157 : Déterminer si un lien est actif de la navigation
  // Les items actifs du menu sont signalés visuellement et sémantiquement
  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  let authLinks;
  if (user) {
    authLinks = (
      <Link 
        to="/profile" 
        className={`cursor-target ${isLinkActive('/profile') ? 'nav-link--active' : ''}`}
        aria-current={isLinkActive('/profile') ? 'page' : undefined}
      >
        {t('profile.myProfile')}
      </Link>
    );
  } else {
    authLinks = (
      <>
        <Link 
          to="/login" 
          className={`login-btn cursor-target ${isLinkActive('/login') ? 'nav-link--active' : ''}`}
          aria-current={isLinkActive('/login') ? 'page' : undefined}
        >
          {t('navbar.login')} <img src="/icons/FlecheDiagonale.svg" alt="" className='arrow-link' />
        </Link>
      </>
    );
  }

  return (
    <div className={`navbar ${showNavbarBlack ? 'navbar--black' : 'navbar--noblack'}`}>
      <div className="elements-nav">
        {/* <Link to="/"><img src="/img/Logo_expo.svg" alt="Logo" className="logo-expo cursor-target" /></Link> */}
        <Link to="/"><img src="/img/petit_logo_white.svg" alt="Logo" className="logo-expo cursor-target" /></Link>

        <div className="elements-nav__infos">
          {/* R157 : Items actifs de menu sont signalés
              - classe 'nav-link--active' appliquée si le lien correspond à la route actuelle
              - aria-current="page" indique au lecteur d'écran la page active */}
          <Link 
            to="/experiences" 
            className={`cursor-target ${isLinkActive('/experiences') ? 'nav-link--active' : ''}`}
            aria-current={isLinkActive('/experiences') ? 'page' : undefined}
          >
            {/* {t('navbar.experiences')} <ArrowUpRight /> */}
            {t('navbar.experiences')} <img src="/icons/FlecheDiagonale.svg" alt="" className='arrow-link' />
          </Link>
          <Link 
            to="/form-reservation" 
            className={`cursor-target ${isLinkActive('/form-reservation') ? 'nav-link--active' : ''}`}
            aria-current={isLinkActive('/form-reservation') ? 'page' : undefined}
          >
            {t('navbar.reservation')} <img src="/icons/FlecheDiagonale.svg" alt="" className='arrow-link' />
          </Link>
          <Link 
            to="/infos-pratiques" 
            className={`cursor-target ${isLinkActive('/infos-pratiques') ? 'nav-link--active' : ''}`}
            aria-current={isLinkActive('/infos-pratiques') ? 'page' : undefined}
          >
            {t('navbar.info')} <img src="/icons/FlecheDiagonale.svg" alt="" className='arrow-link' />
          </Link>
        </div>
      </div>

      <div className="language" ref={dropdownRef}>
        {authLinks}

        {/* DROPDOWN LANGUE */}
        <div className="lang-dropdown">
          <button onClick={() => setOpenLang(!openLang)} className="lang-btn cursor-target">
            {/* {labelLang} ({lang}) ▼ */}
            {labelLang} ({lang}) <img src="/icons/Flechederouler.svg" alt="" className='arrow-navbar'/>
          </button>

          {openLang && (
            <div className="lang-menu">
              {/* R131 : Indiquer la langue cible quand elle diffère */}
              <div onClick={() => changeLang('FR')} className="cursor-target" lang="fr" aria-label="Changer la langue vers le français">{t('gateway.french')}</div>
              <div onClick={() => changeLang('EN')} className="cursor-target" lang="en" aria-label="Change language to English">{t('gateway.english')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;