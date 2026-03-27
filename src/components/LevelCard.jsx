import '../styles/LevelCard.css';

// Carte d'un niveau : état verrouillé/déverrouillé, complétion, sélection
export default function LevelCard({ level, unlocked, percent, onSelect, selected }) {
  const isLocked = !unlocked;

  const cardClasses = ['level-card', isLocked ? 'locked' : '', selected ? 'selected' : '']
    .filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      <div className="level-preview">
        <div className="preview-box" />
      </div>

      <div className="level-meta">
        <h3 className="level-title">Niveau {level.id}</h3>
        <div className="level-sub">Joueur : <strong>{level.pilot || '—'}</strong></div>
        <div className="level-completion">
          Complétion : <span className="level-percent-inline">{percent}%</span>
        </div>
      </div>

      <div className="level-actions">
        <button
          type="button"
          className={`btn play-level ${isLocked ? 'btn-disabled' : 'btn-primary'}`}
          onClick={() => onSelect(level.id)}
          disabled={isLocked}
        >
          Commencer la course
        </button>
      </div>
    </div>
  );
}