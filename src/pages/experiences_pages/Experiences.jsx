import { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LevelCard from '../../components/experiences_components/LevelCard';
import Timeline from '../../components/global_components/Timeline';
import '../../styles/components/homepage_components/experiences.css';

const LEVELS = [
  { id: 1, name: 'NIVEAU 01 : NEO-TOKYO RUN', pilot: 'Kaneda' },
  { id: 2, name: 'NIVEAU 02 : GHOST HACK', pilot: 'Motoko' },
  { id: 3, name: "NIVEAU 03 : AU-DELÀ DE L'HUMAIN", pilot: 'Kaneda' },
];

const UNLOCK_THRESHOLD = 0.7;
const getProgressKey = (levelId) => `game_progress_level_${levelId}`;

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

// Panneau de résultat unique géré par React
function GameResultPanel({ gameResult, playingLevelId, progressMap, onReplay, onClose, onNextLevel, onClaimPromo }) {
  if (!gameResult) return null;
  const { t } = useTranslation();

  const isVictory = gameResult === 'victory';
  const isLastLevel = playingLevelId >= LEVELS.length;
  const levelProgress = progressMap[playingLevelId] || { collected: 0, total: 0 };
  const hasEnoughItems = getCompletionRatio(levelProgress) >= UNLOCK_THRESHOLD;

  let contextText = "";
  if (isVictory) {
    if (playingLevelId === 1) contextText = "Otomo, via Akira, questionne l'augmentation de l'humain, les modifications corporelles et leurs conséquences sociales. Est-ce que la technologie, d'autant plus à l'ère de l'IA, nous rend meilleurs ou nous éloigne de notre humanité ?";
    else if (playingLevelId === 2) contextText = "Ghost in the Shell : explore l'IA, l'identité et la notion de \"ghost\" (conscience) dans la machine, si nous sommes tous des cyborgs, qu'est-ce qui définit notre humanité ? Comment la technologie influence-t-elle notre perception de nous-mêmes et des autres ? Est-ce que des projets comme neuralink nous rapprochent de la singularité ou posent des risques éthiques majeurs ?";
    else contextText = "Mission accomplie. Le futur est entre vos mains. Voici votre code promo : HUMAIN5. Utilisez-le pour bénéficier de 5% de réduction sur votre prochaine réservation. Merci d'avoir joué ! Nous avons hâte de vous rencontrer.";
  } else {
    contextText = "Modification échouée, destruction du monde...";
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
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

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
  }, []);

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
    LEVELS.forEach((level, index) => {
      if (index === 0) map[level.id] = true;
      else {
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
        const levelId = msg.difficulty || playingLevelId;
        const value = { collected: msg.collected || 0, total: msg.total || 0 };
        saveProgress(levelId, value, setProgressMap);
        if (msg.type === 'game_init') { setIsGameFinished(false); setGameResult(null); }
      }
      if (msg.type === 'game_boost') setBoostState({ status: msg.status || 'charging', percent: msg.percent || 0 });
      if (msg.type === 'game_health') setHealthPercent(msg.percent || 0);
      if (msg.type === 'race_progress') setRacePercent(msg.percent || 0);
      if (msg.type === 'game_speed') setSpeedKmH(msg.speed || 0);
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
  }, [playingLevelId]);

  const handleSelectLevel = (levelId) => { setSelectedLevelId(levelId); if (unlockedMap[levelId]) setPlayingLevelId(levelId); };
  const handleIframeLoaded = () => iframeRef.current?.contentWindow?.postMessage({ type: 'start' }, '*');
  const handleReplay = () => { iframeRef.current?.contentWindow?.postMessage({ type: 'restart' }, '*'); setIsGameFinished(false); setGameResult(null); };
  const handleCloseModal = () => { setPlayingLevelId(null); setIsGameFinished(false); setGameResult(null); };
  const handleNextLevel = () => { if (playingLevelId >= LEVELS.length) return; setPlayingLevelId(playingLevelId + 1); setIsGameFinished(false); setGameResult(null); };
  const handleClaimPromo = () => navigate('/form-reservation', { state: { promoCode: 'HUMAIN5', promoApplied: true } });

  return (
    <div className="experiences-page">
      <h1>Expérience</h1>
      <p>Plongez dans une expérience immersive inspirée des univers d'Akira et Ghost in the Shell. Réussissez les 3 niveaux pour débloquer une récompense !</p>

      <div className="levels-grid">
        <Timeline count={LEVELS.length} />
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
              <button type="button" className="modal-close" onClick={handleCloseModal}>Fermer</button>
              
              <div className="game-wrapper">
                <iframe
                  ref={iframeRef}
                  title={`${t('pages.experiences.levelCard.label')} ${playingLevelId}`}
                  src={`/game/game.html?difficulty=${playingLevelId}`}
                  className="game-iframe"
                  onLoad={handleIframeLoaded}
                />

                {/* HUD Interne (Parent) */}
                <div className="parent-hud parent-health">
                  <div className="health-track-parent"><div className="health-bar-parent" style={{ width: `${healthPercent}%` }} /></div>
                  <div className="health-status-parent">{Math.round(healthPercent)}%</div>
                </div>

                <div className="parent-hud parent-boost">
                  <div className="label">{t('pages.experiences.boost')}</div>
                  <div className="boost-track-parent">
                    <div className="boost-bar-parent" style={{ width: `${Math.min(100, Math.max(0, boostState.percent || 0))}%` }} />
                  </div>
                  <div className="boost-status-parent">{boostState.status === 'active' ? 'ACTIF' : boostState.status === 'ready' ? 'PRÊT (SHIFT)' : 'CHARGEMENT...'}</div>
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
                  t={t}
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