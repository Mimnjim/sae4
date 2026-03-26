import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelCard from '../components/LevelCard';
import Timeline from '../components/Timeline';
import '../styles/experiences.css';

const LEVELS = [
  { id: 1, name: 'NIVEAU 01 : NEO-TOKYO RUN',      pilot: 'Kaneda' },
  { id: 2, name: 'NIVEAU 02 : GHOST HACK',          pilot: 'Motoko' },
  { id: 3, name: "NIVEAU 03 : AU-DELÀ DE L'HUMAIN", pilot: '—'      },
];

const UNLOCK_THRESHOLD = 0.7;
const getProgressKey   = (levelId) => `game_progress_level_${levelId}`;

function getCompletionRatio(progress) {
  if (!progress || progress.total === 0) return 0;
  return progress.collected / progress.total;
}

function loadProgressFromStorage() {
  const result = {};
  LEVELS.forEach(level => {
    const raw = localStorage.getItem(getProgressKey(level.id));
    result[level.id] = raw ? JSON.parse(raw) : { collected: 0, total: 0 };
  });
  return result;
}

function saveProgress(levelId, value, setProgressMap) {
  localStorage.setItem(getProgressKey(levelId), JSON.stringify(value));
  setProgressMap(prev => ({ ...prev, [levelId]: value }));
}

// Panneau affiché en fin de partie
function GameResultPanel({ gameResult, playingLevelId, progressMap, onReplay, onClose, onNextLevel, onClaimPromo }) {
  if (!gameResult) return null;

  const isVictory      = gameResult === 'victory';
  const isLastLevel    = playingLevelId >= LEVELS.length;
  const levelProgress  = progressMap[playingLevelId] || { collected: 0, total: 0 };
  const hasEnoughItems = getCompletionRatio(levelProgress) >= UNLOCK_THRESHOLD;

  return (
    <div className="result-panel">
      {/* R234 : h2 car c'est le titre principal de ce panneau */}
      <h2>{isVictory ? 'Victoire !' : 'Game Over'}</h2>
      <div className="result-actions">
        <button type="button" className="btn btn-light" onClick={onReplay}>Réessayer</button>
        <button type="button" className="btn"           onClick={onClose}>Quitter</button>

        {isVictory && !isLastLevel && (
          hasEnoughItems
            ? <button type="button" className="btn btn-primary" onClick={onNextLevel}>Niveau suivant</button>
            : <button type="button" className="btn" disabled>Récoltez 70% des objets pour continuer</button>
        )}

        {isVictory && isLastLevel && hasEnoughItems && (
          <button type="button" className="btn btn-primary" onClick={onClaimPromo}>
            Récupérer le code promo
          </button>
        )}
      </div>
    </div>
  );
}

