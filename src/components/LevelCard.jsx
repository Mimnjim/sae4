import { useTranslation } from 'react-i18next';
import '../styles/LevelCard.css';

export default function LevelCard({ level, unlocked, percent, onSelect, selected }) {
  const { t } = useTranslation();
  const isLocked = !unlocked;

  // Syntaxe simplifiée (très facile à lire pour un débutant)
  let cardClasses = 'level-card';
  if (isLocked) cardClasses += ' locked';
  if (selected) cardClasses += ' selected';

  return (
    // Sémantique HTML : <article> est idéal pour une carte indépendante
    <article className={cardClasses}>
      
      <div className="level-preview">
        {/* L'image de la carte ira ici */}
        <div className="preview-box" />
      </div>

      <div className="level-meta">
        {/* R234 : H3 est parfait si ta page principale a déjà un H1 et un H2 au-dessus ! */}
        <h3 className="level-title">
          {t(`levels.level${level.id}`) || `Niveau ${level.id}`}
        </h3>
        
        <div className="level-sub">
          {t('levels.player')} : <strong>{level.pilot || '—'}</strong>
        </div>
        
        <div className="level-completion">
          {t('levels.completion')} : <span className="level-percent-inline">{percent}%</span>
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
          {t('levels.start_race')}
          {/* R185 : Précision invisible à l'écran mais lue par NVDA/VoiceOver ("Commencer la course Niveau 1") */}
          <span className="sr-only"> {t(`levels.level${level.id}`) || `Niveau ${level.id}`}</span>
        </button>
      </div>
      
    </article>
  );
}