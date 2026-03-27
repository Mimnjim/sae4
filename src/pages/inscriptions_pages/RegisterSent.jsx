import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RegisterSent() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '2rem auto' }}>
      <h2>{t('pages.registerSent.title')}</h2>
      <p>{t('pages.registerSent.message')}</p>
      <p><Link to="/login">{t('pages.registerSent.goToLogin')}</Link></p>
    </div>
  );
}
