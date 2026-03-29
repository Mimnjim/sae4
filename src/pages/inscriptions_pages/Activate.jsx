import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/components/inscription_components/activate.css';

function Activate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setMessage(t('activate.noToken') || 'Token d\'activation manquant');
      setLoading(false);
      return;
    }

    // Appel API pour activer le compte
    fetch('https://apimusee.tomdelavigne.fr/api/activate.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setSuccess(true);
          setMessage(t('activate.success') || 'Compte activé avec succès');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setMessage(data.message || t('activate.error') || 'Erreur lors de l\'activation');
        }
      })
      .catch(() => {
        setMessage(t('activate.networkError') || 'Erreur réseau');
      })
      .finally(() => setLoading(false));
  }, [searchParams, navigate, t]);

  return (
    <div className="activate-container">
      <div className="activate-card">
        <div className="activate-card__header">
          <h1 className="activate-card__title">{t('activate.title') || 'Activation du compte'}</h1>
        </div>

        {loading ? (
          <p className="activate-card__loading">{t('activate.loading') || 'Activation en cours...'}</p>
        ) : (
          <div className={`activate-card__message activate-card__message--${success ? 'success' : 'error'}`}>
            <p>{message}</p>
          </div>
        )}

        {success && (
          <p className="activate-card__redirect">
            {t('activate.redirecting') || 'Redirection vers la connexion...'}
          </p>
        )}
      </div>
    </div>
  );
}

export default Activate;
