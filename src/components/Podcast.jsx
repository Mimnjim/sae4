// import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
// import gsap from 'gsap';
// import '../styles/podcast.css';

// const podcasts = [
//     {
//         id:       'tech-in-comic',
//         title:    'Tech In Comic',
//         guest:    'Tom Delavigne × Jimmy TE',
//         desc:     'Intelligence artificielle, interfaces neuronales, mégalopoles du futur — comment Otomo et Shirow ont anticipé notre réalité technologique.',
//         duration: '42 min',
//         src:      '/podcast/Tech_In_Comic-Delavigne_Tom-TE_Jimmy.mp3',
//         color:    '#00d4ff',
//     },
//     {
//         id:       'au-dela-chair',
//         title:    'Au-Delà de la Chair',
//         guest:    'Épisode 2 — Cyborg & Identité',
//         desc:     'Quand le corps devient machine, que reste-t-il de l\'humanité ? Retour sur les thèmes philosophiques qui traversent Ghost in the Shell.',
//         duration: '38 min',
//         src:      '/podcast/podcast_akira_GITS_melina_lana_deborah_alexis.mp3',
//         color:    '#ff6ec7',
//     },
// ];

// export default function Podcast() {
//     const [activePodcast, setActivePodcast] = useState(null);
//     const modalRef = useRef(null);

//     const openModal = useCallback((podcast) => {
//         setActivePodcast(podcast);
//     }, []);

//     const closeModal = useCallback(() => {
//         if (!modalRef.current) return;
//         gsap.to(modalRef.current, {
//             opacity: 0, scale: 0.97,
//             duration: 0.35, ease: 'power3.in',
//             onComplete: () => setActivePodcast(null),
//         });
//     }, []);

//     // Entrée modal
//     useEffect(() => {
//         if (!activePodcast || !modalRef.current) return;
//         gsap.fromTo(modalRef.current,
//             { opacity: 0, scale: 0.97 },
//             { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
//         );
//     }, [activePodcast]);

//     // Fermer sur Escape
//     useEffect(() => {
//         const handler = (e) => { if (e.key === 'Escape') closeModal(); };
//         window.addEventListener('keydown', handler);
//         return () => window.removeEventListener('keydown', handler);
//     }, [closeModal]);

//     return (
//         <section className="pod-section">

//             <header className="pod-header">
//                 <span className="pod-eyebrow">Écouter · Découvrir</span>
//                 <h2 className="pod-title">Les Podcasts<br />de l'Exposition</h2>
//                 <p className="pod-intro">
//                     Deux épisodes exclusifs pour prolonger l'expérience.
//                     Des voix, des idées, et des questions qui restent.
//                 </p>
//             </header>

//             <div className="pod-cards">
//                 {podcasts.map((p) => (
//                     <PodcastCard key={p.id} podcast={p} onPlay={() => openModal(p)} />
//                 ))}
//             </div>

//             {activePodcast && (
//                 <PodcastModal
//                     ref={modalRef}
//                     podcast={activePodcast}
//                     onClose={closeModal}
//                 />
//             )}

//         </section>
//     );
// }

// /* ── Carte podcast ──────────────────────────────────────────── */

// function PodcastCard({ podcast, onPlay }) {
//     return (
//         <div className="pod-card">
//             <div className="pod-card-color-bar" style={{ background: podcast.color }} />
//             <div className="pod-card-body">
//                 <div className="pod-card-meta">
//                     <span className="pod-card-duration">{podcast.duration}</span>
//                 </div>
//                 <h3 className="pod-card-title">{podcast.title}</h3>
//                 <p className="pod-card-guest">{podcast.guest}</p>
//                 <p className="pod-card-desc">{podcast.desc}</p>
//             </div>
//             <button
//                 className="pod-card-play"
//                 onClick={onPlay}
//                 style={{ '--accent': podcast.color }}
//                 aria-label={`Écouter ${podcast.title}`}
//             >
//                 <PlayIcon />
//                 <span>Écouter</span>
//             </button>
//         </div>
//     );
// }

