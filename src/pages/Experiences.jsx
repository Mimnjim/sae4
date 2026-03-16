import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
      }
      if (msg.type === 'game_victory') {
        const { difficulty, collected, total } = msg;
        const value = { collected: collected || 0, total: total || 0 };
        localStorage.setItem(PROGRESS_KEY(difficulty), JSON.stringify(value));
        setProgressMap(prev => ({ ...prev, [difficulty]: value }));
        // If finished level 3 and >=70%, unlock promo
        if (difficulty === 3) {
          const percent = value.total > 0 ? value.collected / value.total : 0;
          if (percent >= 0.7) {
            localStorage.setItem('promo_unlocked', '1');
            setPromoUnlocked(true);
          }
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handlePlay = () => {
    if (!selected) return;
    if (!unlocked[selected]) return;
    setPlayLevel(selected);
  };

  const iframeRef = useRef(null);

  const handleReplay = () => {
    if (!iframeRef.current) return;
    // ask iframe to restart (it will reload itself)
    iframeRef.current.contentWindow.postMessage({ type: 'restart' }, '*');
  };

  const handleReserveWithPromo = () => {
    // navigate to the reservation page and pass the promo state
    navigate('/form-reservation', { state: { promoCode: 'HUMAIN5', promoApplied: true } });
  };

  return (
    <div className="experiences-page" style={{ padding: 48 }}>
      <h1>ARCHIVES SYNAPTIQUES</h1>
      <p>Sélectionnez un niveau d'immersion :</p>
      <div className="levels-menu" style={{ display: 'flex', gap: 12 }}>
        {LEVELS.map(l => {
          const p = progressMap[l.id] || { collected: 0, total: 0 };
          const percent = p.total > 0 ? Math.round((p.collected / p.total) * 100) : 0;
          return (
            <button
              key={l.id}
              onClick={() => setSelected(l.id)}
              disabled={!unlocked[l.id]}
              style={{
                padding: '0.6rem 1rem',
                background: selected === l.id ? '#2b7cff' : '#fff',
                color: selected === l.id ? '#fff' : '#111',
                border: '1px solid #ccc',
                opacity: unlocked[l.id] ? 1 : 0.5,
                cursor: unlocked[l.id] ? 'pointer' : 'not-allowed'
              }}
            >
              {l.name} {unlocked[l.id] ? `(${percent}%)` : '(verrouillé)'}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={handlePlay} disabled={!selected || !unlocked[selected]} style={{ padding: '0.6rem 1rem' }}>Jouer</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {playLevel ? (
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>Contrôles :</strong>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <div>↑ ↓ : vitesse</div>
                <div>← → : direction</div>
                <div>Shift : boost</div>
              </div>
            </div>
            <div style={{ width: '100%', height: '70vh', position: 'relative' }}>
              <iframe
                ref={iframeRef}
                title={`Jeu niveau ${playLevel}`}
                src={`/game/game.html?difficulty=${playLevel}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                onLoad={() => {
                  // signal iframe to start the game
                  if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage({ type: 'start' }, '*');
                  }
                }}
              />
              <button onClick={handleReplay} style={{ position: 'absolute', right: 12, top: 12, padding: '0.4rem 0.6rem' }}>Rejouer</button>
            </div>
          </div>
        ) : (
          <p>Sélectionnez un niveau puis cliquez sur <strong>Jouer</strong>.</p>
        )}
      </div>

      {promoUnlocked && (
        <div style={{ marginTop: 18 }}>
          <h3>Félicitations — code promo débloqué !</h3>
          <p>Vous avez débloqué le code <strong>HUMAIN5</strong> — -5% sur votre réservation.</p>
          <button onClick={handleReserveWithPromo} style={{ padding: '0.6rem 1rem' }}>Réserver avec le code appliqué</button>
        </div>
      )}
    </div>
  );
};

export default Experiences;