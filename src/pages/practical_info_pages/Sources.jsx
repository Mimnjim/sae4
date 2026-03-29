import { useEffect, useRef, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/practical_info_components/infos-pratiques.css';

const Sources = () => {
  const { t } = useTranslation();
  const titleRef = useRef(null);
  const [activeSection, setActiveSection] = useState('artworks');

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Observateur pour tracker la section active lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['artworks', 'music', 'technologies', 'references'];
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
          Sources et Crédits
        </h1>
        <p className="infos-pratiques__description">
          Cette page reconnaît toutes les sources, œuvres et ressources utilisées dans la création de cette exposition immersive.
        </p>
      </section>

      <div className="infos-pratiques__layout">
        {/* ── MENU LATÉRAL FIXE ── */}
        <nav className="infos-pratiques__sidebar">
          <ul className="infos-pratiques__menu">
            <li>
              <a 
                href="#artworks" 
                className={`infos-pratiques__link ${activeSection === 'artworks' ? 'active' : ''}`}
              >
                Œuvres Originales
              </a>
            </li>
            <li>
              <a 
                href="#music" 
                className={`infos-pratiques__link ${activeSection === 'music' ? 'active' : ''}`}
              >
                Musiques &amp; Sons
              </a>
            </li>
            <li>
              <a 
                href="#technologies" 
                className={`infos-pratiques__link ${activeSection === 'technologies' ? 'active' : ''}`}
              >
                Technologies
              </a>
            </li>
            <li>
              <a 
                href="#references" 
                className={`infos-pratiques__link ${activeSection === 'references' ? 'active' : ''}`}
              >
                Références
              </a>
            </li>
          </ul>
        </nav>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="infos-pratiques__content">
          
          {/* ── ŒUVRES ORIGINALES ── */}
          <section id="artworks" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Œuvres Originales</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Akira (1982)</h3>
              <p className="infos-pratiques__text">
                <strong>Auteur :</strong> Katsuhiro Ōtemo<br />
                <strong>Éditeur :</strong> Young Magazine (Kodansha)<br />
                <strong>Format :</strong> Série de manga en 6 tomes<br />
                <strong>Droits :</strong> © 1982-1990 Katsuhiro Ōtemo - Tous droits réservés
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Ghost in the Shell (1989)</h3>
              <p className="infos-pratiques__text">
                <strong>Auteur :</strong> Masamune Shirow<br />
                <strong>Éditeur :</strong> Young Magazine (Kodansha)<br />
                <strong>Format :</strong> Série de manga complète<br />
                <strong>Droits :</strong> © 1989-1991 Masamune Shirow - Tous droits réservés
              </p>
            </div>
          </section>

          {/* ── MUSIQUES &amp; SONS ── */}
          <section id="music" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Musiques &amp; Sons</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Compositions Originales</h3>
              <p className="infos-pratiques__text">
                Musiques originales composées spécialement pour cette exposition immersive par notre équipe de composition.
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Ressources Sonores</h3>
              <p className="infos-pratiques__text">
                Ces ressources proviennent de plateformes libres de droit et sont utilisées en accord avec leurs licences respectives :
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li>Freesound.org - Creative Commons</li>
                <li>Zapsplat - Royalty Free</li>
                <li>Pixabay - Creative Commons</li>
              </ul>
            </div>
          </section>

          {/* ── TECHNOLOGIES ── */}
          <section id="technologies" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Technologies Utilisées</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Framework &amp; Librairies</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>React</strong> - Librairie JavaScript pour l'interface utilisateur</li>
                <li><strong>Three.js</strong> - Moteur 3D JavaScript</li>
                <li><strong>GSAP</strong> - Animation avancée</li>
                <li><strong>i18n</strong> - Internationalization pour multi-langue</li>
                <li><strong>React Router</strong> - Navigation côté client</li>
                <li><strong>Vite</strong> - Bundler et serveur de développement</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Modèles 3D</h3>
              <p className="infos-pratiques__text">
                <strong>Motoko Kusanagi</strong> - Modèle 3D créé sous supervision artistique<br />
                <strong>Tetsuo Akira</strong> - Modèle 3D créé pour cette exposition<br />
                <strong>Format :</strong> glTF/GLB
              </p>
            </div>
          </section>

          {/* ── RÉFÉRENCES ── */}
          <section id="references" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">Références &amp; Documentation</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Documentation Officielle</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>Musée Guimet</strong> - Partenaire officiel de l'exposition</li>
                <li><strong>Kodansha</strong> - Éditeur officiel des mangas</li>
                <li><strong>WCAG 2.1</strong> - Directives d'accessibilité Web</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>Ressources Complémentaires</h3>
              <p className="infos-pratiques__text">
                Divers articles, études et ressources académiques ont contribué à la recherche et au développement de cette exposition immersive.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default Sources;