// /* ── Modal player ───────────────────────────────────────────── */

// const PodcastModal = forwardRef(function PodcastModal({ podcast, onClose }, ref) {
//     const audioRef      = useRef(null);
//     const canvasRef     = useRef(null);
//     const rafRef        = useRef(null);
//     const analyserRef   = useRef(null);
//     const audioCtxRef   = useRef(null);
//     const sourceRef     = useRef(null);
//     const waveformRef   = useRef(null);
//     const waveCanvasRef = useRef(null);

//     const [isPlaying, setIsPlaying]     = useState(false);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [duration, setDuration]       = useState(0);
//     const [loading, setLoading]         = useState(true);

//     useEffect(() => {
//         setLoading(true);
//         const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100 * 30, 44100);

//         fetch(podcast.src)
//             .then(r => r.arrayBuffer())
//             .then(buf => offlineCtx.decodeAudioData(buf))
//             .then(audioBuf => {
//                 const raw    = audioBuf.getChannelData(0);
//                 const bins   = 200;
//                 const step   = Math.floor(raw.length / bins);
//                 const peaks  = [];
//                 for (let i = 0; i < bins; i++) {
//                     let max = 0;
//                     for (let j = 0; j < step; j++) {
//                         const v = Math.abs(raw[i * step + j]);
//                         if (v > max) max = v;
//                     }
//                     peaks.push(max);
//                 }
//                 waveformRef.current = peaks;
//                 setLoading(false);
//             })
//             .catch(() => setLoading(false));
//     }, [podcast.src]);

//     useEffect(() => {
//         if (loading || !waveformRef.current || !waveCanvasRef.current) return;
//         drawWaveform(currentTime, duration);
//     }, [loading, currentTime, duration]);

//     const drawWaveform = useCallback((ct, dur) => {
//         const canvas = waveCanvasRef.current;
//         if (!canvas || !waveformRef.current) return;
//         const ctx    = canvas.getContext('2d');
//         const W      = canvas.width;
//         const H      = canvas.height;
//         const peaks  = waveformRef.current;
//         const bins   = peaks.length;
//         const barW   = (W / bins) * 0.6;
//         const gap    = (W / bins) * 0.4;
//         const progress = dur ? ct / dur : 0;

//         ctx.clearRect(0, 0, W, H);

//         peaks.forEach((p, i) => {
//             const x       = i * (barW + gap);
//             const barH    = Math.max(2, p * H * 0.85);
//             const y       = (H - barH) / 2;
//             const played  = i / bins < progress;
//             ctx.fillStyle = played ? podcast.color : 'rgba(255,255,255,0.18)';
//             ctx.fillRect(x, y, barW, barH);
//         });
//     }, [podcast.color]);

//     useEffect(() => {
//         if (!loading) drawWaveform(currentTime, duration);
//     }, [currentTime, duration, loading, drawWaveform]);

//     const startVisualizer = useCallback(() => {
//         const canvas = canvasRef.current;
//         if (!canvas || !analyserRef.current) return;
//         const ctx     = canvas.getContext('2d');
//         const analyse = analyserRef.current;
//         const bufLen  = analyse.frequencyBinCount;
//         const dataArr = new Uint8Array(bufLen);

//         const draw = () => {
//             rafRef.current = requestAnimationFrame(draw);
//             analyse.getByteFrequencyData(dataArr);
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             const bars = 80;
//             const barW = canvas.width / bars;
//             for (let i = 0; i < bars; i++) {
//                 const idx  = Math.floor(i * bufLen / bars);
//                 const val  = dataArr[idx] / 255;
//                 const barH = val * canvas.height;
//                 const alpha = 0.4 + val * 0.6;
//                 ctx.fillStyle = podcast.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
//                 ctx.fillRect(i * barW + 1, canvas.height - barH, barW - 2, barH);
//             }
//         };
//         draw();
//     }, [podcast.color]);

//     const stopVisualizer = useCallback(() => {
//         if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     }, []);

