import { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LevelCard from '../../components/experiences_components/LevelCard';
import Timeline from '../../components/global_components/Timeline';
import { useSoundContext } from '../../sound/SoundContext';
import '../../styles/components/homepage_components/experiences.css';

const LEVEL_IDS = [
  { id: 1, pilot: 'Kaneda' },
  { id: 2, pilot: 'Motoko' },
  { id: 3, pilot: 'Kaneda' },
];

const UNLOCK_THRESHOLD = 0.7;
const getProgressKey = (levelId) => `game_progress_level_${levelId}`;

function getCompletionRatio(progress) {
  if (!progress || progress.total === 0) return 0;
  return progress.collected / progress.total;
}

function loadProgressFromStorage() {
  const result = {};
  LEVEL_IDS.forEach(level => {
    const raw = localStorage.getItem(getProgressKey(level.id));
    result[level.id] = raw ? JSON.parse(raw) : { collected: 0, total: 0 };
  });
  return result;
}

function saveProgress(levelId, value, setProgressMap) {
  localStorage.setItem(getProgressKey(levelId), JSON.stringify(value));
  setProgressMap(prev => ({ ...prev, [levelId]: value }));
}

// Panneau de résultat unique géré par React
function GameResultPanel({ gameResult, playingLevelId, progressMap, onReplay, onClose, onNextLevel, onClaimPromo }) {
  if (!gameResult) return null;
  const { t } = useTranslation();

  const isVictory = gameResult === 'victory';
  const isLastLevel = playingLevelId >= LEVEL_IDS.length;
  const levelProgress = progressMap[playingLevelId] || { collected: 0, total: 0 };
  const hasEnoughItems = getCompletionRatio(levelProgress) >= UNLOCK_THRESHOLD;

  let contextText = "";
  if (isVictory) {
    if (playingLevelId === 1) contextText = t('experiences.context_level1');
    else if (playingLevelId === 2) contextText = t('experiences.context_level2');
    else contextText = t('experiences.context_level3');
  } else {
    contextText = t('experiences.context_defeat');
  }

  return (
    <div className="result-panel">
      <h2>{isVictory ? t('experiences.victory') : t('experiences.game_over')}</h2>

      <p className="result-context">
        {contextText}
      </p>

      <div className="result-actions">
        <button type="button" className="btn btn-light" onClick={onReplay}>{t('experiences.retry')}</button>
        
        {/* Bouton Quitter avec texte noir */}
        <button type="button" className="btn btn-light btn-quit" onClick={onClose}>
          {t('experiences.quit')}
        </button>

        {isVictory && !isLastLevel && (
          hasEnoughItems
            ? <button type="button" className="btn btn-primary" onClick={onNextLevel}>{t('experiences.next_level')}</button>
            : <button type="button" className="btn" disabled>{t('experiences.need_items')}</button>
        )}

        {isVictory && isLastLevel && hasEnoughItems && (
          <button type="button" className="btn btn-primary" onClick={onClaimPromo}>
            {t('experiences.claim_promo')}
          </button>
        )}
      </div>
    </div>
  );
}


const Experiences = () => {
  const { t } = useTranslation();
  const { playSound, playGameMusic, stopGameMusic } = useSoundContext();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const isRestarting = useRef(false);

  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [playingLevelId, setPlayingLevelId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [promoUnlocked, setPromoUnlocked] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [boostState, setBoostState] = useState({ status: 'charging', percent: 0 });
  const [healthPercent, setHealthPercent] = useState(100);
  const [racePercent, setRacePercent] = useState(0);
  const [speedKmH, setSpeedKmH] = useState(0);

  useEffect(() => {
    setProgressMap(loadProgressFromStorage());
    if (localStorage.getItem('promo_unlocked') === '1') setPromoUnlocked(true);
  }, [t]);

  useEffect(() => {
    // inject shared game UI stylesheet (served from /styles) so parent can render unified panel styles
    if (typeof document === 'undefined') return;
    if (document.getElementById('game-ui-stylesheet')) return;
    const link = document.createElement('link');
    link.id = 'game-ui-stylesheet';
    link.rel = 'stylesheet';
    link.href = '/styles/game-ui.css';
    document.head.appendChild(link);
  }, []);

  const unlockedMap = useMemo(() => {
    const map = {};
    LEVEL_IDS.forEach((level, index) => {
      if (index === 0) map[level.id] = true;
      else {
        const previousProgress = progressMap[LEVEL_IDS[index - 1].id];
        map[level.id] = getCompletionRatio(previousProgress) >= UNLOCK_THRESHOLD;
      }
    });
    return map;
  }, [progressMap]);

  useEffect(() => {
    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg?.type) return;

      if (msg.type === 'game_init') {
        const levelId = msg.difficulty || playingLevelId;
        // Si c'est un restart, réinitialiser les collectibles à 0. Sinon, garder la valeur antérieure.
        const previousValue = progressMap[levelId] || { collected: 0, total: 0 };
        const collectedValue = isRestarting.current ? 0 : previousValue.collected;
        const value = { collected: collectedValue, total: msg.total || 0 };
        saveProgress(levelId, value, setProgressMap);
        isRestarting.current = false; // Réinitialiser la flag
        setIsGameFinished(false);
        setGameResult(null);
      }

      if (msg.type === 'game_progress') {
        const levelId = msg.difficulty || playingLevelId;
        const value = { collected: msg.collected || 0, total: msg.total || 0 };
        saveProgress(levelId, value, setProgressMap);
      }
      if (msg.type === 'game_boost') setBoostState({ status: msg.status || 'charging', percent: msg.percent || 0 });
      if (msg.type === 'game_health') setHealthPercent(msg.percent || 0);
      if (msg.type === 'race_progress') setRacePercent(msg.percent || 0);
      if (msg.type === 'game_speed') setSpeedKmH(msg.speed || 0);
      if (msg.type === 'game_victory') {
        // Arrêter la musique du jeu immédiatement
        stopGameMusic();
        
        setTimeout(() => {
          playSound('achievement');
        }, 200);
        
        const value = { collected: msg.collected || 0, total: msg.total || 0 };
        saveProgress(msg.difficulty, value, setProgressMap);
        if (msg.difficulty === LEVEL_IDS.length && getCompletionRatio(value) >= UNLOCK_THRESHOLD) {
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
  }, [playingLevelId, t]);

  const getLevelName = (levelId) => t(`experiences.level${levelId}`);

  const LEVELS = useMemo(
    () => LEVEL_IDS.map(level => ({
      ...level,
      nameKey: `pages.experiences.levels.level${level.id}.name`,
      pilotKey: `pages.experiences.levels.level${level.id}.pilot`
    })),
    [t]
  );

  const handleSelectLevel = (levelId) => { 
    setSelectedLevelId(levelId); 
    if (unlockedMap[levelId]) {
      setPlayingLevelId(levelId);
      playGameMusic();
    }
  };
  const handleIframeLoaded = () => iframeRef.current?.contentWindow?.postMessage({ type: 'start' }, '*');
  const handleReplay = () => { 
    stopGameMusic();
    isRestarting.current = true; // Marquer que c'est un restart
    iframeRef.current?.contentWindow?.postMessage({ type: 'restart' }, '*'); 
    setIsGameFinished(false); 
    setGameResult(null);
    playGameMusic(); // Relancer la musique du jeu
  };
  const handleCloseModal = () => { 
    setPlayingLevelId(null); 
    setIsGameFinished(false); 
    setGameResult(null);
    stopGameMusic();
  };
  const handleNextLevel = () => { if (playingLevelId >= LEVEL_IDS.length) return; setPlayingLevelId(playingLevelId + 1); setIsGameFinished(false); setGameResult(null); };
  const handleClaimPromo = () => navigate('/form-reservation', { state: { promoCode: 'HUMAIN5', promoApplied: true } });

  return (
    <div className="experiences-page">
      <h1>{t('experiences.pageTitle')}</h1>
      <p>{t('experiences.pageDescription')}</p>

      <div className="levels-grid">
        <Timeline count={LEVEL_IDS.length} />
        <div className="levels-list">
          {LEVELS.map(level => (
            <LevelCard
              key={level.id}
              level={level}
              unlocked={!!unlockedMap[level.id]}
              percent={Math.round(getCompletionRatio(progressMap[level.id]) * 100)}
              onSelect={handleSelectLevel}
              selected={selectedLevelId === level.id}
            />
          ))}
        </div>
      </div>

      <div className="experiences__game-section">
        {playingLevelId && (
          <div className="game-modal">
            <div className="game-modal-backdrop" onClick={handleCloseModal} />
            <div className="game-modal-content" ref={containerRef}>
              <button type="button" className="modal-close" onClick={handleCloseModal}>×</button>
              
              <div className="game-wrapper">
                <iframe
                  ref={iframeRef}
                  title={`${t('pages.experiences.levelCard.label')} ${playingLevelId}`}
                  src={`/game/game.html?difficulty=${playingLevelId}`}
                  className="game-iframe"
                  scrolling="no"
                  onLoad={handleIframeLoaded}
                />

                {/* HUD Interne (Parent) */}
                <div className="parent-hud parent-health">
                  <div className="health-track-parent"><div className="health-bar-parent" style={{ width: `${healthPercent}%` }} /></div>
                  <div className="health-status-parent">{Math.round(healthPercent)}%</div>
                </div>

                <div className="parent-hud parent-boost">
                  <div className="label">{t('experiences.boost')}</div>
                  <div className="boost-track-parent">
                    <div className="boost-bar-parent" style={{ width: `${Math.min(100, Math.max(0, boostState.percent || 0))}%` }} />
                  </div>
                  <div className="boost-status-parent">{boostState.status === 'active' ? t('experiences.boostActive') : boostState.status === 'ready' ? t('experiences.boostReady') : t('experiences.boostCharging')}</div>
                </div>

                <div className="parent-hud parent-speed">
                    <div className="speedometer"><div className="speed-value">{Math.round(speedKmH)}</div><div className="speed-unit">km/h</div></div>
                </div>

                <div className="parent-hud parent-race">
                    <div className="race-track"><div className="race-bar" style={{ width: `${racePercent}%` }} /></div>
                    <div className="items-status">
                        {(progressMap[playingLevelId]?.collected || 0)} / {(progressMap[playingLevelId]?.total || 0)}
                    </div>
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
        )}
      </div>
    </div>
  );
};

export default Experiences;