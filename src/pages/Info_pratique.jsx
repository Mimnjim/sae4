import Map from '../components/Map';
import ContactSection from '../components/ContactSection';
import '../styles/info-pratique.css';

const InfoPratique = () => {
  return (
    <div className="info-pratique-container">
      <h1>Informations pratiques</h1>

      <div className="info-main">

        {/* ── Infos générales ── */}
        <div className="info-content">
          <div className="info-card">
            <h3>Tarifs</h3>
            <p>
              Plein tarif — 9 euros<br />
              Tarif réduit — 8 euros<br />
              Gratuité — Gratuit
            </p>
          </div>

          <div className="info-card">
            <h3>Horaires</h3>
            <p>
              Mardi - Samedi : 9H - 21H<br />
              Dimanche : 9H - 19H<br />
              Lundi : Fermé
            </p>
          </div>

          <div className="info-card">
            <h3>Accès</h3>
            <p>Présentation courte de l'accès et transports (métro, bus, parking).</p>
          </div>

          <div className="info-card">
            <h3>Accessibilité</h3>
            <p>Entrée gratuite pour la personne handicapée et accompagnateur sur présentation d'un justificatif.</p>
          </div>
        </div>

        {/* ── Carte ── */}
        <div className="map-section">
          <h2>Localisation</h2>
          <Map />
        </div>

        {/* ── Contact ── */}
        <ContactSection
          phone="+33 1 23 45 67 89"
          email="contact@azert.fr"
          website="https://www.azert.fr"
        />

        {/* ── FAQ — classe dédiée pour layout pleine largeur ── */}
        <div className="info-content">
          <div className="info-card info-card--faq">
            <h3>FAQ</h3>
            <details>
              <summary>Dois-je réserver à l'avance ?</summary>
              <p>Oui, il est fortement recommandé de réserver vos billets en ligne pour garantir l'accès au créneau souhaité.</p>
            </details>
            <details>
              <summary>Y a-t-il des tarifs réduits ?</summary>
              <p>Oui : étudiants, demandeurs d'emploi et personnes en situation de handicap bénéficient d'un tarif réduit sur présentation d'un justificatif.</p>
            </details>
            <details>
              <summary>Puis-je annuler ma réservation ?</summary>
              <p>Les conditions d'annulation sont indiquées au moment de la réservation. Contactez-nous si vous avez besoin d'aide.</p>
            </details>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InfoPratique;