//     const initAudioCtx = useCallback(() => {
//         if (audioCtxRef.current) return;
//         const ctx     = new (window.AudioContext || window.webkitAudioContext)();
//         const analyser = ctx.createAnalyser();
//         analyser.fftSize = 256;
//         const source  = ctx.createMediaElementSource(audioRef.current);
//         source.connect(analyser);
//         analyser.connect(ctx.destination);
//         audioCtxRef.current = ctx;
//         analyserRef.current = analyser;
//         sourceRef.current   = source;
//     }, []);

//     useEffect(() => {
//         const audio = audioRef.current;
//         if (!audio) return;
//         const onTime = () => setCurrentTime(audio.currentTime);
//         const onMeta = () => setDuration(audio.duration);
//         const onEnd  = () => { setIsPlaying(false); setCurrentTime(0); stopVisualizer(); };
//         audio.addEventListener('timeupdate', onTime);
//         audio.addEventListener('loadedmetadata', onMeta);
//         audio.addEventListener('ended', onEnd);
//         return () => {
//             audio.removeEventListener('timeupdate', onTime);
//             audio.removeEventListener('loadedmetadata', onMeta);
//             audio.removeEventListener('ended', onEnd);
//         };
//     }, [stopVisualizer]);

//     useEffect(() => {
//         return () => {
//             stopVisualizer();
//             audioRef.current?.pause();
//         };
//     }, [stopVisualizer]);

//     const togglePlay = () => {
//         const audio = audioRef.current;
//         if (!audio) return;
//         initAudioCtx();
//         if (isPlaying) {
//             audio.pause();
//             setIsPlaying(false);
//             stopVisualizer();
//         } else {
//             audio.play();
//             setIsPlaying(true);
//             startVisualizer();
//         }
//     };

//     const seekFromWaveform = (e) => {
//         const audio = audioRef.current;
//         if (!audio || !duration) return;
//         const rect  = e.currentTarget.getBoundingClientRect();
//         const ratio = (e.clientX - rect.left) / rect.width;
//         audio.currentTime = ratio * duration;
//     };

//     const fmt = (s) => {
//         if (!s || isNaN(s)) return '0:00';
//         const m   = Math.floor(s / 60);
//         const sec = Math.floor(s % 60);
//         return `${m}:${sec.toString().padStart(2, '0')}`;
//     };

//     return (
//         <div
//             className="pod-modal-backdrop"
//             onClick={(e) => e.target === e.currentTarget && onClose()}
//         >
//             <div ref={ref} className="pod-modal">

//                 <button className="pod-modal-close" onClick={onClose} aria-label="Fermer">
//                     <CloseIcon />
//                 </button>

//                 <div className="pod-modal-header">
//                     <div className="pod-modal-dot" style={{ background: podcast.color }} />
//                     <div>
//                         <h2 className="pod-modal-title">{podcast.title}</h2>
//                         <p className="pod-modal-guest">{podcast.guest}</p>
//                     </div>
//                 </div>

//                 <div className="pod-modal-live-viz">
//                     {isPlaying
//                         ? <canvas ref={canvasRef} className="pod-live-canvas" width={900} height={80} />
//                         : <div className="pod-live-idle">
//                             <span style={{ background: podcast.color }} />
//                             <span style={{ background: podcast.color, opacity: 0.5 }} />
//                             <span style={{ background: podcast.color, opacity: 0.25 }} />
//                           </div>
//                     }
//                 </div>

//                 <div className="pod-modal-viz" onClick={seekFromWaveform}>
//                     {loading
//                         ? <div className="pod-modal-loading">
//                             <span className="pod-loading-bar" style={{ '--c': podcast.color }} />
//                             <p>Analyse de l'audio…</p>
//                           </div>
//                         : <canvas
//                             ref={waveCanvasRef}
//                             className="pod-wave-canvas"
//                             width={900}
//                             height={80}
//                           />
//                     }
//                 </div>

