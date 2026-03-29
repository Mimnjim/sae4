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
          {t('pages.sources.title')}
        </h1>
        <p className="infos-pratiques__description">
          {t('pages.sources.description')}
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
                {t('pages.sources.artworks')}
              </a>
            </li>
            <li>
              <a 
                href="#music" 
                className={`infos-pratiques__link ${activeSection === 'music' ? 'active' : ''}`}
              >
                {t('pages.sources.music')}
              </a>
            </li>
            <li>
              <a 
                href="#technologies" 
                className={`infos-pratiques__link ${activeSection === 'technologies' ? 'active' : ''}`}
              >
                {t('pages.sources.technologies')}
              </a>
            </li>
            <li>
              <a 
                href="#references" 
                className={`infos-pratiques__link ${activeSection === 'references' ? 'active' : ''}`}
              >
                {t('pages.sources.references')}
              </a>
            </li>
          </ul>
        </nav>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="infos-pratiques__content">
          
          {/* ── ŒUVRES ORIGINALES ── */}
          <section id="artworks" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.sources.artworks')}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.akiraTitle')}</h3>
              <p className="infos-pratiques__text">
                <strong>{t('pages.sources.author')}</strong> {t('pages.sources.akiraAuthor')}<br />
                <strong>{t('pages.sources.publisher')}</strong> {t('pages.sources.akiraPublisher')}<br />
                <strong>{t('pages.sources.format')}</strong> {t('pages.sources.akiraFormat')}<br />
                <strong>{t('pages.sources.rights')}</strong> {t('pages.sources.akiraRights')}
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.gisTitle')}</h3>
              <p className="infos-pratiques__text">
                <strong>{t('pages.sources.author')}</strong> {t('pages.sources.gisAuthor')}<br />
                <strong>{t('pages.sources.publisher')}</strong> {t('pages.sources.gisPublisher')}<br />
                <strong>{t('pages.sources.format')}</strong> {t('pages.sources.gisFormat')}<br />
                <strong>{t('pages.sources.rights')}</strong> {t('pages.sources.gisRights')}
              </p>
            </div>
          </section>

          {/* ── MUSIQUES &amp; SONS ── */}
          <section id="music" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.sources.music')}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.compositions')}</h3>
              <p className="infos-pratiques__text">
                {t('pages.sources.compositionsDesc')}
              </p>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.soundResources')}</h3>
              <p className="infos-pratiques__text">
                {t('pages.sources.soundResourcesDesc')}
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li>{t('pages.sources.freesound')}</li>
                <li>{t('pages.sources.zapsplat')}</li>
                <li>{t('pages.sources.pixabay')}</li>
              </ul>
            </div>
          </section>

          {/* ── TECHNOLOGIES ── */}
          <section id="technologies" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.sources.technologies')}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.frameworks')}</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>React</strong> - {t('pages.sources.frameworksDesc')}</li>
                <li><strong>Three.js</strong> - {t('pages.sources.threejs')}</li>
                <li><strong>GSAP</strong> - {t('pages.sources.gsap')}</li>
                <li><strong>i18n</strong> - {t('pages.sources.i18n')}</li>
                <li><strong>React Router</strong> - {t('pages.sources.router')}</li>
                <li><strong>Vite</strong> - {t('pages.sources.vite')}</li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.models')}</h3>
              <p className="infos-pratiques__text">
                <strong>{t('pages.sources.motoko')}</strong><br />
                <strong>{t('pages.sources.tetsuo')}</strong><br />
                <strong>{t('pages.sources.glFormat')}</strong>
              </p>
            </div>
          </section>

          {/* ── RÉFÉRENCES ── */}
          <section id="references" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.sources.references')}</h2>
            
            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.documentation')}</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                <li><strong>{t('pages.sources.guimet')}</strong></li>
                <li><strong>{t('pages.sources.kodansha')}</strong></li>
                <li><strong>{t('pages.sources.wcag')}</strong></li>
              </ul>
            </div>

            <div className="infos-pratiques__card">
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '700' }}>{t('pages.sources.complementary')}</h3>
              <p className="infos-pratiques__text">
                {t('pages.sources.complementaryDesc')}
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default Sources;
