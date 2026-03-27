import { useEffect, useRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Map from '../components/Map';
import ContactSection from '../components/ContactSection';
import '../styles/infos-pratiques.css';

const InfoPratique = () => {
  const { t } = useTranslation();
  // R166 / R185 : Gestion du focus à l'arrivée sur la page pour les lecteurs d'écran et claviers
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  return (
    // Utilisation d'un <main> natif au lieu d'une simple div
    <main className="infos-pratiques-container">
      {/* tabIndex="-1" permet de donner le focus en JS sans perturber la navigation Tab classique */}
      <h1 ref={titleRef} tabIndex="-1" style={{ outline: 'none' }}>
        {t('pages.infoPratique.title')}
      </h1>

      <div className="info-main">

        {/* ── Infos générales ── */}
        <section className="info-content">
          {/* R234 : Il manquait un H2 pour respecter la hiérarchie stricte H1 -> H2 -> H3 */}
          <h2 className="sr-only">{t('pages.infoPratique.visitInfo')}</h2>
          
          <div className="info-card">
            <h3>{t('pages.infoPratique.pricing')}</h3>
            <p>
              {t('pages.infoPratique.pricingContent').split('\n').map((line, i) => (
                <Fragment key={i}>
                  {line}
                  {i < t('pages.infoPratique.pricingContent').split('\n').length - 1 && <br />}
                </Fragment>
              ))}
            </p>
          </div>

          <div className="info-card">
            <h3>{t('pages.infoPratique.hours')}</h3>
            <p>
              {t('pages.infoPratique.hoursContent')}
            </p>
          </div>

          <div className="info-card">
            <h3>{t('pages.infoPratique.access')}</h3>
            <p>
              {t('pages.infoPratique.accessContent').split('\n').map((line, i) => (
                <Fragment key={i}>
                  {line}
                  {i < t('pages.infoPratique.accessContent').split('\n').length - 1 && <br />}
                </Fragment>
              ))}
            </p>
          </div>

          <div className="info-card">
            <h3>{t('pages.infoPratique.accessibility')}</h3>
            <p>
              {t('pages.infoPratique.accessibilityContent').split('\n').map((line, i) => (
                <Fragment key={i}>
                  {line}
                  {i < t('pages.infoPratique.accessibilityContent').split('\n').length - 1 && <br />}
                </Fragment>
              ))}
            </p>
          </div>
        </section>

        {/* ── Carte ── */}
        <section className="map-section">
          <h2>{t('pages.infoPratique.location')}</h2>
          <Map />
        </section>

        {/* ── Contact ── */}
        <section>
          <h2 className="sr-only">{t('pages.infoPratique.contact')}</h2>
          <ContactSection
            phone="+33 1 23 45 67 89"
            email="contact@azert.fr"
            website="https://azert-agency.tomdelavigne.fr/"
          />
        </section>

        {/* ── FAQ ── */}
        <section className="info-content">
          <div className="info-card info-card--faq">
            <h2>{t('pages.infoPratique.faq')}</h2>
            <details>
              <summary>{t('pages.infoPratique.faq1Question')}</summary>
              <p>{t('pages.infoPratique.faq1Answer')}</p>
            </details>
            <details>
              <summary>{t('pages.infoPratique.faq2Question')}</summary>
              <p>{t('pages.infoPratique.faq2Answer')}</p>
            </details>
            <details>
              <summary>{t('pages.infoPratique.faq3Question')}</summary>
              <p>{t('pages.infoPratique.faq3Answer')}</p>
            </details>
          </div>
        </section>

      </div>
    </main>
  );
};

export default InfoPratique;