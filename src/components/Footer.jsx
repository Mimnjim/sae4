import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      {/* Copyright en haut */}
      <div className="footer-copyright">
        © 2026 {t('footer.copyright')}
      </div>

      {/* 3 zones en flex row */}
      <div className="footer-content">
        
        {/* Zone 1 : Logo + Adresse */}
        <div className="footer-zone">
          <img src="/img/moyen_logo_white.svg" alt="Musée Guimet" className="footer-logo" />
          <p className="footer-address">
            {t('footer.museum')}<br />
            {t('footer.address')}
          </p>
        </div>

        {/* Zone 2 : Navigation */}
        <div className="footer-zone">
          <Link to="/">{t('footer.home')}</Link>
          <Link to="/infos-pratiques">{t('footer.practicalities')}</Link>
          <Link to="/experiences">{t('footer.experiences')}</Link>
          <Link to="/form-reservation">{t('footer.tickets')}</Link>
        </div>

        {/* Zone 3 : Legal */}
        <div className="footer-zone">
          <Link to="/mentions-legales">{t('footer.legal')}</Link>
          <Link to="/privacy">{t('footer.privacy')}</Link>
          <Link to="/sources">{t('footer.sources')}</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;