//                 <div className="pod-modal-times">
//                     <span>{fmt(currentTime)}</span>
//                     <span>{fmt(duration)}</span>
//                 </div>

//                 <div className="pod-modal-controls">
//                     <button
//                         className="pod-ctrl-skip"
//                         onClick={() => { audioRef.current.currentTime -= 15; }}
//                         aria-label="Reculer 15s"
//                     >
//                         <SkipBackIcon /> <span>15s</span>
//                     </button>

//                     <button
//                         className="pod-ctrl-play"
//                         onClick={togglePlay}
//                         style={{ '--accent': podcast.color }}
//                         aria-label={isPlaying ? 'Pause' : 'Play'}
//                     >
//                         {isPlaying ? <PauseIcon /> : <PlayIcon />}
//                     </button>

//                     <button
//                         className="pod-ctrl-skip"
//                         onClick={() => { audioRef.current.currentTime += 15; }}
//                         aria-label="Avancer 15s"
//                     >
//                         <span>15s</span> <SkipFwdIcon />
//                     </button>
//                 </div>

//                 <audio ref={audioRef} src={podcast.src} preload="metadata" />
//             </div>
//         </div>
//     );
// });

// /* ── Icônes ─────────────────────────────────────────────────── */

// function PlayIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
//             <polygon points="5,3 19,12 5,21" />
//         </svg>
//     );
// }

// function PauseIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
//             <rect x="5" y="3" width="4" height="18" rx="1" />
//             <rect x="15" y="3" width="4" height="18" rx="1" />
//         </svg>
//     );
// }

// function CloseIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
//             <line x1="18" y1="6" x2="6" y2="18" />
//             <line x1="6" y1="6" x2="18" y2="18" />
//         </svg>
//     );
// }

// function SkipBackIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
//             <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
//         </svg>
//     );
// }

// function SkipFwdIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
//             <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
//         </svg>
//     );
// }
//             <div className="pod-card-color-bar" style={{ background: podcast.color }} />

//             <div className="pod-card-body">
//                 <div className="pod-card-meta">
//                     <span className="pod-card-duration">{podcast.duration}</span>
//                 </div>

//                 <h3 className="pod-card-title">{podcast.title}</h3>
//                 <p className="pod-card-guest">{podcast.guest}</p>
//                 <p className="pod-card-desc">{podcast.desc}</p>
//             </div>

//             <button
//                 className="pod-card-play"
//                 onClick={onPlay}
//                 style={{ '--accent': podcast.color }}
//                 aria-label={`Écouter ${podcast.title}`}
//             >
//                 <PlayIcon />
//                 <span>Écouter</span>
//             </button>
//         </div>
//     );
// }

// /* ── Modal player ───────────────────────────────────────────── */

// import { forwardRef } from 'react';

// const PodcastModal = forwardRef(function PodcastModal({ podcast, onClose }, ref) {
//     const audioRef        = useRef(null);
//     const visualizerRef   = useRef(null);
//     const [blob, setBlob]             = useState(null);
//     const [isPlaying, setIsPlaying]   = useState(false);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [duration, setDuration]     = useState(0);
//     const [loading, setLoading]       = useState(true);

//     // Fetch du fichier audio en blob
//     useEffect(() => {
//         setLoading(true);
//         fetch(podcast.src)
//             .then(r => r.blob())
//             .then(b => { setBlob(b); setLoading(false); })
//             .catch(() => setLoading(false));
//     }, [podcast.src]);

//     // Sync currentTime
//     useEffect(() => {
//         const audio = audioRef.current;
//         if (!audio) return;

//         const onTime = () => setCurrentTime(audio.currentTime);
//         const onMeta = () => setDuration(audio.duration);
//         const onEnd  = () => { setIsPlaying(false); setCurrentTime(0); };

//         audio.addEventListener('timeupdate', onTime);
//         audio.addEventListener('loadedmetadata', onMeta);
//         audio.addEventListener('ended', onEnd);
//         return () => {
//             audio.removeEventListener('timeupdate', onTime);
//             audio.removeEventListener('loadedmetadata', onMeta);
//             audio.removeEventListener('ended', onEnd);
//         };
//     }, []);

