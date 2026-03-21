import '../styles/LevelCard.css';

// Affiche une carte pour un niveau du jeu dans la liste des expériences
//
// Props :
//   level    → objet niveau { id, pilot, ... }
//   unlocked → true si le niveau est accessible
//   percent  → pourcentage de complétion (0-100)
//   onSelect → appelé avec l'id du niveau quand on clique sur "Commencer"
//   selected → true si ce niveau est actuellement sélectionné
export default function LevelCard({ level, unlocked, percent, onSelect, selected }) {
  const isLocked = !unlocked;

  // Construction des classes CSS selon l'état de la carte
  const cardClasses = [
    'level-card',
    isLocked ? 'locked'   : '',
    selected  ? 'selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>

      {/* Aperçu visuel du niveau — purement décoratif */}
      <div className="level-preview">
        <div className="preview-box" />
      </div>

      <div className="level-meta">
        <h3 className="level-title">Niveau {level.id}</h3>
        <div className="level-sub">
          Joueur : <strong>{level.pilot || '—'}</strong>
        </div>
        <div className="level-completion">
          Complétion : <span className="level-percent-inline">{percent}%</span>
        </div>
      </div>

      <div className="level-actions">
        <button
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