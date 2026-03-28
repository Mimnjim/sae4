import { useTranslation } from 'react-i18next';
import '../styles/Conditions.css';

// Sous-composant simple : affiche un accordéon avec une liste de conditions
// Pour un débutant, on utilise "function" plutôt que "const = () =>" pour bien séparer
function ConditionGroup({ title, conditions }) {
  return (
    <details>
      <summary>{title}</summary>
      
      <div className="cond-list">
        {/* L'utilisation de map() est le grand classique React à maîtriser */}
        {conditions.map((condition, index) => (
          // On utilise l'index comme key car cette liste ne sera jamais modifiée/triée
          <div key={index} className="cond-item">
            <strong>{condition.title}</strong>
            <p>{condition.description}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

// Composant principal
export default function Conditions() {
  const { t } = useTranslation();

  // On place les données ICI pour pouvoir utiliser la fonction t()
  // Read arrays directly from translation files (returnObjects=true returns JS arrays/objects)
  const FREE_CONDITIONS = t('conditions.free', { returnObjects: true }) || [];
  const REDUCED_CONDITIONS = t('conditions.reduced', { returnObjects: true }) || [];

  return (
    <section className="conditions">
      {/* R234 : Un vrai H2 pour structurer la page */}
      <h2 className="conditions__title">{t('conditions.title')}</h2>
      
      <ConditionGroup 
        title={t('conditions.free_title')}
        conditions={FREE_CONDITIONS} 
      />

      <ConditionGroup 
        title={t('conditions.reduced_title')}
        conditions={REDUCED_CONDITIONS} 
      />
    </section>
  );
}