import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelCard from '../components/LevelCard';
import Timeline from '../components/Timeline';
import '../styles/experiences.css';

// ─── Constantes ──────────────────────────────────────────────────────────────

const LEVELS = [
  { id: 1, name: 'NIVEAU 01 : NEO-TOKYO RUN',       pilot: 'Kaneda' },
  { id: 2, name: 'NIVEAU 02 : GHOST HACK',           pilot: 'Motoko' },
  { id: 3, name: "NIVEAU 03 : AU-DELÀ DE L'HUMAIN",  pilot: '—'      },
];

// Pourcentage minimum d'objets collectés pour débloquer le niveau suivant
const UNLOCK_THRESHOLD = 0.7;

// Clé localStorage pour la progression d'un niveau donné
const getProgressKey = (levelId) => `game_progress_level_${levelId}`;

// ─── Fonctions utilitaires ────────────────────────────────────────────────────

// Calcule le ratio de complétion (entre 0 et 1) depuis un objet { collected, total }
function getCompletionRatio(progress) {
  if (!progress || progress.total === 0) return 0;
  return progress.collected / progress.total;
}

// Lit et parse la progression de tous les niveaux depuis le localStorage
function loadProgressFromStorage() {
  const result = {};
  LEVELS.forEach(level => {
    const raw = localStorage.getItem(getProgressKey(level.id));
    result[level.id] = raw ? JSON.parse(raw) : { collected: 0, total: 0 };
  });
  return result;
}

// Sauvegarde la progression d'un niveau dans le localStorage et met à jour le state
function saveProgress(levelId, value, setProgressMap) {
  localStorage.setItem(getProgressKey(levelId), JSON.stringify(value));
  setProgressMap(prev => ({ ...prev, [levelId]: value }));
}

// ─── Sous-composant : panneau de résultat ────────────────────────────────────

