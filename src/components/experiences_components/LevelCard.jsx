import { useTranslation } from 'react-i18next';
import '../../styles/components/experiences_components/LevelCard.css';

export default function LevelCard({ level, unlocked, percent, onSelect, selected }) {
  const { t } = useTranslation();
  const isLocked = !unlocked;

  // Syntaxe simplifiée (très facile à lire pour un débutant)
  let cardClasses = 'level-card';
  if (isLocked) cardClasses += ' locked';
  if (selected) cardClasses += ' selected';

  const levelName = t(level.nameKey);
  const pilotName = t(level.pilotKey);

  return (
    // Sémantique HTML : <article> est idéal pour une carte indépendante
    <article className={cardClasses}>
      
      <div className="level-preview">
        {/* L'image de la carte ira ici */}
        <div className="preview-box" />
      </div>

      <div className="level-meta">
        <h3 className="level-title">{levelName}</h3>
        <div className="level-sub">{t('pages.experiences.levelCard.pilot')} : <strong>{pilotName || '—'}</strong></div>
        <div className="level-completion">
          {t('pages.experiences.levelCard.completion')} : <span className="level-percent-inline">{percent}%</span>
        </div>
      </div>

      <div className="level-actions">
        {/* L'attribut disabled coupe automatiquement le focus au clavier, c'est parfait ! */}
        <button
          type="button"
          className={`btn play-level ${isLocked ? 'btn-disabled' : 'btn-primary'}`}
          onClick={() => onSelect(level.id)}
          disabled={isLocked}
        >
          {t('pages.experiences.levelCard.startRace')}
        </button>
      </div>
      
    </article>
  );
}