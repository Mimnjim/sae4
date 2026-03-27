import { useTranslation } from 'react-i18next';
import '../../styles/components/book_components/Conditions.css';

// Groupe de conditions dans un <details> réutilisable
const ConditionGroup = ({ title, conditions }) => (
  <details>
    <summary>{title}</summary>
    <div className="cond-list">
      {conditions.map((condition) => (
        <div key={condition.title} className="cond-item">
          <strong>{condition.title}</strong>
          <p>{condition.description}</p>
        </div>
      ))}
    </div>
  </details>
);

const Conditions = () => {
  const { t } = useTranslation();

  const FREE_CONDITIONS = [
    {
      title: t('conditions.children'),
      description: t('conditions.childDescription'),
    },
    {
      title: t('conditions.disabledPerson'),
      description: t('conditions.disabledDescription'),
    },
    {
      title: t('conditions.student'),
      description: t('conditions.studentDescription'),
    },
    {
      title: t('conditions.seniors'),
      description: t('conditions.seniorsDescription'),
    },
  ];

  const REDUCED_CONDITIONS = [
    {
      title: t('conditions.student'),
      description: t('conditions.studentDescription'),
    },
    {
      title: t('conditions.seniors'),
      description: t('conditions.seniorsDescription'),
    },
  ];

  return (
    <section className="conditions">
      {/* R234 : titre de section pour la hiérarchie */}
      <h2 className="conditions__title">{t('conditions.title')}</h2>
      <ConditionGroup title={t('conditions.freeConditions')} conditions={FREE_CONDITIONS} />
      <ConditionGroup title={t('conditions.reducedTariff')} conditions={REDUCED_CONDITIONS} />
    </section>
  );
};

export default Conditions;