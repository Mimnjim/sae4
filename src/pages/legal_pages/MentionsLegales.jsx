import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/practical_info_components/infos-pratiques.css';

const MentionsLegales = () => {
  const { t } = useTranslation();
  const titleRef = useRef(null);
  const [activeSection, setActiveSection] = useState('publisher');

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Observateur pour tracker la section active lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['publisher', 'hosting', 'properties', 'liability', 'contact'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="infos-pratiques-container">
      {/* ── SECTION DE PRÉSENTATION ── */}
      <section className="infos-pratiques__hero">
        <h1 ref={titleRef} tabIndex="-1" className="infos-pratiques__title">
          Mentions Légales
        </h1>
        <p className="infos-pratiques__description">
          Informations légales relatives à ce site web conformément à la legislation française.
        </p>
      </section>

      <div className="infos-pratiques__layout">
        {/* ── MENU LATÉRAL FIXE ── */}
        <nav className="infos-pratiques__sidebar">
          <ul className="infos-pratiques__menu">
            <li>
              <a 
                href="#publisher" 
                className={`infos-pratiques__link ${activeSection === 'publisher' ? 'active' : ''}`}
              >
                Éditeur
              </a>
            </li>
            <li>
              <a 
                href="#hosting" 
                className={`infos-pratiques__link ${activeSection === 'hosting' ? 'active' : ''}`}
              >
                Hébergement
              </a>
            </li>
            <li>
              <a 
                href="#properties" 
                className={`infos-pratiques__link ${activeSection === 'properties' ? 'active' : ''}`}
              >
                Propriété Intellectuelle
              </a>
            </li>
            <li>
              <a 
                href="#liability" 
                className={`infos-pratiques__link ${activeSection === 'liability' ? 'active' : ''}`}
              >
                Responsabilité
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`infos-pratiques__link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="infos-pratiques__content">
          
          {/* ── ÉDITEUR ── */}
          <section id="publisher" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Éditeur du site</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Exposition Immersive
              </h3>
              <p className="infos-pratiques__text">
                <strong>Responsable de la publication :</strong> [Nom de l'institution]<br />
                <strong>Siège social :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris, France<br />
                <strong>Téléphone :</strong> [Numéro de téléphone]<br />
                <strong>Email :</strong> [Email de contact]<br />
                <strong>Forme juridique :</strong> [Type d'institution]
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Développement Web
              </h3>
              <p className="infos-pratiques__text">
                <strong>Conception &amp; Développement :</strong> [Nom de l'équipe/agence]<br />
                <strong>Direction artistique :</strong> Respect de la charte graphique officielle<br />
                <strong>Technologies :</strong> React, Three.js, Vite
              </p>
            </div>
          </section>

          {/* ── HÉBERGEMENT ── */}
          <section id="hosting" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Hébergement</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Prestataire d'hébergement
              </h3>
              <p className="infos-pratiques__text">
                <strong>Hébergeur :</strong> [Nom du prestataire d'hébergement]<br />
                <strong>Adresse :</strong> [Adresse de l'hébergeur]<br />
                <strong>Téléphone :</strong> [Téléphone support]<br />
                <strong>Serveurs :</strong> Situés dans l'Union Européenne
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Conditions d'accès
              </h3>
              <p className="infos-pratiques__text">
                L'éditeur s'efforce d'assurer le fonctionnement optimal de ce site. Toutefois, l'accès peut être interrompu pour maintenance, mises à jour ou force majeure. L'éditeur ne peut être tenu responsable des interruptions d'accès.
              </p>
            </div>
          </section>

          {/* ── PROPRIÉTÉ INTELLECTUELLE ── */}
          <section id="properties" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Propriété Intellectuelle</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Droits d'auteur
              </h3>
              <p className="infos-pratiques__text">
                La structure générale, ainsi que les textes, images, graphiques et tous les éléments composant ce site sont la propriété exclusive de l'éditeur et sont protégés par les dispositions du Code de la propriété intellectuelle.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Autorisations de reproduction
              </h3>
              <p className="infos-pratiques__text">
                Toute reproduction, même partielle, du site ou de ses éléments est strictement interdite sans autorisation préalable écrite de l'éditeur. Les contrefacteurs seront poursuivis conformément aux dispositions du Code de la propriété intellectuelle.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Marques déposées
              </h3>
              <p className="infos-pratiques__text">
                Les noms et logos des partenaires, notamment Akira, Ghost in the Shell, et Musée Guimet, sont des marques déposées respectant la propriété intellectuelle de leurs propriétaires respectifs.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Licences libres
              </h3>
              <p className="infos-pratiques__text">
                Certains éléments du site sont utilisés sous licences libres (Creative Commons, MIT, Apache 2.0). Se reporter à la page <strong>Sources</strong> pour l'attribution complète des ressources.
              </p>
            </div>
          </section>

          {/* ── RESPONSABILITÉ ── */}
          <section id="liability" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Responsabilité</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Inexactitudes
              </h3>
              <p className="infos-pratiques__text">
                L'éditeur s'efforce de maintenir les informations à jour sur ce site. Cependant, l'éditeur ne peut être tenu responsable des inexactitudes, erreurs ou omissions du contenu. En cas d'erreur détectée, veuillez nous en informer.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Liens externes
              </h3>
              <p className="infos-pratiques__text">
                Ce site peut contenir des liens vers d'autres sites web. L'éditeur ne peut être tenu responsable du contenu, de la disponibilité ou de la conformité de ces sites externes. La consultation de ces sites s'effectue sous la responsabilité exclusive de l'utilisateur.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Garanties
              </h3>
              <p className="infos-pratiques__text">
                Le site est fourni "en l'état" sans aucune garantie expresse ou implicite. L'éditeur ne garantit pas l'absence de virus, malveillances ou dysfonctionnements techniques.
              </p>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Contact</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Pour toute question légale
              </h3>
              <p className="infos-pratiques__text">
                <strong>Email :</strong> <a href="mailto:legal@example.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>legal@example.com</a><br />
                <strong>Adresse :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris<br />
                <strong>Téléphone :</strong> [Numéro de contact]
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                CNIL &amp; Protection des données
              </h3>
              <p className="infos-pratiques__text">
                Pour toute question relative à la protection de vos données personnelles, consultez notre <strong>Politique de Confidentialité</strong>. Vous pouvez également contacter directement la <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr> au <strong>01 53 73 22 22</strong>.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default MentionsLegales;
