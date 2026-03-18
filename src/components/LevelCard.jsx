import React from 'react';

export default function LevelCard({ level, unlocked, percent, onSelect, selected }) {
  const locked = !unlocked;
  return (
    <div className={`level-card ${locked ? 'locked' : ''} ${selected ? 'selected' : ''}`}>
      <div className="level-preview" aria-hidden>
        <div className="preview-box" />
      </div>

      <div className="level-meta">
        <h3 className="level-title">{level.name}</h3>
        <div className="level-sub">pilote : <strong>{level.pilot || '—'}</strong></div>
        <div className="level-objective">objectif : <span className="stars">{Array.from({length:3}).map((_,i) => <span key={i} className="star">☆</span>)}</span></div>

        <div className="level-actions">
          <button onClick={() => onSelect(level.id)} disabled={locked} className={`btn play-level ${locked ? 'btn-disabled' : 'btn-primary'}`}>
            Commencer la course
          </button>
          {!locked && <div className="level-percent">{percent}%</div>}
        </div>
      </div>
    </div>
  );
}