const Experiences = () => {
  const navigate = useNavigate();
  const iframeRef    = useRef(null);
  const containerRef = useRef(null);

  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [playingLevelId,  setPlayingLevelId]  = useState(null);
  const [progressMap,     setProgressMap]     = useState({});
  const [promoUnlocked,   setPromoUnlocked]   = useState(false);
  const [isGameFinished,  setIsGameFinished]  = useState(false);
  const [gameResult,      setGameResult]      = useState(null);
  const [boostState,      setBoostState]      = useState({ status: 'charging', percent: 0 });
  const [healthPercent,   setHealthPercent]   = useState(100);

  useEffect(() => {
    setProgressMap(loadProgressFromStorage());
    if (localStorage.getItem('promo_unlocked') === '1') setPromoUnlocked(true);
  }, []);

  const unlockedMap = useMemo(() => {
    const map = {};
    LEVELS.forEach((level, index) => {
      if (index === 0) {
        map[level.id] = true;
      } else {
        const previousProgress = progressMap[LEVELS[index - 1].id];
        map[level.id] = getCompletionRatio(previousProgress) >= UNLOCK_THRESHOLD;
      }
    });
    return map;
  }, [progressMap]);

  useEffect(() => {
    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg?.type) return;

      if (msg.type === 'game_init' || msg.type === 'game_progress') {
        if (!msg.difficulty) return;
        const value = { collected: msg.collected || 0, total: msg.total || 0 };
        saveProgress(msg.difficulty, value, setProgressMap);
        if (msg.type === 'game_init') { setIsGameFinished(false); setGameResult(null); }
      }
      if (msg.type === 'game_boost')   setBoostState({ status: msg.status || 'charging', percent: msg.percent || 0 });
      if (msg.type === 'game_health')  setHealthPercent(msg.percent || 0);
      if (msg.type === 'game_victory') {
        const value = { collected: msg.collected || 0, total: msg.total || 0 };
        saveProgress(msg.difficulty, value, setProgressMap);
        if (msg.difficulty === 3 && getCompletionRatio(value) >= UNLOCK_THRESHOLD) {
          localStorage.setItem('promo_unlocked', '1');
          setPromoUnlocked(true);
        }
        setIsGameFinished(true);
        setGameResult('victory');
      }
      if (msg.type === 'game_over') { setIsGameFinished(true); setGameResult('over'); }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!playingLevelId || !iframeRef.current) return;
    const timer = setTimeout(() => {
      iframeRef.current?.focus();
      iframeRef.current?.contentWindow?.postMessage({ type: 'focus' }, '*');
    }, 120);
    return () => clearTimeout(timer);
  }, [playingLevelId]);

  const handleSelectLevel  = (levelId) => { setSelectedLevelId(levelId); if (unlockedMap[levelId]) setPlayingLevelId(levelId); };
  const handleIframeLoaded = () => iframeRef.current?.contentWindow?.postMessage({ type: 'start' }, '*');
  const handleReplay       = () => { iframeRef.current?.contentWindow?.postMessage({ type: 'restart' }, '*'); setIsGameFinished(false); setGameResult(null); };
  const handleCloseModal   = () => { setPlayingLevelId(null); setIsGameFinished(false); setGameResult(null); };
  const handleNextLevel    = () => { if (!playingLevelId || playingLevelId >= LEVELS.length) return; setPlayingLevelId(playingLevelId + 1); setIsGameFinished(false); setGameResult(null); };
  const handleClaimPromo   = () => navigate('/form-reservation', { state: { promoCode: 'HUMAIN5', promoApplied: true } });

  const boostStatusLabel = boostState.status === 'active' ? 'ACTIF' : boostState.status === 'ready' ? 'PRÊT' : 'CHARGEMENT';

  return (
    <div className="experiences-page">
      <h1>Expérience </h1>
      <p> Plongez dans une expérience immersive inspirée des univers d'Akira et Ghost in the Shell. Reussisez les 3 niveaux pour débloquer une récompense !</p>

      <div className="levels-grid">
        <Timeline count={LEVELS.length} />
        <div className="levels-list">
          {LEVELS.map(level => {
            const progress       = progressMap[level.id] || { collected: 0, total: 0 };
            const percentDisplay = Math.round(getCompletionRatio(progress) * 100);
            return (
              <LevelCard
                key={level.id}
                level={level}
                unlocked={!!unlockedMap[level.id]}
                percent={percentDisplay}
                onSelect={handleSelectLevel}
                selected={selectedLevelId === level.id}
              />
            );
          })}
        </div>
      </div>

      <div className="experiences__game-section">
        {playingLevelId ? (
          <div className="game-modal">
            <div className="game-modal-backdrop" onClick={handleCloseModal} />
            <div className="game-modal-content" ref={containerRef}>

              {/* R162 : bouton de fermeture explicite */}
              <button type="button" className="modal-close" onClick={handleCloseModal}>
                Fermer
              </button>

              <div className="game-wrapper">
                <iframe
                  ref={iframeRef}
                  title={`Jeu niveau ${playingLevelId}`}
                  src={`/game/game.html?difficulty=${playingLevelId}`}
                  className="game-iframe"
                  tabIndex={0}
                  onLoad={handleIframeLoaded}
                />

                <div className="parent-hud parent-health">
                  <div className="label">VIE</div>
                  <div className="health-track-parent">
                    <div className="health-bar-parent" style={{ width: `${healthPercent}%` }} />
                  </div>
                  <div className="health-status-parent">{Math.round(healthPercent)}%</div>
                </div>

                <div className="parent-hud parent-boost">
                  <div className="label">BOOST</div>
                  <div className="boost-track-parent">
                    <div className="boost-bar-parent" style={{ width: `${boostState.percent}%` }} />
                  </div>
                  <div className="boost-status-parent">{boostStatusLabel}</div>
                </div>
              </div>

              {isGameFinished && (
                <GameResultPanel
                  gameResult={gameResult}
                  playingLevelId={playingLevelId}
                  progressMap={progressMap}
                  onReplay={handleReplay}
                  onClose={handleCloseModal}
                  onNextLevel={handleNextLevel}
                  onClaimPromo={handleClaimPromo}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="game-placeholder">
            <p>Sélectionnez un niveau pour commencer l'expérience de jeu.</p>
          </div>
        )}
      </div>

      {promoUnlocked && (
        <div className="promo-panel">
          <h2>Félicitations ! Code promo débloqué !</h2>
          <p>Vous avez débloqué le code <strong>HUMAIN5</strong> — -5% sur votre réservation.</p>
          <button type="button" className="btn btn-primary" onClick={handleClaimPromo}>
            Réserver avec le code appliqué
          </button>
        </div>
      )}
    </div>
  );
};

export default Experiences;