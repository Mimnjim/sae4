import { useTranslation } from 'react-i18next';

const InfoCard = ({ icon, title, children }) => {
  const { t } = useTranslation();
  return (
    <div className="info-section">
      <h2>{icon} {title || t('sections.themes.title')}</h2>
      {children}
    </div>
  );
};

export default InfoCard;
