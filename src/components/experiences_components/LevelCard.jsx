import { useTranslation } from 'react-i18next';
import '../../styles/components/experiences_components/LevelCard.css';

// Carte d'un niveau : état verrouillé/déverrouillé, complétion, sélection
export default function LevelCard({ level, unlocked, percent, onSelect, selected }) {
  const { t } = useTranslation();
  const isLocked = !unlocked;

  const cardClasses = ['level-card', isLocked ? 'locked' : '', selected ? 'selected' : '']
    .filter(Boolean).join(' ');

  const levelName = t(level.nameKey);
  const pilotName = t(level.pilotKey);

  return (
    <div className={cardClasses}>
      <div className="level-preview">
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
        <button
          type="button"
          className={`btn play-level ${isLocked ? 'btn-disabled' : 'btn-primary'}`}
          onClick={() => onSelect(level.id)}
          disabled={isLocked}
        >
          {t('pages.experiences.levelCard.startRace')}
        </button>
      </div>
    </div>
  );
}