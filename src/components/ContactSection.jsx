// Affiche les informations de contact d'un lieu (téléphone, email, site web)
//
// Props :
//   phone   → numéro de téléphone (ex: "01 23 45 67 89")
//   email   → adresse email
//   website → URL du site web (ex: "https://exemple.fr")
const ContactSection = ({ phone, email, website }) => {
  return (
    <div className="contact-section">
      {/* Pas d'emoji dans le code — préférer une icône SVG ou un caractère accessible */}
      <h2>Contact</h2>

      <ul className="contact-list">
        {/* Les <br /> dans un <p> c'est du mauvais HTML — on préfère une liste */}
        <li>
          <strong>Téléphone :</strong>
          {/* tel: permet d'ouvrir l'appel directement sur mobile */}
          <a href={`tel:${phone}`}>{phone}</a>
        </li>
        <li>
          <strong>Email :</strong>
          {/* mailto: ouvre le client mail de l'utilisateur */}
          <a href={`mailto:${email}`}>{email}</a>
        </li>
        <li>
          <strong>Site web :</strong>
          {/* target="_blank" ouvre dans un nouvel onglet, rel="noreferrer" pour la sécurité */}
          <a href={website} target="_blank" rel="noreferrer">{website}</a>
        </li>
      </ul>
    </div>
  );
};

export default ContactSection;
