import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Activate() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage(t('pages.activate.noToken') || 'No activation token provided');
          return;
        }

        // Call activation API
        const response = await fetch('/api/auth/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          setStatus('success');
          setMessage(t('pages.activate.success') || 'Account activated successfully!');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(t('pages.activate.error') || 'Activation failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(t('pages.activate.error') || 'An error occurred during activation.');
      }
    };

    activateAccount();
  }, [searchParams, navigate, t]);

  return (
    <div className="activate-page" style={{ padding: '2rem', maxWidth: 700, margin: '4rem auto', textAlign: 'center' }}>
      {status === 'loading' && (
        <>
          <h2>{t('pages.activate.loading') || 'Activating your account...'}</h2>
          <p>{t('pages.activate.please_wait') || 'Please wait...'}</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <h2 style={{ color: 'green' }}>{t('pages.activate.title') || 'Account Activated'}</h2>
          <p>{message}</p>
          <p>{t('pages.activate.redirecting') || 'Redirecting to login in a few seconds...'}</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <h2 style={{ color: 'red' }}>{t('pages.activate.errorTitle') || 'Activation Failed'}</h2>
          <p>{message}</p>
          <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
            {t('pages.activate.goToLogin') || 'Go to Login'}
          </a>
        </>
      )}
    </div>
  );
}
