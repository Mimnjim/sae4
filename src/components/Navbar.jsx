import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

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
        <button className="nav-logout" onClick={handleLogout} aria-label={t('nav.logout')}>{t('nav.logout')}</button>
      </>
    );
  } else {
    authLinks = (
      <>
        <Link to="/login">{t('nav.login')}</Link>
      </>
    );
  }

  return (
    <div className="navbar">
      <div className="elements-nav">
        <Link to="/">{t('nav.home')}</Link>
        <Link to="/experiences">{t('nav.experiences')}</Link>
        <Link to="/form-reservation">{t('nav.reserve')}</Link>
        <Link to="/info-pratique">{t('nav.info')}</Link>

        {authLinks}
      </div>

      <div className="language">
        <button type="button" className="lang-toggle" onClick={toggleLanguage} aria-label="Switch language">
          {i18n.language && i18n.language.toUpperCase()}
        </button>
      </div>
    </div>
  );
};

export default Navbar;