// Affiché par-dessus le jeu quand une partie se termine (victoire ou game over)
// Sorti du JSX principal pour éliminer les IIFE illisibles
function GameResultPanel({ gameResult, playingLevelId, progressMap, onReplay, onClose, onNextLevel, onClaimPromo }) {
  if (!gameResult) return null;

  const isVictory   = gameResult === 'victory';
  const isLastLevel = playingLevelId >= LEVELS.length;

  const levelProgress    = progressMap[playingLevelId] || { collected: 0, total: 0 };
  const completionRatio  = getCompletionRatio(levelProgress);
  const hasEnoughItems   = completionRatio >= UNLOCK_THRESHOLD;

  return (
    <div className="result-panel">
      <h3>{isVictory ? 'Victoire !' : 'Game Over'}</h3>

      <div className="result-actions">
        <button className="btn btn-light" onClick={onReplay}>Réessayer</button>
        <button className="btn"           onClick={onClose}>Quitter</button>

        {/* En cas de victoire sur un niveau intermédiaire */}
        {isVictory && !isLastLevel && (
          hasEnoughItems
            ? <button className="btn btn-primary" onClick={onNextLevel}>Niveau suivant</button>
            : <button className="btn" disabled>Récoltez 70% des objets pour continuer</button>
        )}

        {/* En cas de victoire sur le dernier niveau avec assez d'objets */}
        {isVictory && isLastLevel && hasEnoughItems && (
          <button className="btn btn-primary" onClick={onClaimPromo}>
            Récupérer le code promo
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const Experiences = () => {
  const navigate = useNavigate();

  // Refs pour l'iframe du jeu et le conteneur de la modal
  const iframeRef    = useRef(null);
  const containerRef = useRef(null);

  // --- Sélection et lecture des niveaux ---
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [playingLevelId,  setPlayingLevelId]  = useState(null);

  // --- Progression persistée ---
  const [progressMap,   setProgressMap]   = useState({});
  const [promoUnlocked, setPromoUnlocked] = useState(false);

  // --- État d'une partie en cours ---
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [gameResult,     setGameResult]     = useState(null); // 'victory' | 'over' | null

  // --- Données HUD reçues de l'iframe via postMessage ---
  const [boostState,    setBoostState]    = useState({ status: 'charging', percent: 0 });
  const [healthPercent, setHealthPercent] = useState(100);

  // Chargement initial depuis le localStorage
  useEffect(() => {
    setProgressMap(loadProgressFromStorage());
    if (localStorage.getItem('promo_unlocked') === '1') setPromoUnlocked(true);
  }, []);

  // Calcule quels niveaux sont débloqués selon la progression du niveau précédent
  // useMemo évite de recalculer à chaque rendu si progressMap n'a pas changé
  const unlockedMap = useMemo(() => {
    const map = {};
    LEVELS.forEach((level, index) => {
      if (index === 0) {
        map[level.id] = true; // le premier niveau est toujours accessible
      } else {
        const previousLevelId = LEVELS[index - 1].id;
        const previousProgress = progressMap[previousLevelId];
        map[level.id] = getCompletionRatio(previousProgress) >= UNLOCK_THRESHOLD;
      }
    });
    return map;
  }, [progressMap]);

  // Écoute les messages postMessage envoyés par l'iframe du jeu
  useEffect(() => {
    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || !msg.type) return;

      if (msg.type === 'game_init' || msg.type === 'game_progress') {
        if (!msg.difficulty) return;
        const value = { collected: msg.collected || 0, total: msg.total || 0 };
        saveProgress(msg.difficulty, value, setProgressMap);
        // game_init signale que le jeu vient de (re)démarrer
        if (msg.type === 'game_init') {
          setIsGameFinished(false);
          setGameResult(null);
        }
      }

      if (msg.type === 'game_boost') {
        setBoostState({ status: msg.status || 'charging', percent: msg.percent || 0 });
      }

      if (msg.type === 'game_health') {
        setHealthPercent(msg.percent || 0);
      }

      if (msg.type === 'game_victory') {
        const value = { collected: msg.collected || 0, total: msg.total || 0 };
        saveProgress(msg.difficulty, value, setProgressMap);

        // Débloque le code promo si le niveau 3 est terminé avec ≥70% des objets
        if (msg.difficulty === 3 && getCompletionRatio(value) >= UNLOCK_THRESHOLD) {
          localStorage.setItem('promo_unlocked', '1');
          setPromoUnlocked(true);
        }

        setIsGameFinished(true);
        setGameResult('victory');
      }

      if (msg.type === 'game_over') {
        setIsGameFinished(true);
        setGameResult('over');
      }
    };

    window.addEventListener('message', handleMessage);
    // Nettoyage : on retire l'écouteur quand le composant est démonté
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Donne le focus à l'iframe dès qu'un niveau commence
  // (nécessaire pour que les touches clavier soient capturées par le jeu)
  useEffect(() => {
    if (!playingLevelId || !iframeRef.current) return;
    const timer = setTimeout(() => {
      iframeRef.current?.focus();
      iframeRef.current?.contentWindow?.postMessage({ type: 'focus' }, '*');
    }, 120);
    return () => clearTimeout(timer);
  }, [playingLevelId]);

  // ─── Gestionnaires d'événements ─────────────────────────────────────────────

  const handleSelectLevel = (levelId) => {
    setSelectedLevelId(levelId);
    // Si le niveau est débloqué, on le lance directement
    if (unlockedMap[levelId]) setPlayingLevelId(levelId);
  };

  const handleIframeLoaded = () => {
    // Envoie le signal de démarrage à l'iframe une fois qu'elle est chargée
    iframeRef.current?.contentWindow?.postMessage({ type: 'start' }, '*');
  };

  const handleReplay = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'restart' }, '*');
    setIsGameFinished(false);
    setGameResult(null);
  };

  const handleCloseModal = () => {
    setPlayingLevelId(null);
    setIsGameFinished(false);
    setGameResult(null);
  };

  const handleNextLevel = () => {
    if (!playingLevelId || playingLevelId >= LEVELS.length) return;
    setPlayingLevelId(playingLevelId + 1);
    setIsGameFinished(false);
    setGameResult(null);
  };

  const handleClaimPromo = () => {
    // Redirige vers le formulaire de réservation avec le code promo pré-appliqué
    navigate('/form-reservation', { state: { promoCode: 'HUMAIN5', promoApplied: true } });
  };

  // Texte du statut boost affiché dans le HUD parent
  const boostStatusLabel =
    boostState.status === 'active' ? 'ACTIF' :
    boostState.status === 'ready'  ? 'PRÊT'  : 'CHARGEMENT';

  // ─── Rendu ───────────────────────────────────────────────────────────────────

  return (
    <div className="experiences-page">
      <h1>Jeu Expérience</h1>
      <p>Présentation courte de Ghost in the Shell — plongez dans une expérience immersive inspirée des univers d'Akira et Ghost in the Shell.</p>

      {/* Grille timeline + liste des niveaux */}
      <div className="levels-grid">
        <Timeline count={LEVELS.length} />
        <div className="levels-list">
          {LEVELS.map(level => {
            const progress = progressMap[level.id] || { collected: 0, total: 0 };
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

      {/* Zone de jeu */}
      <div className="experiences__game-section">
        {playingLevelId ? (

          <div className="game-modal">
            <div className="game-modal-backdrop" onClick={handleCloseModal} />
            <div className="game-modal-content" ref={containerRef}>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>

              <div className="game-wrapper">
                <iframe
                  ref={iframeRef}
                  title={`Jeu niveau ${playingLevelId}`}
                  src={`/game/game.html?difficulty=${playingLevelId}`}
                  className="game-iframe"
                  tabIndex={0}
                  onLoad={handleIframeLoaded}
                />

                {/* HUD parent : vie et boost affichés par-dessus l'iframe */}
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

              {/* Panneau de résultat (victoire ou game over) */}
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
          <p>Sélectionnez un niveau puis cliquez sur <strong>Commencer la course</strong>.</p>
        )}
      </div>

      {/* Bandeau promo affiché si le joueur a débloqué le code */}
      {promoUnlocked && (
        <div className="promo-panel">
          <h3>Félicitations — code promo débloqué !</h3>
          <p>Vous avez débloqué le code <strong>HUMAIN5</strong> — -5% sur votre réservation.</p>
          <button className="btn btn-primary" onClick={handleClaimPromo}>
            Réserver avec le code appliqué
          </button>
        </div>
      )}
    </div>
  );
};

export default Experiences;