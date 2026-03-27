import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Délai avant redirection automatique vers /login après activation réussie
const REDIRECT_DELAY = 2500;

// Page d'activation de compte via lien email (/activate?token=abc123)
const Activate = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // "loading" | "success" | "error"
  const [status,  setStatus]  = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('pages.activate.missingToken'));
      return;
    }

    fetch(`https://apimusee.tomdelavigne.fr/api/activate.php?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || t('pages.activate.success'));
          setTimeout(() => navigate('/login'), REDIRECT_DELAY);
        } else {
          setStatus('error');
          setMessage(data.message || t('pages.activate.error'));
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage(t('profile.networkError'));
      });
  }, []);

  return (
    <div className="activate-container">
      <h2>{t('pages.activate.title')}</h2>
      {status === 'loading' && <p>{t('pages.activate.validating')}</p>}
      {status === 'success' && (
        <p className="activate-message activate-message--success">
          {message} — {t('pages.activate.redirecting')}
        </p>
      )}
      {status === 'error' && (
        <p className="activate-message activate-message--error">{message}</p>
      )}
    </div>
  );
};

export default Activate;