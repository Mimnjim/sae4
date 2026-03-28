import { useTranslation } from 'react-i18next';

const Hero = ({ title1, title2, subtitle }) => {
  const { t } = useTranslation();
  return (
    <div className="hero-section">
      <div className="container-slogan">
        {/* R234 : un seul h1 par page */}
        <h1 className="slogan">{title1 || t('hero.title1')}</h1>
        <p className="slogan">{title2 || t('hero.title2')}</p>
        <div className="under-slogan">
          <h2>{subtitle || t('hero.subtitle')}</h2>
        </div>
      </div>
      <div className="scroll-down">
        {/* R234 : pas un titre, c'est une indication UI */}
        <p>{t('sections.experience.content') ? 'Scroll to learn more' : 'Scroll pour en savoir plus'}</p>
        <div className="arrow">
          <span className="arrow-down"></span>
        </div>
      </div>
    </div>
  );
};

export default Hero;