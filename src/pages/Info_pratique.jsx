import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Map from '../components/Map';
import ContactSection from '../components/ContactSection';
import '../styles/info-pratique.css';

const InfoPratique = () => {
  // R166 / R185 : Gestion du focus à l'arrivée sur la page pour les lecteurs d'écran et claviers
  const titleRef = useRef(null);

  const { t } = useTranslation();
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
        {t('info.title')}
      </h1>

      <div className="info-main">

        {/* ── Infos générales ── */}
        <section className="info-content">
          {/* R234 : Il manquait un H2 pour respecter la hiérarchie stricte H1 -> H2 -> H3 */}
          <h2 className="sr-only">Informations de visite</h2>
          
          <div className="info-card">
            <h3>{t('info.tariffs_title')}</h3>
            <p dangerouslySetInnerHTML={{ __html: `${t('info.tariff_full')}<br/>${t('info.tariff_reduced')}<br/>${t('info.tariff_free')}` }} />
          </div>

          <div className="info-card">
            <h3>{t('info.hours_title')}</h3>
            <p>{t('info.hours_text')}</p>
          </div>

          <div className="info-card">
            <h3>{t('info.access_title')}</h3>
            <p>{t('info.access_metro')}</p>
            <p>{t('info.access_parking')}</p>
            <p>{t('info.access_bike')}</p>
          </div>

          <div className="info-card">
            <h3>{t('info.accessibility_title')}</h3>
            <p>{t('info.accessibility_text1')}</p>
            <p>{t('info.accessibility_text2')}</p>
            <p>{t('info.accessibility_text3')}</p>
            <p>{t('info.accessibility_text4')}</p>
          </div>
        </section>

        {/* ── Carte ── */}
        <section className="map-section">
          <h2>{t('info.location')}</h2>
          <Map />
        </section>

        {/* ── Contact ── */}
        <section>
          <h2 className="sr-only">{t('contact.title')}</h2>
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
              <summary>{t('info.faq.q1')}</summary>
              <p>{t('info.faq.a1')}</p>
            </details>
            <details>
              <summary>{t('info.faq.q2')}</summary>
              <p>{t('info.faq.a2')}</p>
            </details>
            <details>
              <summary>{t('info.faq.q3')}</summary>
              <p>{t('info.faq.a3')}</p>
            </details>
          </div>
        </section>

      </div>
    </main>
  );
};

export default InfoPratique;