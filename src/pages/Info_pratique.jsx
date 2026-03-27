import { useEffect, useRef } from 'react';
import Map from '../components/Map';
import ContactSection from '../components/ContactSection';
import '../styles/info-pratique.css';

const InfoPratique = () => {
  // R166 / R185 : Gestion du focus à l'arrivée sur la page pour les lecteurs d'écran et claviers
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  return (
    // Utilisation d'un <main> natif au lieu d'une simple div
    <main className="info-pratique-container">
      {/* tabIndex="-1" permet de donner le focus en JS sans perturber la navigation Tab classique */}
      <h1 ref={titleRef} tabIndex="-1" style={{ outline: 'none' }}>
        Informations pratiques
      </h1>

      <div className="info-main">

        {/* ── Infos générales ── */}
        <section className="info-content">
          {/* R234 : Il manquait un H2 pour respecter la hiérarchie stricte H1 -> H2 -> H3 */}
          <h2 className="sr-only">Informations de visite</h2>
          
          <div className="info-card">
            <h3>Tarifs</h3>
            <p>
              Plein tarif - 9 euros<br />
              Tarif réduit - 8 euros<br />
              Enfant et personne en situation de handicap - Gratuit
            </p>
          </div>

          <div className="info-card">
            <h3>Horaires</h3>
            <p>
              Ouvert tous les jours de 10h à 18h<br />
            </p>
          </div>

          <div className="info-card">
            <h3>Accès</h3>
            <p>Metro 8.</p>
            <p>Parking payant à proximité.</p>
            <p>Accès vélo : station Vélib' à 200m.</p>
          </div>

          <div className="info-card">
            <h3>Accessibilité</h3>
            <p>Entrée gratuite pour la personne handicapée et accompagnateur sur présentation d'un justificatif.</p>
            <p>Ascenseur disponible pour accéder à tous les niveaux.</p>
            <p>Toilettes accessibles au rez-de-chaussée.</p>
            <p>Accompagnateur : disponible sur demande.</p>
          </div>
        </section>

        {/* ── Carte ── */}
        <section className="map-section">
          <h2>Localisation</h2>
          <Map />
        </section>

        {/* ── Contact ── */}
        <section>
          <h2 className="sr-only">Nous contacter</h2>
          <ContactSection
            phone="+33 1 23 45 67 89"
            email="contact@azert.fr"
            website="https://azert-agency.tomdelavigne.fr/"
          />
        </section>

        {/* ── FAQ ── */}
        <section className="info-content">
          <div className="info-card info-card--faq">
            <h2>FAQ</h2>
            <details>
              <summary>Dois-je réserver à l'avance ?</summary>
              <p>Oui, il est fortement recommandé de réserver vos billets en ligne pour garantir l'accès au créneau souhaité.</p>
            </details>
            <details>
              <summary>Est-ce qu'il y a des tarifs réduits ?</summary>
              <p>Oui : étudiants, demandeurs d'emploi et personnes en situation de handicap bénéficient d'un tarif réduit sur présentation d'un justificatif.</p>
            </details>
            <details>
              <summary>Puis-je annuler ma réservation ?</summary>
              <p>Oui, il vous suffit de vous connecter, d'accéder à votre profil afin d'annuler votre réservation.</p>
            </details>
          </div>
        </section>

      </div>
    </main>
  );
};

export default InfoPratique;