//     const togglePlay = () => {
//         const audio = audioRef.current;
//         if (!audio) return;
//         if (isPlaying) { audio.pause(); setIsPlaying(false); }
//         else           { audio.play();  setIsPlaying(true); }
//     };

//     const seek = (e) => {
//         const audio = audioRef.current;
//         if (!audio || !duration) return;
//         const rect = e.currentTarget.getBoundingClientRect();
//         const ratio = (e.clientX - rect.left) / rect.width;
//         audio.currentTime = ratio * duration;
//     };

//     const fmt = (s) => {
//         if (!s || isNaN(s)) return '0:00';
//         const m = Math.floor(s / 60);
//         const sec = Math.floor(s % 60);
//         return `${m}:${sec.toString().padStart(2, '0')}`;
//     };

//     return (
//         <div className="pod-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
//             <div ref={ref} className="pod-modal">

//                 {/* Fermer */}
//                 <button className="pod-modal-close" onClick={onClose} aria-label="Fermer">
//                     <CloseIcon />
//                 </button>

//                 {/* Infos podcast */}
//                 <div className="pod-modal-header">
//                     <div className="pod-modal-dot" style={{ background: podcast.color }} />
//                     <div>
//                         <h2 className="pod-modal-title">{podcast.title}</h2>
//                         <p className="pod-modal-guest">{podcast.guest}</p>
//                     </div>
//                 </div>

//                 {/* Visualizer */}
//                 <div className="pod-modal-viz">
//                     {loading && (
//                         <div className="pod-modal-loading">
//                             <span className="pod-loading-bar" style={{ '--c': podcast.color }} />
//                             <p>Chargement de l'audio…</p>
//                         </div>
//                     )}
//                     {!loading && blob && (
//                         <AudioVisualizer
//                             ref={visualizerRef}
//                             blob={blob}
//                             width={900}
//                             height={120}
//                             barWidth={2}
//                             gap={1}
//                             backgroundColor="transparent"
//                             barColor="rgba(255,255,255,0.15)"
//                             barPlayedColor={podcast.color}
//                             currentTime={currentTime}
//                             style={{ width: '100%', height: '120px', cursor: 'pointer' }}
//                             onClick={seek}
//                         />
//                     )}
//                 </div>

//                 {/* Barre de progression cliquable */}
//                 <div className="pod-modal-progress" onClick={seek} role="slider" aria-label="Progression">
//                     <div
//                         className="pod-modal-progress-fill"
//                         style={{
//                             width: duration ? `${(currentTime / duration) * 100}%` : '0%',
//                             background: podcast.color,
//                         }}
//                     />
//                 </div>

//                 {/* Temps */}
//                 <div className="pod-modal-times">
//                     <span>{fmt(currentTime)}</span>
//                     <span>{fmt(duration)}</span>
//                 </div>

//                 {/* Contrôles */}
//                 <div className="pod-modal-controls">
//                     <button className="pod-ctrl-skip" onClick={() => { audioRef.current.currentTime -= 15; }} aria-label="Reculer 15s">
//                         <SkipBackIcon /> <span>15s</span>
//                     </button>

//                     <button
//                         className="pod-ctrl-play"
//                         onClick={togglePlay}
//                         style={{ '--accent': podcast.color }}
//                         aria-label={isPlaying ? 'Pause' : 'Play'}
//                     >
//                         {isPlaying ? <PauseIcon /> : <PlayIcon />}
//                     </button>

//                     <button className="pod-ctrl-skip" onClick={() => { audioRef.current.currentTime += 15; }} aria-label="Avancer 15s">
//                         <span>15s</span> <SkipFwdIcon />
//                     </button>
//                 </div>

//                 {/* Audio natif caché */}
//                 <audio ref={audioRef} src={podcast.src} preload="metadata" />
//             </div>
//         </div>
//     );
// });

