import { useEffect, useRef, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Map from '../components/Map';
import ContactSection from '../components/ContactSection';
import '../styles/infos-pratiques.css';

const InfoPratique = () => {
  const { t } = useTranslation();
  const titleRef = useRef(null);
  const [activeSection, setActiveSection] = useState('tarifs');

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Observateur pour tracker la section active lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['tarifs', 'horaires', 'acces', 'accessibilite', 'faq', 'contact'];
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
          {t('pages.infoPratique.title')}
        </h1>
        <p className="infos-pratiques__description">
          Découvrez tous les détails pratiques pour préparer votre visite au musée. Horaires d'ouverture, tarifs, accès, informations d'accessibilité et réponses à vos questions fréquentes.
        </p>
      </section>

      <div className="infos-pratiques__layout">
        {/* ── MENU LATÉRAL FIXE ── */}
        <nav className="infos-pratiques__sidebar">
          <ul className="infos-pratiques__menu">
            <li>
              <a 
                href="#tarifs" 
                className={`infos-pratiques__link ${activeSection === 'tarifs' ? 'active' : ''}`}
              >
                {t('pages.infoPratique.pricing')}
              </a>
            </li>
            <li>
              <a 
                href="#horaires" 
                className={`infos-pratiques__link ${activeSection === 'horaires' ? 'active' : ''}`}
              >
                {t('pages.infoPratique.hours')}
              </a>
            </li>
            <li>
              <a 
                href="#acces" 
                className={`infos-pratiques__link ${activeSection === 'acces' ? 'active' : ''}`}
              >
                {t('pages.infoPratique.access')}
              </a>
            </li>
            <li>
              <a 
                href="#accessibilite" 
                className={`infos-pratiques__link ${activeSection === 'accessibilite' ? 'active' : ''}`}
              >
                {t('pages.infoPratique.accessibility')}
              </a>
            </li>
            <li>
              <a 
                href="#faq" 
                className={`infos-pratiques__link ${activeSection === 'faq' ? 'active' : ''}`}
              >
                {t('pages.infoPratique.faq')}
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`infos-pratiques__link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                {t('pages.infoPratique.contact')}
              </a>
            </li>
          </ul>
        </nav>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="infos-pratiques__content">
          
          {/* ── TARIFS ── */}
          <section id="tarifs" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.infoPratique.pricing')}</h2>
            <div className="infos-pratiques__card">
              <p className="infos-pratiques__text">
                {t('pages.infoPratique.pricingContent').split('\n').map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    {i < t('pages.infoPratique.pricingContent').split('\n').length - 1 && <br />}
                  </Fragment>
                ))}
              </p>
            </div>
          </section>

          {/* ── HORAIRES ── */}
          <section id="horaires" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.infoPratique.hours')}</h2>
            <div className="infos-pratiques__card">
              <p className="infos-pratiques__text">
                {t('pages.infoPratique.hoursContent')}
              </p>
            </div>
          </section>

          {/* ── ACCÈS ── */}
          <section id="acces" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.infoPratique.access')}</h2>
            <div className="infos-pratiques__card">
              <p className="infos-pratiques__text">
                {t('pages.infoPratique.accessContent').split('\n').map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    {i < t('pages.infoPratique.accessContent').split('\n').length - 1 && <br />}
                  </Fragment>
                ))}
              </p>
            </div>
            
            {/* Carte */}
            <div className="infos-pratiques__map-wrapper">
              <Map />
            </div>
          </section>

          {/* ── ACCESSIBILITÉ ── */}
          <section id="accessibilite" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.infoPratique.accessibility')}</h2>
            <div className="infos-pratiques__card">
              <p className="infos-pratiques__text">
                {t('pages.infoPratique.accessibilityContent').split('\n').map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    {i < t('pages.infoPratique.accessibilityContent').split('\n').length - 1 && <br />}
                  </Fragment>
                ))}
              </p>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="infos-pratiques__section">
            <h2 className="infos-pratiques__section-title">{t('pages.infoPratique.faq')}</h2>
            <div className="infos-pratiques__faq-items">
              <details className="infos-pratiques__faq-item">
                <summary>{t('pages.infoPratique.faq1Question')}</summary>
                <div className="infos-pratiques__faq-content">
                  <p>{t('pages.infoPratique.faq1Answer')}</p>
                </div>
              </details>
              <details className="infos-pratiques__faq-item">
                <summary>{t('pages.infoPratique.faq2Question')}</summary>
                <div className="infos-pratiques__faq-content">
                  <p>{t('pages.infoPratique.faq2Answer')}</p>
                </div>
              </details>
              <details className="infos-pratiques__faq-item">
                <summary>{t('pages.infoPratique.faq3Question')}</summary>
                <div className="infos-pratiques__faq-content">
                  <p>{t('pages.infoPratique.faq3Answer')}</p>
                </div>
              </details>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="infos-pratiques__section infos-pratiques__section--contact">
            <h2 className="infos-pratiques__section-title">{t('pages.infoPratique.contact')}</h2>
            <ContactSection
              phone="+33 1 23 45 67 89"
              email="contact@azert.fr"
              website="https://azert-agency.tomdelavigne.fr/"
            />
          </section>

        </div>
      </div>
    </main>
  );
};

export default InfoPratique;