// Affiche téléphone, email et site web d'un lieu
const ContactSection = ({ phone, email, website, websiteLang = 'fr' }) => (
  <div className="contact-section">
    <h2>Contact</h2>
    <ul className="contact-list">
      <li>
        <strong>Téléphone :</strong>
        <a href={`tel:${phone}`}>{phone}</a>
      </li>
      <li>
        <strong>Email :</strong>
        <a href={`mailto:${email}`}>{email}</a>
      </li>
      <li>
        <strong>Site web :</strong>
        {/* R131 : hreflang signale la langue du site cible */}
        <a href={website} target="_blank" rel="noreferrer" hrefLang={websiteLang}>
          {website}
        </a>
      </li>
    </ul>
  </div>
);

export default ContactSection;
