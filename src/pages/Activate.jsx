import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Délai en ms avant la redirection automatique vers /login après activation réussie
const REDIRECT_DELAY = 2500;

// Page d'activation de compte
// Elle est atteinte via un lien envoyé par email contenant un token dans l'URL
// Ex : /activate?token=abc123
const Activate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // On récupère le token depuis l'URL (?token=...)
  const token = searchParams.get('token');

  // "loading" | "success" | "error"
  const [status,  setStatus]  = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Si l'URL ne contient pas de token, on affiche une erreur immédiatement
    if (!token) {
      setStatus('error');
      setMessage('Token manquant');
      return;
    }

    fetch(`/sae4_api/api/activate.php?token=${encodeURIComponent(token)}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Compte activé avec succès');

          // Redirection automatique vers la page de connexion après le délai
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
  }, []); // [] = s'exécute une seule fois au montage, quand la page se charge

  return (
    <div className="activate-container">
      <h2>Activation de compte</h2>

      {status === 'loading' && (
        <p>Validation en cours...</p>
      )}

      {status === 'success' && (
        <p className="activate-message activate-message--success">
          {message} — redirection vers la page de connexion...
        </p>
      )}

      {status === 'error' && (
        <p className="activate-message activate-message--error">
          {message}
        </p>
      )}
    </div>
  );
};

export default Activate;