import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LevelCard from '../../components/experiences_components/LevelCard';
import Timeline from '../../components/global_components/Timeline';
import '../../styles/components/homepage_components/experiences.css';

const LEVELS = [
  { id: 1, nameKey: 'pages.experiences.levels.level1.name', pilotKey: 'pages.experiences.levels.level1.pilot' },
  { id: 2, nameKey: 'pages.experiences.levels.level2.name', pilotKey: 'pages.experiences.levels.level2.pilot' },
  { id: 3, nameKey: 'pages.experiences.levels.level3.name', pilotKey: 'pages.experiences.levels.level3.pilot' },
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
function GameResultPanel({ gameResult, playingLevelId, progressMap, onReplay, onClose, onNextLevel, onClaimPromo, t }) {
  if (!gameResult) return null;

  const isVictory      = gameResult === 'victory';
  const isLastLevel    = playingLevelId >= LEVELS.length;
  const levelProgress  = progressMap[playingLevelId] || { collected: 0, total: 0 };
  const hasEnoughItems = getCompletionRatio(levelProgress) >= UNLOCK_THRESHOLD;

  return (
    <div className="result-panel">
      {/* R234 : h2 car c'est le titre principal de ce panneau */}
      <h2>{isVictory ? t('pages.experiences.victory') : t('pages.experiences.gameOver')}</h2>
      <div className="result-actions">
        <button type="button" className="btn btn-light" onClick={onReplay}>{t('pages.experiences.retry')}</button>
        <button type="button" className="btn"           onClick={onClose}>{t('pages.experiences.quit')}</button>

        {isVictory && !isLastLevel && (
          hasEnoughItems
            ? <button type="button" className="btn btn-primary" onClick={onNextLevel}>{t('pages.experiences.nextLevel')}</button>
            : <button type="button" className="btn" disabled>{t('pages.experiences.collectItems')}</button>
        )}

        {isVictory && isLastLevel && hasEnoughItems && (
          <button type="button" className="btn btn-primary" onClick={onClaimPromo}>
            {t('pages.experiences.claimPromo')}
          </button>
        )}
      </div>
    </div>
  );
}

const Experiences = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const boostStatusLabel = boostState.status === 'active' ? t('pages.experiences.boost.active') : boostState.status === 'ready' ? t('pages.experiences.boost.ready') : t('pages.experiences.boost.charging');

  return (
    <div className="experiences-page">
      <h1>{t('pages.experiences.title')}</h1>
      <p>{t('pages.experiences.description')}</p>
      <p>{t('pages.experiences.sub_description')}</p>

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

              {/* R162 : Fenêtres modales dotées d'un bouton de fermeture explicite
                  - Bouton visible avec texte "Fermer" lisible
                  - aria-label pour précision accessibilité
                  - Positionné top-right, taille 44x44px (cible tactile)
                  - Focus visible pour accessibilité clavier */}
              <button 
                type="button" 
                className="modal-close" 
                onClick={handleCloseModal}
                aria-label="Fermer la modale du jeu"
              >
                {t('pages.experiences.close')}
              </button>

              <div className="game-wrapper">
                <iframe
                  ref={iframeRef}
                  title={`${t('pages.experiences.levelCard.label')} ${playingLevelId}`}
                  src={`/game/game.html?difficulty=${playingLevelId}`}
                  className="game-iframe"
                  tabIndex={0}
                  onLoad={handleIframeLoaded}
                />

                <div className="parent-hud parent-health">
                  <div className="label">{t('pages.experiences.health')}</div>
                  <div className="health-track-parent">
                    <div className="health-bar-parent" style={{ width: `${healthPercent}%` }} />
                  </div>
                  <div className="health-status-parent">{Math.round(healthPercent)}%</div>
                </div>

                <div className="parent-hud parent-boost">
                  <div className="label">{t('pages.experiences.boost')}</div>
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
                  t={t}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="game-placeholder">
            <p>{t('pages.experiences.selectLevel')}</p>
          </div>
        )}
      </div>

      {promoUnlocked && (
        <div className="promo-panel">
          <h2>{t('pages.experiences.congratulations')}</h2>
          <p>{t('pages.experiences.promoUnlockedText')}</p>
          <button type="button" className="btn btn-primary" onClick={handleClaimPromo}>
            {t('pages.experiences.bookWithPromo')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Experiences;