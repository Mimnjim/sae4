import { useTranslation } from 'react-i18next';

// On utilise "function" classique pour rester cohérent et lisible
export default function ContactSection({ phone, email, website, websiteLang = 'fr' }) {
  const { t } = useTranslation();

  return (
    // Sémantique HTML : une section est plus logique qu'une simple div ici
    <section className="contact-section">
      <h2>{t('contact.title')}</h2>
      
      <ul className="contact-list">
        <li>
          <strong>{t('contact.phone_label')} : </strong>
          <a href={`tel:${phone}`}>{phone}</a>
        </li>
        
        <li>
          <strong>{t('contact.email_label')} : </strong>
          <a href={`mailto:${email}`}>{email}</a>
        </li>
        
        <li>
          <strong>{t('contact.website_label')} : </strong>
          {/* R131 : hrefLang signale la langue du site cible */}
          <a href={website} target="_blank" rel="noreferrer" hrefLang={websiteLang}>
            {website}
            {/* Accessibilité (sans ARIA) : On prévient textuellement que ça ouvre une nouvelle fenêtre, 
                mais on le cache visuellement grâce à la classe sr-only qu'on a codée plus tôt ! */}
            <span className="sr-only"> {t('contact.new_tab_warning')}</span>
          </a>
        </li>
      </ul>
    </section>
  );
}