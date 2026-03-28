import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AuthPrompt.css';

// Invite l'utilisateur non connecté à se connecter ou s'inscrire
export default function AuthPrompt({ message }) {
  const { t } = useTranslation();

  return (
    // On utilise <section> au lieu de <div> pour une meilleure sémantique HTML
    <section className="auth-prompt">
      {/* Un H2 est souvent plus logique ici qu'un H3 pour la hiérarchie (Règle 234) */}
      <h2 className="auth-prompt__title">
        {message || t('authPrompt.default_message')}
      </h2>
      
      <p className="auth-prompt__desc">
        {t('authPrompt.desc')}
      </p>
      
      <div className="auth-prompt__actions">
        {/* On utilise <Link> au lieu de <button> pour la navigation */}
        <Link
          to="/login"
          className="auth-prompt__btn auth-prompt__btn--primary"
        >
          {t('authPrompt.login')}
        </Link>
        
        <Link
          to="/register"
          className="auth-prompt__btn auth-prompt__btn--secondary"
        >
          {t('authPrompt.register')}
        </Link>
      </div>
    </section>
  );
}