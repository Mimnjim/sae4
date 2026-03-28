import '../styles/footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="footer-logo">{t('footer.company')}</div>
      <p>{t('footer.description')}</p>
      <div className="socials">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" hrefLang="en">
          Instagram <i className="fab fa-instagram"></i>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" hrefLang="en">
          Twitter <i className="fab fa-twitter"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" hrefLang="en">
          YouTube <i className="fab fa-youtube"></i>
        </a>
      </div>
      <small>{t('footer.copyright')}</small>
    </footer>
  );
};

export default Footer;