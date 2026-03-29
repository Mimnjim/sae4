import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/practical_info_components/infos-pratiques.css';

const PolitiqueConfidentialite = () => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
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
          {isEnglish ? 'Privacy Policy' : 'Politique de Confidentialité'}
        </h1>
        <p className="infos-pratiques__description">
          {isEnglish
            ? 'Protection of your personal data and compliance with French and European regulations.'
            : 'Protection de vos données personnelles et conformité avec la réglementation française et européenne.'
          }
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
                {isEnglish ? 'Introduction' : 'Introduction'}
              </a>
            </li>
            <li>
              <a 
                href="#collection" 
                className={`infos-pratiques__link ${activeSection === 'collection' ? 'active' : ''}`}
              >
                {isEnglish ? 'Data Collection' : 'Collecte de Données'}
              </a>
            </li>
            <li>
              <a 
                href="#cookies" 
                className={`infos-pratiques__link ${activeSection === 'cookies' ? 'active' : ''}`}
              >
                {isEnglish ? 'Cookies' : 'Cookies'}
              </a>
            </li>
            <li>
              <a 
                href="#rights" 
                className={`infos-pratiques__link ${activeSection === 'rights' ? 'active' : ''}`}
              >
                {isEnglish ? 'Your Rights' : 'Vos Droits'}
              </a>
            </li>
            <li>
              <a 
                href="#retention" 
                className={`infos-pratiques__link ${activeSection === 'retention' ? 'active' : ''}`}
              >
                {isEnglish ? 'Data Retention' : 'Conservation des Données'}
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`infos-pratiques__link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                {isEnglish ? 'Contact' : 'Contact'}
              </a>
            </li>
          </ul>
        </nav>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="infos-pratiques__content">
          
          {/* ── INTRODUCTION ── */}
          <section id="introduction" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Introduction' : 'Introduction'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Respect for Your Privacy' : 'Respect de votre vie privée'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'This immersive exhibition is committed to respecting your privacy. This privacy policy explains how your personal data is collected, used and protected in accordance with the European General Data Protection Regulation (GDPR) and the French Information and Freedoms Law.'
                  : 'Cette exposition immersive est attachée au respect de votre vie privée. Cette politique de confidentialité explique comment vos données personnelles sont collectées, utilisées et protégées conformément au Règlement Général sur la Protection des Données (RGPD) européen et à la loi française Informatique et Libertés.'
                }
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Data Controller' : 'Responsable du traitement'}
              </h3>
              <p className="infos-pratiques__text">
                <strong>{isEnglish ? 'Responsible Entity' : 'Entité responsable'} :</strong> Musée Guimet<br />
                <strong>{isEnglish ? 'Address' : 'Adresse'} :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris<br />
                <strong>Email :</strong> <a href="mailto:dpo@audeladelhumain.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>dpo@audeladelhumain.com</a>
              </p>
            </div>
          </section>

          {/* ── COLLECTE DE DONNÉES ── */}
          <section id="collection" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Data Collection' : 'Collecte de Données'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Personal Data Collected' : 'Données personnelles collectées'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'We collect your personal data only when you provide it voluntarily. This data includes:'
                  : 'Nous ne collectons vos données personnelles que lorsque vous les fournissez volontairement. Ces données incluent :'
                }
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>{isEnglish ? 'Registration:' : 'Inscription :'}</strong> {isEnglish ? 'Name, first name, email' : 'Nom, prénom, email'}</li>
                <li><strong>{isEnglish ? 'Booking:' : 'Réservation :'}</strong> {isEnglish ? 'Complete contact details, date and number of visitors' : 'Coordonnées complètes, date et nombre de visiteurs'}</li>
                <li><strong>{isEnglish ? 'Technical Data:' : 'Données techniques :'}</strong> {isEnglish ? 'IP address, browser type, pages visited' : 'Adresse IP, type de navigateur, pages visitées'}</li>
                <li><strong>{isEnglish ? 'Authentication:' : 'Authentification :'}</strong> {isEnglish ? 'Password (hashed and encrypted)' : 'Mot de passe (hasé et chiffré)'}</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Legal Basis for Processing' : 'Base légale du traitement'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish ? 'Your data is processed on the basis of:' : 'Vos données sont traitées sur la base de :'}
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>{isEnglish ? 'Explicit Consent:' : 'Consentement explicite :'}</strong> {isEnglish ? 'Through registration and booking forms' : 'À travers les formulaires d\'inscription et de réservation'}</li>
                <li><strong>{isEnglish ? 'Contract Execution:' : 'Exécution de contrat :'}</strong> {isEnglish ? 'To process your bookings' : 'Pour traiter vos réservations'}</li>
                <li><strong>{isEnglish ? 'Legitimate Interest:' : 'Intérêt légitime :'}</strong> {isEnglish ? 'To improve our services' : 'Pour améliorer nos services'}</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Data Usage' : 'Utilisation des données'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish ? 'Your data is used to:' : 'Vos données sont utilisées pour :'}
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li>{isEnglish ? 'Create and manage your user account' : 'Créer et gérer votre compte utilisateur'}</li>
                <li>{isEnglish ? 'Process and confirm your bookings' : 'Traiter et confirmer vos réservations'}</li>
                <li>{isEnglish ? 'Send you relevant information (updates, reminders)' : 'Vous envoyer des informations pertinentes (actualisations, rappels)'}</li>
                <li>{isEnglish ? 'Analyze site usage for continuous improvement' : 'Analyser l\'usage du site pour amélioration continue'}</li>
                <li>{isEnglish ? 'Comply with our legal obligations' : 'Respecter nos obligations légales'}</li>
              </ul>
            </div>
          </section>

          {/* ── COOKIES ── */}
          <section id="cookies" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Cookies and Tracking Technologies' : 'Cookies et Technologies de Suivi'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Cookie Types' : 'Types de cookies'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish ? 'This site uses the following cookie categories:' : 'Ce site utilise les catégories de cookies suivantes :'}
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>{isEnglish ? 'Necessary Cookies:' : 'Cookies nécessaires :'}</strong> {isEnglish ? 'Authentication, security, session management' : 'Authentification, sécurité, gestion de session'}</li>
                <li><strong>{isEnglish ? 'Preference Cookies:' : 'Cookies de préférence :'}</strong> {isEnglish ? 'Selected language, display preferences' : 'Langue sélectionnée, préférences d\'affichage'}</li>
                <li><strong>{isEnglish ? 'Analytics Cookies:' : 'Cookies d\'analyse :'}</strong> {isEnglish ? 'Enable continuous improvement through anonymized metrics' : 'Permettent une amélioration continue via métriques anonymisées'}</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Cookie Management' : 'Gestion des cookies'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'You can control cookies through your browser settings. Disabling certain cookies may affect the site\'s functionality. Necessary cookies cannot be disabled.'
                  : 'Vous pouvez contrôler les cookies via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter le fonctionnement du site. Les cookies nécessaires ne peuvent pas être désactivés.'
                }
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Google Maps' : 'Google Maps'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'This exhibition uses Google Maps to display the location of Musée Guimet. Inserting this map results in loading content from Google. Please consult Google\'s Privacy Policy for more information.'
                  : 'Cet exposition utilise Google Maps pour afficher la localisation du Musée Guimet. L\'insertion de cette carte entraîne le chargement de contenu provenant de Google. Consultez la Politique de confidentialité de Google pour plus d\'informations.'
                }
              </p>
            </div>
          </section>

          {/* ── VOS DROITS ── */}
          <section id="rights" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Your Rights' : 'Vos Droits'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Rights Recognized by the GDPR' : 'Droits reconnus par le RGPD'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'In accordance with the GDPR, you have the following rights:'
                  : 'Conformément au RGPD, vous disposez des droits suivants :'
                }
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>{isEnglish ? 'Right of Access:' : 'Droit d\'accès :'}</strong> {isEnglish ? 'You can request access to your data' : 'Vous pouvez demander l\'accès à vos données'}</li>
                <li><strong>{isEnglish ? 'Right of Rectification:' : 'Droit de rectification :'}</strong> {isEnglish ? 'Correct or update your data' : 'Corriger ou mettre à jour vos données'}</li>
                <li><strong>{isEnglish ? 'Right to Be Forgotten:' : 'Droit à l\'oubli :'}</strong> {isEnglish ? 'Request deletion of your data' : 'Demander la suppression de vos données'}</li>
                <li><strong>{isEnglish ? 'Right to Data Portability:' : 'Droit à la portabilité :'}</strong> {isEnglish ? 'Recover your data in a common format' : 'Récupérer vos données dans un format courant'}</li>
                <li><strong>{isEnglish ? 'Right to Object:' : 'Droit d\'opposition :'}</strong> {isEnglish ? 'Object to certain processing' : 'Vous opposer à certains traitements'}</li>
                <li><strong>{isEnglish ? 'Right to Restriction:' : 'Droit à la limitation :'}</strong> {isEnglish ? 'Limit the use of your data' : 'Limiter l\'utilisation de vos données'}</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'How to Exercise Your Rights' : 'Comment exercer vos droits'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'To exercise any of these rights, please send a written request to:'
                  : 'Pour exercer l\'un de ces droits, veuillez envoyer une demande écrite à :'
                }<br />
                <strong>Email :</strong> <a href="mailto:privacy@audeladelhumain.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>privacy@audeladelhumain.com</a><br />
                <strong>{isEnglish ? 'Address' : 'Adresse'} :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris<br />
                {isEnglish
                  ? 'Please attach a copy of a valid ID for verification.'
                  : 'Veuillez joindre une copie d\'une pièce d\'identité valide pour vérification.'
                }
              </p>
            </div>
          </section>

          {/* ── CONSERVATION DES DONNÉES ── */}
          <section id="retention" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Data Retention' : 'Conservation des Données'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Retention Periods' : 'Durées de conservation'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'Your personal data is retained for the duration necessary for the stated purposes:'
                  : 'Vos données personnelles sont conservées pendant la durée nécessaire pour les finalités déclarées :'
                }
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>{isEnglish ? 'Account Data:' : 'Données de compte :'}</strong> {isEnglish ? 'Duration of registration + 3 years' : 'Durée de votre inscription + 3 ans'}</li>
                <li><strong>{isEnglish ? 'Bookings:' : 'Réservations :'}</strong> {isEnglish ? 'Duration of booking + 2 years (accounting obligations)' : 'Durée de la réservation + 2 ans (obligations comptables)'}</li>
                <li><strong>{isEnglish ? 'Analytics Cookies:' : 'Cookies d\'analyse :'}</strong> {isEnglish ? 'Up to 2 years' : 'Jusqu\'à 2 ans'}</li>
                <li><strong>{isEnglish ? 'Technical Data:' : 'Données techniques :'}</strong> {isEnglish ? 'Up to 90 days' : 'Jusqu\'à 90 jours'}</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Data Deletion' : 'Suppression des données'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'Upon expiration of the retention period, your data is automatically deleted or anonymized in accordance with the law. You can request early deletion of your data by exercising your right to be forgotten.'
                  : 'À l\'expiration de la durée de conservation, vos données sont supprimées automatiquement ou anonymisées conformément à la loi. Vous pouvez demander la suppression anticipée de vos données en exerçant votre droit à l\'oubli.'
                }
              </p>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Contact Us' : 'Nous Contacter'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Data Protection Officer (DPO)' : 'Délégué à la Protection des Données'}
              </h3>
              <p className="infos-pratiques__text">
                <strong>Email :</strong> <a href="mailto:dpo@audeladelhumain.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>dpo@audeladelhumain.com</a><br />
                <strong>{isEnglish ? 'Address' : 'Adresse'} :</strong> Musée Guimet, 6 place d'Iéna, 75016 Paris<br />
                <strong>{isEnglish ? 'Phone' : 'Téléphone'} :</strong> +33 1 98 76 54 32
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Privacy Inquiries' : 'Questions de Confidentialité'}
              </h3>
              <p className="infos-pratiques__text">
                <strong>Email :</strong> <a href="mailto:privacy@audeladelhumain.com" style={{ color: '#ba121b', textDecoration: 'underline' }}>privacy@audeladelhumain.com</a><br />
                <strong>{isEnglish ? 'Phone' : 'Téléphone'} :</strong> +33 1 87 65 43 21
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr>
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'If you believe your rights are not being respected, you can file a complaint with the CNIL:'
                  : 'Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une plainte auprès de la CNIL :'
                }<br />
                <strong>{isEnglish ? 'Website' : 'Site web'} :</strong> <a href="https://www.cnil.fr" style={{ color: '#ba121b', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.cnil.fr</a><br />
                <strong>{isEnglish ? 'Phone' : 'Téléphone'} :</strong> 01 53 73 22 22
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Last Updated' : 'Dernière mise à jour'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'This privacy policy was last updated on [Date]. We reserve the right to modify this policy at any time. Significant changes will be communicated with notice.'
                  : 'Cette politique de confidentialité a été mise à jour le [Date]. Nous nous réservons le droit de modifier cette politique à tout moment. Les modifications importantes seront communiquées avec un préavis.'
                }
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default PolitiqueConfidentialite;
