import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/practical_info_components/infos-pratiques.css';

const MentionsLegales = () => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const titleRef = useRef(null);
  const [activeSection, setActiveSection] = useState('publisher');

  const content = {
    publisher: {
      title: isEnglish ? 'Website Publisher' : 'Éditeur du site',
      expo: {
        title: isEnglish ? 'Immersive Exhibition' : 'Exposition Immersive',
        publisher: isEnglish ? 'Publication Manager' : 'Responsable de la publication',
        museum: 'Musée Guimet',
        headOffice: isEnglish ? 'Head Office' : 'Siège social',
        address: 'Musée Guimet, 6 place d\'Iéna, 75016 Paris, France',
        phone: '+33 1 56 52 53 00',
        email: 'contact@guimet.fr',
        legalForm: isEnglish ? 'Legal Form' : 'Forme juridique',
        form: isEnglish ? 'Public Establishment' : 'Établissement public'
      },
      dev: {
        title: isEnglish ? 'Creative & Development' : 'Création & Développement',
        agency: 'AzerT - Agence de Communication Numérique',
        webDev: isEnglish ? 'Web Development' : 'Développement Web',
        webDevTeam: 'TE Jimmy & DELAVIGNE Tom',
        design: isEnglish ? 'Design & Creative' : 'Conception & Créatif',
        designTeam: 'CHASSAGNON Mélina, KETTOU Lana, MADISSOUEKE Déborah, CHARPENTIER Alexis',
        direction: isEnglish ? 'Artistic Direction' : 'Direction artistique',
        tech: isEnglish ? 'Technologies' : 'Technologies',
        technologies: 'React, Three.js, Vite, GSAP'
      }
    },
    hosting: {
      title: isEnglish ? 'Hosting' : 'Hébergement',
      provider: {
        title: isEnglish ? 'Hosting Provider' : 'Prestataire d\'hébergement',
        host: 'O2Switch',
        address: isEnglish ? 'Address' : 'Adresse',
        hostAddress: '123 Avenue de la Victoire, 69000 Lyon, France',
        support: isEnglish ? 'Support Phone' : 'Téléphone support',
        supportPhone: '+33 1 56 78 90 12',
        website: 'Website',
        websiteUrl: 'www.o2switch.fr',
        owner: isEnglish ? 'Domain Owner' : 'Propriétaire du domaine',
        ownerName: 'TE Jimmy',
        domain: 'Domain',
        domainName: 'audeladelhumain.fr',
        servers: isEnglish ? 'Servers' : 'Serveurs',
        serversLocation: isEnglish ? 'Located in the European Union' : 'Situés dans l\'Union Européenne'
      }
    },
    contact: {
      title: isEnglish ? 'Contact' : 'Contact',
      legal: {
        title: isEnglish ? 'For any legal questions' : 'Pour toute question légale',
        email: isEnglish ? 'Email' : 'Email',
        emailAddr: 'legal@audeladelhumain.fr',
        address: isEnglish ? 'Address' : 'Adresse',
        addressDetail: 'Musée Guimet, 6 place d\'Iéna, 75016 Paris',
        phone: isEnglish ? 'Phone' : 'Téléphone',
        phoneNum: '+33 1 23 45 67 89'
      }
    }
  };

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
          {isEnglish ? 'Legal Notice' : 'Mentions Légales'}
        </h1>
        <p className="infos-pratiques__description">
          {isEnglish 
            ? 'Legal information concerning this website according to French law.'
            : 'Informations légales relatives à ce site web conformément à la legislation française.'
          }
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
                {isEnglish ? 'Publisher' : 'Éditeur'}
              </a>
            </li>
            <li>
              <a 
                href="#hosting" 
                className={`infos-pratiques__link ${activeSection === 'hosting' ? 'active' : ''}`}
              >
                {isEnglish ? 'Hosting' : 'Hébergement'}
              </a>
            </li>
            <li>
              <a 
                href="#properties" 
                className={`infos-pratiques__link ${activeSection === 'properties' ? 'active' : ''}`}
              >
                {isEnglish ? 'Intellectual Property' : 'Propriété Intellectuelle'}
              </a>
            </li>
            <li>
              <a 
                href="#liability" 
                className={`infos-pratiques__link ${activeSection === 'liability' ? 'active' : ''}`}
              >
                {isEnglish ? 'Liability' : 'Responsabilité'}
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
          
          {/* ── ÉDITEUR ── */}
          <section id="publisher" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{content.publisher.title}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {content.publisher.expo.title}
              </h3>
              <p className="infos-pratiques__text">
                <strong>{content.publisher.expo.publisher} :</strong> {content.publisher.expo.museum}<br />
                <strong>{content.publisher.expo.headOffice} :</strong> {content.publisher.expo.address}<br />
                <strong>{isEnglish ? 'Phone' : 'Téléphone'} :</strong> {content.publisher.expo.phone}<br />
                <strong>Email :</strong> {content.publisher.expo.email}<br />
                <strong>{content.publisher.expo.legalForm} :</strong> {content.publisher.expo.form}
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {content.publisher.dev.title}
              </h3>
              <p className="infos-pratiques__text">
                <strong>{isEnglish ? 'Agency' : 'Agence'} :</strong> {content.publisher.dev.agency}<br />
                <strong>{content.publisher.dev.webDev} :</strong> {content.publisher.dev.webDevTeam}<br />
                <strong>{content.publisher.dev.design} :</strong> {content.publisher.dev.designTeam}<br />
                <strong>{content.publisher.dev.direction} :</strong> {isEnglish ? 'Respect of official graphic design' : 'Respect de la charte graphique officielle'}<br />
                <strong>{content.publisher.dev.tech} :</strong> {content.publisher.dev.technologies}
              </p>
            </div>
          </section>

          {/* ── HÉBERGEMENT ── */}
          <section id="hosting" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{content.hosting.title}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {content.hosting.provider.title}
              </h3>
              <p className="infos-pratiques__text">
                <strong>{isEnglish ? 'Hosting Provider' : 'Hébergeur'} :</strong> {content.hosting.provider.host}<br />
                <strong>{content.hosting.provider.address} :</strong> {content.hosting.provider.hostAddress}<br />
                <strong>{content.hosting.provider.support} :</strong> {content.hosting.provider.supportPhone}<br />
                <strong>{content.hosting.provider.website} :</strong> {content.hosting.provider.websiteUrl}<br />
                <strong>{content.hosting.provider.owner} :</strong> {content.hosting.provider.ownerName}<br />
                <strong>{content.hosting.provider.domain} :</strong> {content.hosting.provider.domainName}<br />
                <strong>{content.hosting.provider.servers} :</strong> {content.hosting.provider.serversLocation}
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Access Conditions' : 'Conditions d\'accès'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish 
                  ? 'The editor strives to ensure optimal operation of this website. However, access may be interrupted for maintenance, updates or force majeure. The editor cannot be held responsible for interruptions in access.'
                  : 'L\'éditeur s\'efforce d\'assurer le fonctionnement optimal de ce site. Toutefois, l\'accès peut être interrompu pour maintenance, mises à jour ou force majeure. L\'éditeur ne peut être tenu responsable des interruptions d\'accès.'
                }
              </p>
            </div>
          </section>

          {/* ── PROPRIÉTÉ INTELLECTUELLE ── */}
          <section id="properties" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Intellectual Property' : 'Propriété Intellectuelle'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Copyright' : 'Droits d\'auteur'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'The general structure, as well as the texts, images, graphics and all elements making up this site are the exclusive property of the editor and are protected by the provisions of the Intellectual Property Code.'
                  : 'La structure générale, ainsi que les textes, images, graphiques et tous les éléments composant ce site sont la propriété exclusive de l\'éditeur et sont protégés par les dispositions du Code de la propriété intellectuelle.'
                }
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Reproduction Authorization' : 'Autorisations de reproduction'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'Any reproduction, even partial, of the site or its elements is strictly prohibited without prior written authorization from the editor. Counterfeiters will be prosecuted in accordance with the provisions of the Intellectual Property Code.'
                  : 'Toute reproduction, même partielle, du site ou de ses éléments est strictement interdite sans autorisation préalable écrite de l\'éditeur. Les contrefacteurs seront poursuivis conformément aux dispositions du Code de la propriété intellectuelle.'
                }
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Registered Trademarks' : 'Marques déposées'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'The names and logos of partners, including Akira, Ghost in the Shell, and Musée Guimet, are registered trademarks respecting the intellectual property of their respective owners.'
                  : 'Les noms et logos des partenaires, notamment Akira, Ghost in the Shell, et Musée Guimet, sont des marques déposées respectant la propriété intellectuelle de leurs propriétaires respectifs.'
                }
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Free Licenses' : 'Licences libres'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'Certain elements of the site are used under free licenses (Creative Commons, MIT, Apache 2.0). Please refer to the Sources page for complete attribution of resources.'
                  : 'Certains éléments du site sont utilisés sous licences libres (Creative Commons, MIT, Apache 2.0). Se reporter à la page Sources pour l\'attribution complète des ressources.'
                }
              </p>
            </div>
          </section>

          {/* ── RESPONSABILITÉ ── */}
          <section id="liability" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{isEnglish ? 'Liability' : 'Responsabilité'}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Inaccuracies' : 'Inexactitudes'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'The editor strives to keep the information on this site up to date. However, the editor cannot be held responsible for inaccuracies, errors or omissions in the content. If you detect an error, please inform us.'
                  : 'L\'éditeur s\'efforce de maintenir les informations à jour sur ce site. Cependant, l\'éditeur ne peut être tenu responsable des inexactitudes, erreurs ou omissions du contenu. En cas d\'erreur détectée, veuillez nous en informer.'
                }
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'External Links' : 'Liens externes'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'This site may contain links to other websites. The editor cannot be held responsible for the content, availability or compliance of these external sites. Consultation of these sites is under the exclusive responsibility of the user.'
                  : 'Ce site peut contenir des liens vers d\'autres sites web. L\'éditeur ne peut être tenu responsable du contenu, de la disponibilité ou de la conformité de ces sites externes. La consultation de ces sites s\'effectue sous la responsabilité exclusive de l\'utilisateur.'
                }
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'Warranties' : 'Garanties'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish
                  ? 'The site is provided "as is" without any express or implied warranty. The editor does not guarantee the absence of viruses, malware or technical malfunctions.'
                  : 'Le site est fourni "en l\'état" sans aucune garantie expresse ou implicite. L\'éditeur ne garantit pas l\'absence de virus, malveillances ou dysfonctionnements techniques.'
                }
              </p>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{content.contact.title}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {content.contact.legal.title}
              </h3>
              <p className="infos-pratiques__text">
                <strong>{content.contact.legal.email} :</strong> <a href="mailto:legal@audeladelhumain.fr" style={{ color: '#ba121b', textDecoration: 'underline' }}>{content.contact.legal.emailAddr}</a><br />
                <strong>{content.contact.legal.address} :</strong> {content.contact.legal.addressDetail}<br />
                <strong>{content.contact.legal.phone} :</strong> {content.contact.legal.phoneNum}
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700' }}>
                {isEnglish ? 'CNIL & Data Protection' : 'CNIL & Protection des données'}
              </h3>
              <p className="infos-pratiques__text">
                {isEnglish 
                  ? 'For any questions relating to the protection of your personal data, please consult our Privacy Policy. You can also contact the CNIL directly at 01 53 73 22 22.'
                  : 'Pour toute question relative à la protection de vos données personnelles, consultez notre Politique de Confidentialité. Vous pouvez également contacter directement la CNIL au 01 53 73 22 22.'
                }
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default MentionsLegales;