// /* ── Icônes SVG ─────────────────────────────────────────────── */

// function PlayIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
//             <polygon points="5,3 19,12 5,21" />
//         </svg>
//     );
// }

// function PauseIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
//             <rect x="5" y="3" width="4" height="18" rx="1" />
//             <rect x="15" y="3" width="4" height="18" rx="1" />
//         </svg>
//     );
// }

// function CloseIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
//             <line x1="18" y1="6" x2="6" y2="18" />
//             <line x1="6" y1="6" x2="18" y2="18" />
//         </svg>
//     );
// }

// function SkipBackIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
//             <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
//         </svg>
//     );
// }

// function SkipFwdIcon() {
//     return (
//         <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
//             <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
//         </svg>
//     );
// }


import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import gsap from 'gsap';
import '../styles/podcast.css';

const podcasts = [
    {
        id:       'tech-in-comic',
        title:    'Tech In Comic',
        guest:    'Tom Delavigne × Jimmy TE',
        desc:     'Intelligence artificielle, interfaces neuronales, mégalopoles du futur — comment Otomo et Shirow ont anticipé notre réalité technologique.',
        duration: '42 min',
        src:      '/podcast/Tech_In_Comic-Delavigne_Tom-TE_Jimmy.mp3',
        color:    '#00d4ff',
    },
    {
        id:       'au-dela-chair',
        title:    'Au-Delà de la Chair',
        guest:    'Épisode 2 — Cyborg & Identité',
        desc:     "Quand le corps devient machine, que reste-t-il de l'humanité ? Retour sur les thèmes philosophiques qui traversent Ghost in the Shell.",
        duration: '38 min',
        src:      '/podcast/podcast_akira_GITS_melina_lana_deborah_alexis.mp3',
        color:    '#ff6ec7',
    },
];

