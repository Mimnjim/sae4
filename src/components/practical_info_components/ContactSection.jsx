import { useTranslation } from 'react-i18next';

// Affiche téléphone, email et site web d'un lieu
const ContactSection = ({ phone, email, website, websiteLang = 'fr' }) => {
  const { t } = useTranslation();

  return (
    <div className="contact-section">
      <h2>{t('contact.title')}</h2>
      <ul className="contact-list">
        <li>
          <strong>{t('contact.phone')}:</strong>
          <a href={`tel:${phone}`}>{phone}</a>
        </li>
        <li>
          <strong>{t('contact.email')}:</strong>
          <a href={`mailto:${email}`}>{email}</a>
        </li>
        <li>
          <strong>{t('contact.website')}:</strong>
          {/* R131 : hreflang signale la langue du site cible */}
          <a href={website} target="_blank" rel="noreferrer" hrefLang={websiteLang}>
            {website}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ContactSection;
