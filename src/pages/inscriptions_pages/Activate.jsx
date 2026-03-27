import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Délai avant redirection automatique vers /login après activation réussie
const REDIRECT_DELAY = 2500;

// Page d'activation de compte via lien email (/activate?token=abc123)
const Activate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // "loading" | "success" | "error"
  const [status,  setStatus]  = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token manquant');
      return;
    }

    fetch(`https://apimusee.tomdelavigne.fr/api/activate.php?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Compte activé avec succès');
          setTimeout(() => navigate('/login'), REDIRECT_DELAY);
        } else {
          setStatus('error');
          setMessage(data.message || 'Une erreur est survenue');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Erreur réseau, veuillez réessayer.');
      });
  }, []);

  return (
    <div className="activate-container">
      <h2>Activation de compte</h2>
      {status === 'loading' && <p>Validation en cours...</p>}
      {status === 'success' && (
        <p className="activate-message activate-message--success">
          {message} — redirection vers la page de connexion...
        </p>
      )}
      {status === 'error' && (
        <p className="activate-message activate-message--error">{message}</p>
      )}
    </div>
  );
};

export default Activate;