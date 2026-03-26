import { useState, useRef, useEffect } from 'react';
import '../styles/podcast.css';

const PODCASTS = [
    {
        id: 'tech-in-comic',
        title: 'Tech In Comic',
        guest: 'Tom Delavigne x Jimmy TE',
        duration: '7 min',
        src: '/podcast/Tech_In_Comic-Delavigne_Tom-TE_Jimmy.mp3',
    },
    {
        id: 'au-dela-chair',
        title: 'Au-Delà de la Chair',
        guest: 'Mélina x Lana x Déborah x Alexis',
        duration: '15 min',
        src: '/podcast/podcast_akira_GITS_melina_lana_deborah_alexis.mp3',
    },
];

let currentPlayingId = null;
let currentAudio = null;

export default function Podcast() {
    return (
        <section className="pod-section">
            <header className="pod-header">
                <span className="pod-eyebrow">Écouter x Découvrir</span>
                <h2 className="pod-title">Les Podcasts</h2>
            </header>

            <div className="pod-cards">
                {PODCASTS.map((p) => (
                    <PodcastPlayer key={p.id} podcast={p} />
                ))}
            </div>
        </section>
    );
}

function PodcastPlayer({ podcast }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const animationFrameRef = useRef(null);
    const canvasRef = useRef(null);
    const shouldAnimateRef = useRef(false);

    useEffect(() => {
        if (!audioRef.current) return;

        // Les événements audio
        const audio = audioRef.current;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        
        const onLoadedMetadata = () => {
            console.log('Audio chargé, durée:', audio.duration);
            setDuration(audio.duration);
        };

        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    // Solution alternative: Analyser le temps + volume de l'audio element
    const setupAudioContext = () => {
        try {
            const audio = audioRef.current;
            if (!audio) {
                console.error('❌ Audio element not found');
                return false;
            }

            console.log('✅ Setup visualizer: audio element OK');
            return true;
        } catch (error) {
            console.error('❌ Erreur setup:', error);
            return false;
        }
    };

    const drawIdle = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Pas de fond - transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Juste quelques barres blanches statiques pour indiquer le visualiseur
        const barCount = 12;
        const barWidth = Math.max(1, Math.floor(canvas.width / (barCount * 2.5)));
        const gap = Math.max(1, Math.floor(canvas.width / barCount - barWidth));
        
        for (let i = 0; i < barCount; i++) {
            const x = i * (barWidth + gap);
            const height = 6 + (i % 3) * 2; // Variation légère pour plus de dynamique
            const y = canvas.height / 2 - height / 2;
            
            ctx.fillStyle = '#ffffff'; // Blanc simple
            ctx.globalAlpha = 0.6; // Légère transparence pour indiquer c'est pas actif
            ctx.fillRect(x, y, barWidth, height);
        }
        ctx.globalAlpha = 1.0; // Reset
    };

    const draw = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const audio = audioRef.current;

        // Si on ne doit pas animer, arrêter
        if (!shouldAnimateRef.current) {
            return;
        }

        if (!audio) {
            // Continue quand même en attendant l'audio
            animationFrameRef.current = requestAnimationFrame(draw);
            return;
        }

        // Lire les données RÉELLES de l'audio
        const currentTime = audio.currentTime || 0;
        const duration = audio.duration || 1;
        const progress = currentTime / duration;
        const volume = audio.volume || 1;
        
        const now = Date.now() / 1000;
        
        const timeFrequency = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
        const pulseFrequency = Math.sin(now * 2) * 0.3 + 0.7;
        const volumeInfluence = Math.pow(volume, 1.5);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barCount = 64;
        const barWidth = Math.max(1, Math.floor(canvas.width / (barCount * 1.8)));
        const gap = Math.max(0.5, Math.floor(canvas.width / barCount - barWidth));

        for (let i = 0; i < barCount; i++) {
            const barPosition = i / barCount;
            const frequencyBand = Math.sin(barPosition * Math.PI * 8 + progress * Math.PI * 2) * 0.3 + 0.4;
            const harmonic1 = Math.sin((i / 4) + now * 3) * 0.2;
            const harmonic2 = Math.sin((i / 8) + now * 2.5) * 0.15;
            
            let normalizedValue = (
                frequencyBand * 0.5 +
                harmonic1 * 0.2 +
                harmonic2 * 0.1 +
                pulseFrequency * 0.2
            );
            
            normalizedValue *= (0.5 + timeFrequency * 0.5);
            normalizedValue = Math.pow(normalizedValue, 1 - volumeInfluence * 0.3);
            normalizedValue = Math.max(0.2, Math.min(1, normalizedValue));
            
            const barHeight = Math.max(3, normalizedValue * canvas.height * 0.95);

            const x = i * (barWidth + gap);
            const yOffset = canvas.height - barHeight;

            const lightness = 40 + normalizedValue * 50;
            ctx.fillStyle = `hsl(0, 0%, ${lightness}%)`;
            ctx.fillRect(x, yOffset, barWidth, barHeight);
        }

        // Continue l'animation
        animationFrameRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        if (isPlaying) {
            shouldAnimateRef.current = true;
            // Élargir le canvas de 30-40% en largeur au play
            if (canvasRef.current) {
                const idleWidth = 150;
                const playingWidth = Math.round(idleWidth * 1.35);
                canvasRef.current.width = playingWidth;
                canvasRef.current.height = 60;
                console.log(`📊 Canvas en play: ${playingWidth}x60`);
                // Lancer l'animation
                draw();
            }
        } else {
            shouldAnimateRef.current = false;
            // Annuler l'animation en cours
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            
            // Revenir à la taille idle
            if (canvasRef.current) {
                canvasRef.current.width = 150;
                canvasRef.current.height = 60;
                drawIdle();
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying]);

    useEffect(() => {
        // Initialiser le canvas en mode idle
        if (canvasRef.current) {
            canvasRef.current.width = 150;
            canvasRef.current.height = 60;
            drawIdle();
        }
    }, []);

    const togglePlay = () => {
        console.log('togglePlay appelé, isPlaying actuellement:', isPlaying);
        if (currentPlayingId !== null && currentPlayingId !== podcast.id) {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        }

        const audio = audioRef.current;
        if (isPlaying) {
            console.log('Pause de l\'audio');
            audio.pause();
            setIsPlaying(false);
            currentPlayingId = null;
            currentAudio = null;
        } else {
            console.log('Démarrage de la lecture');
            // Initialiser le visualizer
            const success = setupAudioContext();
            console.log('setupAudioContext result:', success);
            if (!success) {
                console.error('Impossible d\'initialiser le visualizer');
                return;
            }
            
            console.log('Appel de audio.play()');
            audio.play().catch(e => console.error('Erreur play:', e));
            setIsPlaying(true);
            currentPlayingId = podcast.id;
            currentAudio = audio;
        }
    };

    const handleProgressClick = (e) => {
        if (!audioRef.current || duration === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audioRef.current.currentTime = percentage * duration;
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const skip = (seconds) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
        }
    };

    return (
        <div className={`pod-player ${isPlaying ? 'pod-player--active pod-player--expanded' : ''}`}>
            {/* Élément audio caché pour la Web Audio API */}
            <audio ref={audioRef} src={podcast.src} crossOrigin="anonymous" style={{ display: 'none' }} />
            
            <div className="pod-visualizer-container">
                <canvas
                    ref={canvasRef}
                    className={`pod-visualizer ${isPlaying ? 'pod-visualizer--playing' : ''}`}
                />
            </div>

            <div className="pod-info">
                <h3 className="pod-name">{podcast.title}</h3>
                <p className="pod-time">{podcast.guest} - {podcast.duration}</p>
                
                <div className="pod-progress" onClick={handleProgressClick}>
                    <div 
                        className="pod-progress-fill" 
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                </div>
                <div className="pod-time-display">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="pod-controls">
                <button
                    className="pod-btn pod-btn--back"
                    onClick={() => skip(-10)}
                    title="Reculer 10s"
                >
                    <img src="/icons/Next.svg" className="reverse" alt="Reculer" />
                </button>

                <button
                    className={`pod-btn pod-btn--play ${isPlaying ? 'pod-btn--pause' : ''}`}
                    onClick={togglePlay}
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <button
                    className="pod-btn pod-btn--next"
                    onClick={() => skip(10)}
                    title="Avancer 10s"
                >
                    <img src="/icons/Next.svg" alt="Avancer" />
                </button>
            </div>
        </div>
    );
}
