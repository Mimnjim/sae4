import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/pages/not-found.css';

// Page 404 personnalisée avec menu de navigation (R225)
function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__content">
          <h1 className="not-found__code">404</h1>
          <h2 className="not-found__title">{t('error.pageNotFound') || 'Page non trouvée'}</h2>
          <p className="not-found__description">
            {t('error.description') || 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.'}
          </p>
          
          {/* R225 : Page d'erreur 404 avec boutons de navigation explicites */}
          <div className="not-found__actions">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
              aria-label="Retourner à la page d'accueil"
            >
              {t('error.backHome') || 'Retour à l\'accueil'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate(-1)}
              aria-label="Revenir à la page précédente"
            >
              {t('error.goBack') || 'Retour à la page précédente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