export default function Podcast() {
    const [activePodcast, setActivePodcast] = useState(null);
    const modalRef = useRef(null);

    const openModal = useCallback((podcast) => {
        setActivePodcast(podcast);
    }, []);

    const closeModal = useCallback(() => {
        if (!modalRef.current) return;
        gsap.to(modalRef.current, {
            opacity: 0, scale: 0.97,
            duration: 0.35, ease: 'power3.in',
            onComplete: () => setActivePodcast(null),
        });
    }, []);

    useEffect(() => {
        if (!activePodcast || !modalRef.current) return;
        gsap.fromTo(modalRef.current,
            { opacity: 0, scale: 0.97 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
        );
    }, [activePodcast]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') closeModal(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [closeModal]);

    return (
        <section className="pod-section">

            <header className="pod-header">
                <span className="pod-eyebrow">Écouter · Découvrir</span>
                <h2 className="pod-title">Les Podcasts<br />de l'Exposition</h2>
                <p className="pod-intro">
                    Deux épisodes exclusifs pour prolonger l'expérience.
                    Des voix, des idées, et des questions qui restent.
                </p>
            </header>

            <div className="pod-cards">
                {podcasts.map((p) => (
                    <PodcastCard key={p.id} podcast={p} onPlay={() => openModal(p)} />
                ))}
            </div>

            {activePodcast && (
                <PodcastModal
                    ref={modalRef}
                    podcast={activePodcast}
                    onClose={closeModal}
                />
            )}

        </section>
    );
}

/* ── Carte podcast ──────────────────────────────────────────── */

function PodcastCard({ podcast, onPlay }) {
    return (
        <div className="pod-card">
            <div className="pod-card-color-bar" style={{ background: podcast.color }} />
            <div className="pod-card-body">
                <div className="pod-card-meta">
                    <span className="pod-card-duration">{podcast.duration}</span>
                </div>
                <h3 className="pod-card-title">{podcast.title}</h3>
                <p className="pod-card-guest">{podcast.guest}</p>
                <p className="pod-card-desc">{podcast.desc}</p>
            </div>
            <button
                className="pod-card-play"
                onClick={onPlay}
                style={{ '--accent': podcast.color }}
                aria-label={`Écouter ${podcast.title}`}
            >
                <PlayIcon />
                <span>Écouter</span>
            </button>
        </div>
    );
}

/* ── Modal player ───────────────────────────────────────────── */

const PodcastModal = forwardRef(function PodcastModal({ podcast, onClose }, ref) {
    const audioRef      = useRef(null);
    const canvasRef     = useRef(null);
    const rafRef        = useRef(null);
    const analyserRef   = useRef(null);
    const audioCtxRef   = useRef(null);
    const sourceRef     = useRef(null);
    const waveformRef   = useRef(null); // données waveform statique
    const waveCanvasRef = useRef(null);

    const [isPlaying, setIsPlaying]     = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration]       = useState(0);
    const [loading, setLoading]         = useState(true);

    // ── Charger la waveform statique via AudioBuffer ────────────
    useEffect(() => {
        setLoading(true);
        const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100 * 30, 44100);

        fetch(podcast.src)
            .then(r => r.arrayBuffer())
            .then(buf => offlineCtx.decodeAudioData(buf))
            .then(audioBuf => {
                const raw    = audioBuf.getChannelData(0);
                const bins   = 200;
                const step   = Math.floor(raw.length / bins);
                const peaks  = [];
                for (let i = 0; i < bins; i++) {
                    let max = 0;
                    for (let j = 0; j < step; j++) {
                        const v = Math.abs(raw[i * step + j]);
                        if (v > max) max = v;
                    }
                    peaks.push(max);
                }
                waveformRef.current = peaks;
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [podcast.src]);

    // ── Dessiner la waveform statique ───────────────────────────
    useEffect(() => {
        if (loading || !waveformRef.current || !waveCanvasRef.current) return;
        drawWaveform(currentTime, duration);
    }, [loading, currentTime, duration]);

    const drawWaveform = useCallback((ct, dur) => {
        const canvas = waveCanvasRef.current;
        if (!canvas || !waveformRef.current) return;
        const ctx    = canvas.getContext('2d');
        const W      = canvas.width;
        const H      = canvas.height;
        const peaks  = waveformRef.current;
        const bins   = peaks.length;
        const barW   = (W / bins) * 0.6;
        const gap    = (W / bins) * 0.4;
        const progress = dur ? ct / dur : 0;

        ctx.clearRect(0, 0, W, H);

        peaks.forEach((p, i) => {
            const x       = i * (barW + gap);
            const barH    = Math.max(2, p * H * 0.85);
            const y       = (H - barH) / 2;
            const played  = i / bins < progress;
            ctx.fillStyle = played ? podcast.color : 'rgba(255,255,255,0.18)';
            ctx.fillRect(x, y, barW, barH);
        });
    }, [podcast.color]);

    // ── Redessiner quand le temps change ────────────────────────
    useEffect(() => {
        if (!loading) drawWaveform(currentTime, duration);
    }, [currentTime, duration, loading, drawWaveform]);

    // ── Visualizer live (barres animées) ────────────────────────
    const startVisualizer = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;
        const ctx     = canvas.getContext('2d');
        const analyse = analyserRef.current;
        const bufLen  = analyse.frequencyBinCount;
        const dataArr = new Uint8Array(bufLen);

        const draw = () => {
            rafRef.current = requestAnimationFrame(draw);
            analyse.getByteFrequencyData(dataArr);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const bars = 80;
            const barW = canvas.width / bars;
            for (let i = 0; i < bars; i++) {
                const idx  = Math.floor(i * bufLen / bars);
                const val  = dataArr[idx] / 255;
                const barH = val * canvas.height;
                const alpha = 0.4 + val * 0.6;
                ctx.fillStyle = podcast.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
                ctx.fillRect(i * barW + 1, canvas.height - barH, barW - 2, barH);
            }
        };
        draw();
    }, [podcast.color]);

    const stopVisualizer = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    // ── Init Web Audio ──────────────────────────────────────────
    const initAudioCtx = useCallback(() => {
        if (audioCtxRef.current) return;
        const ctx     = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        const source  = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current   = source;
    }, []);

    // ── Sync currentTime ────────────────────────────────────────
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onTime = () => setCurrentTime(audio.currentTime);
        const onMeta = () => setDuration(audio.duration);
        const onEnd  = () => { setIsPlaying(false); setCurrentTime(0); stopVisualizer(); };
        audio.addEventListener('timeupdate', onTime);
        audio.addEventListener('loadedmetadata', onMeta);
        audio.addEventListener('ended', onEnd);
        return () => {
            audio.removeEventListener('timeupdate', onTime);
            audio.removeEventListener('loadedmetadata', onMeta);
            audio.removeEventListener('ended', onEnd);
        };
    }, [stopVisualizer]);

    // ── Cleanup au démontage ─────────────────────────────────────
    useEffect(() => {
        return () => {
            stopVisualizer();
            audioRef.current?.pause();
        };
    }, [stopVisualizer]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        initAudioCtx();
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            stopVisualizer();
        } else {
            audio.play();
            setIsPlaying(true);
            startVisualizer();
        }
    };

    const seekFromWaveform = (e) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const rect  = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * duration;
    };

    const fmt = (s) => {
        if (!s || isNaN(s)) return '0:00';
        const m   = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="pod-modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div ref={ref} className="pod-modal">

                <button className="pod-modal-close" onClick={onClose} aria-label="Fermer">
                    <CloseIcon />
                </button>

                {/* Header */}
                <div className="pod-modal-header">
                    <div className="pod-modal-dot" style={{ background: podcast.color }} />
                    <div>
                        <h2 className="pod-modal-title">{podcast.title}</h2>
                        <p className="pod-modal-guest">{podcast.guest}</p>
                    </div>
                </div>

                {/* Visualizer live — barres fréquences */}
                <div className="pod-modal-live-viz">
                    {isPlaying
                        ? <canvas ref={canvasRef} className="pod-live-canvas" width={900} height={80} />
                        : <div className="pod-live-idle">
                            <span style={{ background: podcast.color }} />
                            <span style={{ background: podcast.color, opacity: 0.5 }} />
                            <span style={{ background: podcast.color, opacity: 0.25 }} />
                          </div>
                    }
                </div>

                {/* Waveform statique + seeking */}
                <div className="pod-modal-viz" onClick={seekFromWaveform}>
                    {loading
                        ? <div className="pod-modal-loading">
                            <span className="pod-loading-bar" style={{ '--c': podcast.color }} />
                            <p>Analyse de l'audio…</p>
                          </div>
                        : <canvas
                            ref={waveCanvasRef}
                            className="pod-wave-canvas"
                            width={900}
                            height={80}
                          />
                    }
                </div>

                {/* Temps */}
                <div className="pod-modal-times">
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration)}</span>
                </div>

                {/* Contrôles */}
                <div className="pod-modal-controls">
                    <button
                        className="pod-ctrl-skip"
                        onClick={() => { audioRef.current.currentTime -= 15; }}
                        aria-label="Reculer 15s"
                    >
                        <SkipBackIcon /> <span>15s</span>
                    </button>

                    <button
                        className="pod-ctrl-play"
                        onClick={togglePlay}
                        style={{ '--accent': podcast.color }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>

                    <button
                        className="pod-ctrl-skip"
                        onClick={() => { audioRef.current.currentTime += 15; }}
                        aria-label="Avancer 15s"
                    >
                        <span>15s</span> <SkipFwdIcon />
                    </button>
                </div>

                <audio ref={audioRef} src={podcast.src} preload="metadata" />
            </div>
        </div>
    );
});

/* ── Icônes ─────────────────────────────────────────────────── */

function PlayIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    );
}
function PauseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <rect x="5" y="3" width="4" height="18" rx="1" />
            <rect x="15" y="3" width="4" height="18" rx="1" />
        </svg>
    );
}
function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function SkipBackIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
    );
}
function SkipFwdIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
        </svg>
    );
}
