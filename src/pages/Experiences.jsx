import { useEffect, useMemo, useState, useRef } from 'react';
import LevelCard from '../components/LevelCard';
import Timeline from '../components/Timeline';
import { useNavigate } from 'react-router-dom';
import '../styles/experiences.css';

const LEVELS = [
  { id: 1, name: 'NIVEAU 01 : NEO-TOKYO RUN' },
  { id: 2, name: 'NIVEAU 02 : GHOST HACK' },
  { id: 3, name: 'NIVEAU 03 : AU-DELÀ DE L\'HUMAIN' },
];

const PROGRESS_KEY = (level) => `game_progress_level_${level}`;

const Experiences = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [playLevel, setPlayLevel] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [promoUnlocked, setPromoUnlocked] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'victory' | 'over' | null
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [boostState, setBoostState] = useState({ status: 'charging', percent: 0 });
  const [healthPercent, setHealthPercent] = useState(100);
  const [raceProgress, setRaceProgress] = useState(0);

  useEffect(() => {
    const initial = {};
    LEVELS.forEach(l => {
      const raw = localStorage.getItem(PROGRESS_KEY(l.id));
      if (raw) {
        initial[l.id] = JSON.parse(raw);
      } else {
        initial[l.id] = { collected: 0, total: 0 };
      }
    });
    setProgressMap(initial);
    if (localStorage.getItem('promo_unlocked') === '1') setPromoUnlocked(true);
  }, []);

  const unlocked = useMemo(() => {
    const map = {};
    LEVELS.forEach((lvl, idx) => {
      if (idx === 0) map[lvl.id] = true;
      else {
        const prev = LEVELS[idx - 1].id;
        const p = progressMap[prev] || { collected: 0, total: 0 };
        const percent = p.total > 0 ? p.collected / p.total : 0;
        map[lvl.id] = percent >= 0.7;
      }
    });
    return map;
  }, [progressMap]);

  useEffect(() => {
    const handler = (e) => {
      const msg = e.data || {};
      if (!msg.type) return;
      if (msg.type === 'game_progress' || msg.type === 'game_init') {
        const { difficulty, collected, total } = msg;
        if (!difficulty) return;
        const value = { collected: collected || 0, total: total || 0 };
        localStorage.setItem(PROGRESS_KEY(difficulty), JSON.stringify(value));
        setProgressMap(prev => ({ ...prev, [difficulty]: value }));
        if (msg.type === 'game_init') {
          setGameFinished(false);
          setGameResult(null);
        }
      }
      if (msg.type === 'game_boost') {
        const { status, percent } = msg;
        setBoostState({ status: status || 'charging', percent: percent || 0 });
      }
      if (msg.type === 'game_health') {
        setHealthPercent(msg.percent || 0);
      }
      if (msg.type === 'race_progress') {
        setRaceProgress(msg.percent || 0);
      }
      if (msg.type === 'game_victory') {
        const { difficulty, collected, total } = msg;
        const value = { collected: collected || 0, total: total || 0 };
        localStorage.setItem(PROGRESS_KEY(difficulty), JSON.stringify(value));
        setProgressMap(prev => ({ ...prev, [difficulty]: value }));
        // unlock promo if level 3 and >=70%
        if (difficulty === 3) {
          const percent = value.total > 0 ? value.collected / value.total : 0;
          if (percent >= 0.7) {
            localStorage.setItem('promo_unlocked', '1');
            setPromoUnlocked(true);
          }
        }
        // always mark finished and show victory UI
        setGameFinished(true);
        setGameResult('victory');
      }
      if (msg.type === 'game_over') {
        // mark finished and show game over UI
        setGameFinished(true);
        setGameResult('over');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // keep track of fullscreen state
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handlePlay = () => {
    if (!selected) return;
    if (!unlocked[selected]) return;
    setGameFinished(false);
    setPlayLevel(selected);
  };

  const iframeRef = useRef(null);

  // focus iframe when a level is started
  useEffect(() => {
    if (!playLevel || !iframeRef.current) return;
    setTimeout(() => {
      try {
        iframeRef.current.focus();
        iframeRef.current.contentWindow.postMessage({ type: 'focus' }, '*');
      } catch (e) {}
    }, 120);
  }, [playLevel]);

  const handleToggleFullscreen = async () => {
    // prefer fullscreen on the iframe itself so the canvas inside fills the screen
    const el = iframeRef.current || containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleReplay = () => {
    if (!iframeRef.current) return;
    // ask iframe to restart (it will reload itself)
    iframeRef.current.contentWindow.postMessage({ type: 'restart' }, '*');
    setGameFinished(false);
    setGameResult(null);
  };

  const handleCloseModal = () => {
    setPlayLevel(null);
    setGameFinished(false);
    setGameResult(null);
  };

  const handleNextLevel = () => {
    if (!playLevel) return;
    if (playLevel >= 3) return;
    const next = playLevel + 1;
    setPlayLevel(next);
    setGameFinished(false);
    setGameResult(null);
  };

  const handleReserveWithPromo = () => {
    // navigate to the reservation page and pass the promo state
    navigate('/form-reservation', { state: { promoCode: 'HUMAIN5', promoApplied: true } });
  };

  return (
    <div className="experiences-page">
      <h1>ARCHIVES SYNAPTIQUES</h1>
      <p>Sélectionnez un niveau d'immersion :</p>
      <div className="levels-grid">
        <Timeline count={LEVELS.length} />
        <div className="levels-list">
          {LEVELS.map(l => {
            const p = progressMap[l.id] || { collected: 0, total: 0 };
            const percent = p.total > 0 ? Math.round((p.collected / p.total) * 100) : 0;
            return (
              <LevelCard
                key={l.id}
                level={l}
                unlocked={!!unlocked[l.id]}
                percent={percent}
                onSelect={(id) => setSelected(id)}
                selected={selected === l.id}
              />
            );
          })}
        </div>
      </div>

      <div className="play-area">
        <button onClick={handlePlay} disabled={!selected || !unlocked[selected]} className="play-btn">Jouer</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {playLevel ? (
          <div>
            <div className="controls">
              <strong>Contrôles :</strong>
              <div className="controls-list">
                <div>↑ ↓ : vitesse</div>
                <div>← → : direction</div>
                <div>Shift : boost</div>
              </div>
            </div>

            {/* Modal-style overlay to host the game */}
            <div className="game-modal">
              <div className="game-modal-backdrop" onClick={handleCloseModal} />
              <div className="game-modal-content" ref={containerRef}>
                <button className="modal-close" onClick={handleCloseModal}>✕</button>

                <div className="game-wrapper">
                  <iframe
                    ref={iframeRef}
                    title={`Jeu niveau ${playLevel}`}
                    src={`/game/game.html?difficulty=${playLevel}`}
                    className="game-iframe"
                    tabIndex={0}
                    onLoad={() => {
                      // signal iframe to start the game
                      if (iframeRef.current && iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage({ type: 'start' }, '*');
                      }
                    }}
                  />
                  {/* Parent HUD: boost and health kept; removed parent race and parent score (items/progress) per request */}
                  <div className="parent-hud parent-health">
                    <div className="label">VIE</div>
                    <div className="health-track-parent"><div className="health-bar-parent" style={{ width: `${healthPercent}%` }} /></div>
                    <div className="health-status-parent">{Math.round(healthPercent)}%</div>
                  </div>
                  <div className="parent-hud parent-boost">
                    <div className="label">BOOST</div>
                    <div className="boost-track-parent"><div className="boost-bar-parent" style={{ width: `${boostState.percent}%` }} /></div>
                    <div className="boost-status-parent">{boostState.status === 'active' ? 'ACTIF' : boostState.status === 'ready' ? 'PRÊT' : 'CHARGEMENT'}</div>
                  </div>
                </div>

                {/* actions removed (no fullscreen button requested) */}

                {gameFinished && (
                  <div className="result-panel">
                    {gameResult === 'victory' ? (
                      <div>
                        <h3>Victoire !</h3>
                        <div className="result-actions">
                          <button onClick={handleReplay} className="btn btn-light">Ressayer</button>
                          <button onClick={handleCloseModal} className="btn">Quitter</button>
                          {playLevel < 3 ? (
                            (() => {
                              const p = progressMap[playLevel] || { collected: 0, total: 0 };
                              const percent = p.total > 0 ? (p.collected / p.total) : 0;
                              // Only show next-level button if >=70% of items collected
                              return percent >= 0.7 ? (
                                <button onClick={handleNextLevel} className="btn btn-primary">Niveau suivant</button>
                              ) : (
                                <button className="btn" disabled style={{ background: '#ffecb3', color: '#000', cursor: 'not-allowed', border: '1px solid rgba(0,0,0,0.08)' }}>
                                  Récoltez 70% des objets pour passer au niveau suivant
                                </button>
                              );
                            })()
                          ) : (
                            // level 3 completed: offer promo when >=70%
                            (() => {
                              const p = progressMap[playLevel] || { collected: 0, total: 0 };
                              const percent = p.total > 0 ? p.collected / p.total : 0;
                              return percent >= 0.7 ? (
                                <button onClick={handleReserveWithPromo} className="btn btn-primary">Récupérer le code promo</button>
                              ) : null;
                            })()
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3>Game Over</h3>
                        <div className="result-actions">
                          <button onClick={handleReplay} className="btn btn-light">Ressayer</button>
                          <button onClick={handleCloseModal} className="btn">Quitter</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Sélectionnez un niveau puis cliquez sur <strong>Jouer</strong>.</p>
        )}
      </div>

      {promoUnlocked && (
        <div className="promo-panel">
          <h3>Félicitations — code promo débloqué !</h3>
          <p>Vous avez débloqué le code <strong>HUMAIN5</strong> — -5% sur votre réservation.</p>
          <button onClick={handleReserveWithPromo} className="btn btn-primary">Réserver avec le code appliqué</button>
        </div>
      )}
    </div>
  );
};

export default Experiences;