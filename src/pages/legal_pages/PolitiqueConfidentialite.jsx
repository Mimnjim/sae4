import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/practical_info_components/infos-pratiques.css';

const PolitiqueConfidentialite = () => {
  const { t } = useTranslation();
  const titleRef = useRef(null);
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Observateur pour tracker la section active lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'collection', 'cookies', 'rights', 'retention', 'contact'];
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
          Politique de Confidentialité
        </h1>
        <p className="infos-pratiques__description">
          Protection de vos données personnelles et conformité avec la réglementation française et européenne.
        </p>
      </section>

      <div className="infos-pratiques__layout">
        {/* ── MENU LATÉRAL FIXE ── */}
        <nav className="infos-pratiques__sidebar">
          <ul className="infos-pratiques__menu">
            <li>
              <a 
                href="#introduction" 
                className={`infos-pratiques__link ${activeSection === 'introduction' ? 'active' : ''}`}
              >
                Introduction
              </a>
            </li>
            <li>
              <a 
                href="#collection" 
                className={`infos-pratiques__link ${activeSection === 'collection' ? 'active' : ''}`}
              >
                Collecte de Données
              </a>
            </li>
            <li>
              <a 
                href="#cookies" 
                className={`infos-pratiques__link ${activeSection === 'cookies' ? 'active' : ''}`}
              >
                Cookies
              </a>
            </li>
            <li>
              <a 
                href="#rights" 
                className={`infos-pratiques__link ${activeSection === 'rights' ? 'active' : ''}`}
              >
                Vos Droits
              </a>
            </li>
            <li>
              <a 
                href="#retention" 
                className={`infos-pratiques__link ${activeSection === 'retention' ? 'active' : ''}`}
              >
                Conservation des Données
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
          
          {/* ── INTRODUCTION ── */}
          <section id="introduction" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Introduction</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Respect de votre vie privée
              </h3>
              <p className="infos-pratiques__text">
                Cette exposition immersive est attachée au respect de votre vie privée. Cette politique de confidentialité explique comment vos données personnelles sont collectées, utilisées et protégées conformément au <strong>Règlement Général sur la Protection des Données (<abbr title="Règlement Général sur la Protection des Données">RGPD</abbr>)</strong> européen et à la loi française <strong>Informatique et Libertés</strong>.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Responsable du traitement
              </h3>
              <p className="infos-pratiques__text">
                <strong>Entité responsable :</strong> [Nom de l'institution]<br />
                <strong>Adresse :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris<br />
                <strong>Email :</strong> <a href="mailto:dpo@example.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>dpo@example.com</a>
              </p>
            </div>
          </section>

          {/* ── COLLECTE DE DONNÉES ── */}
          <section id="collection" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Collecte de Données</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Données personnelles collectées
              </h3>
              <p className="infos-pratiques__text">
                Nous ne collectons vos données personnelles que lorsque vous les fournissez volontairement. Ces données incluent :
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>Inscription :</strong> Nom, prénom, email</li>
                <li><strong>Réservation :</strong> Coordonnées complètes, date et nombre de visiteurs</li>
                <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, pages visitées</li>
                <li><strong>Authentification :</strong> Mot de passe (hasé et chiffré)</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Base légale du traitement
              </h3>
              <p className="infos-pratiques__text">
                Vos données sont traitées sur la base de :
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>Consentement explicite :</strong> À travers les formulaires d'inscription et de réservation</li>
                <li><strong>Exécution de contrat :</strong> Pour traiter vos réservations</li>
                <li><strong>Intérêt légitime :</strong> Pour améliorer nos services</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Utilisation des données
              </h3>
              <p className="infos-pratiques__text">
                Vos données sont utilisées pour :
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Traiter et confirmer vos réservations</li>
                <li>Vous envoyer des informations pertinentes (actualisations, rappels)</li>
                <li>Analyser l'usage du site pour amélioration continue</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </div>
          </section>

          {/* ── COOKIES ── */}
          <section id="cookies" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Cookies et Technologies de Suivi</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Types de cookies
              </h3>
              <p className="infos-pratiques__text">
                Ce site utilise les catégories de cookies suivantes :
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>Cookies nécessaires :</strong> Authentification, sécurité, gestion de session</li>
                <li><strong>Cookies de préférence :</strong> Langue sélectionnée, préférences d'affichage</li>
                <li><strong>Cookies d'analyse :</strong> Permettent une amélioration continue via métriques anonymisées</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Gestion des cookies
              </h3>
              <p className="infos-pratiques__text">
                Vous pouvez contrôler les cookies via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter le fonctionnement du site. Les cookies nécessaires ne peuvent pas être désactivés.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Google Maps
              </h3>
              <p className="infos-pratiques__text">
                Cet exposition utilise Google Maps pour afficher la localisation du Musée Guimet. L'insertion de cette carte entraîne le chargement de contenu provenant de Google. Consultez la <strong>Politique de confidentialité de Google</strong> pour plus d'informations.
              </p>
            </div>
          </section>

          {/* ── VOS DROITS ── */}
          <section id="rights" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Vos Droits</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Droits reconnus par le <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr>
              </h3>
              <p className="infos-pratiques__text">
                Conformément au <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr>, vous disposez des droits suivants :
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>Droit d'accès :</strong> Vous pouvez demander l'accès à vos données</li>
                <li><strong>Droit de rectification :</strong> Corriger ou mettre à jour vos données</li>
                <li><strong>Droit à l'oubli :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format courant</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer à certains traitements</li>
                <li><strong>Droit à la limitation :</strong> Limiter l'utilisation de vos données</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Comment exercer vos droits
              </h3>
              <p className="infos-pratiques__text">
                Pour exercer l'un de ces droits, veuillez envoyer une demande écrite à :<br />
                <strong>Email :</strong> <a href="mailto:privacy@example.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>privacy@example.com</a><br />
                <strong>Adresse :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris<br />
                Veuillez joindre une copie d'une pièce d'identité valide pour vérification.
              </p>
            </div>
          </section>

          {/* ── CONSERVATION DES DONNÉES ── */}
          <section id="retention" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Conservation des Données</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Durées de conservation
              </h3>
              <p className="infos-pratiques__text">
                Vos données personnelles sont conservées pendant la durée nécessaire pour les finalités déclarées :
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>Données de compte :</strong> Durée de votre inscription + 3 ans</li>
                <li><strong>Réservations :</strong> Durée de la réservation + 2 ans (obligations comptables)</li>
                <li><strong>Cookies d'analyse :</strong> Jusqu'à 2 ans</li>
                <li><strong>Données techniques :</strong> Jusqu'à 90 jours</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Suppression des données
              </h3>
              <p className="infos-pratiques__text">
                À l'expiration de la durée de conservation, vos données sont supprimées automatiquement ou anonymisées conformément à la loi. Vous pouvez demander la suppression anticipée de vos données en exerçant votre droit à l'oubli.
              </p>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Nous Contacter</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Délégué à la Protection des Données
              </h3>
              <p className="infos-pratiques__text">
                <strong>Email :</strong> <a href="mailto:dpo@example.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>dpo@example.com</a><br />
                <strong>Téléphone :</strong> [Numéro de contact]<br />
                <strong>Adresse :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr>
              </h3>
              <p className="infos-pratiques__text">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une plainte auprès de la <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr> :<br />
                <strong>Site web :</strong> <a href="https://www.cnil.fr" style={{ color: '#ba121b', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.cnil.fr</a><br />
                <strong>Téléphone :</strong> 01 53 73 22 22
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                Dernière mise à jour
              </h3>
              <p className="infos-pratiques__text">
                Cette politique de confidentialité a été mise à jour le <strong>[Date]</strong>. Nous nous réservons le droit de modifier cette politique à tout moment. Les modifications importantes seront communiquées avec un préavis.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default PolitiqueConfidentialite;
