import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import Grainient from './Grainient';
import ArrowUpRight from '@boxicons/react/ArrowUpRight';
import '../styles/gateway-screen.css';

export default function GatewayScreen({ onEnter }) {
    const { t, i18n } = useTranslation();
    const gatewayRef  = useRef(null);
    const questionRef = useRef(null);
    const sublineRef  = useRef(null);
    const buttonRef   = useRef(null);
    const scanlineRef = useRef(null);
    const dropdownRef = useRef(null);
    const [clicked, setClicked]     = useState(false);
    const [glitching, setGlitching] = useState(false);
    const [lang, setLang] = useState((localStorage.getItem('lang') || 'fr').toUpperCase());
    const [openLang, setOpenLang] = useState(false);
    const labelLang = t('gateway.languages');

    // Fermer si clic extérieur
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenLang(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Synchroniser l'état lang avec i18n.language directement
    useEffect(() => {
        setLang((i18n.language || 'fr').toUpperCase());
    }, [i18n.language]);

    // Changer langue
    const changeLang = (newLang) => {
        const langCode = newLang === 'FR' ? 'fr' : 'en';
        i18n.changeLanguage(langCode);
        setLang(newLang);
        localStorage.setItem('lang', langCode);
        setOpenLang(false);
    };

    useEffect(() => {
        // Bloquer les scrolls horizontal et vertical
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflowY = 'hidden';
        document.body.style.height = '100vh';
        window.scrollTo(0, 0);

        const tl = gsap.timeline({ delay: 0.4 });

        gsap.set([questionRef.current, sublineRef.current, buttonRef.current], {
            opacity: 0, y: 30, filter: 'blur(8px)',
        });

        tl.to(questionRef.current, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 1.2, ease: 'power3.out',
        })
        .to(sublineRef.current, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.9, ease: 'power3.out',
        }, '-=0.6')
        .to(buttonRef.current, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.8, ease: 'power3.out',
        }, '-=0.4');

        gsap.to(scanlineRef.current, {
            y: '100vh', duration: 3.5,
            repeat: -1, ease: 'none',
        });

        // Nettoyage : réactiver scroll si composant démonte
        return () => {
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflowY = 'auto';
            document.body.style.height = 'auto';
        };
    }, []);

    const handleHover = () => {
        if (clicked) return;
        setGlitching(true);
        setTimeout(() => setGlitching(false), 600);
    };

    const handleEnter = () => {
        if (clicked) return;
        setClicked(true);

        const tl = gsap.timeline({ 
            onComplete: () => {
                // Réactiver le scroll et remonter en haut
                document.documentElement.style.overflow = 'auto';
                document.body.style.overflowY = 'auto';
                document.body.style.height = 'auto';
                window.scrollTo(0, 0);
                if (onEnter) onEnter();
            }
        });

        tl.to(questionRef.current, {
            x: () => (Math.random() - 0.5) * 40,
            opacity: 0.6,
            duration: 0.06, yoyo: true, repeat: 5, ease: 'none',
        }, 0)
        .to(gatewayRef.current, {
            background: 'rgba(255,255,255,0.12)',
            duration: 0.15,
        }, 0.3)
        .to([questionRef.current, sublineRef.current, buttonRef.current], {
            opacity: 0, y: -60, filter: 'blur(12px)',
            duration: 0.7, ease: 'power3.in', stagger: 0.05,
        }, 0.35)
        .to(gatewayRef.current, {
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'center center',
            duration: 0.8, ease: 'power4.in',
        }, 0.7);
    };

    return (
        <div ref={gatewayRef} className="gateway">

            <div className="gateway__background">
                <Grainient
                    color1="#ba121b"
                    color2="#521414"
                    color3="#075a50"
                    timeSpeed={0.18}
                    colorBalance={0.27}
                    warpStrength={1}
                    warpFrequency={5}
                    warpSpeed={1.5}
                    warpAmplitude={56}
                    blendAngle={0}
                    blendSoftness={0.05}
                    rotationAmount={500}
                    noiseScale={2}
                    grainAmount={0.12}
                    grainScale={2}
                    grainAnimated={false}
                    contrast={1.6}
                    gamma={1}
                    saturation={1.1}
                    centerX={-0.08}
                    centerY={0.03}
                    zoom={0.65}
                />
            </div>

            <div ref={scanlineRef} className="gateway__scanline" />

            <div className="gateway__overlay" />

            <CornerLines />

            <div className="gateway__content">

                <div ref={sublineRef} className="gateway__badge">
                    {t('gateway.badge')}
                </div>

                <h1
                    ref={questionRef}
                    className={`gateway__question${glitching ? ' gateway-glitch' : ''}`}
                >
                    {t('gateway.question')}
                </h1>

                <div ref={buttonRef} className="gateway__btn-wrapper">
                    <GatewayButton onClick={handleEnter} onMouseEnter={handleHover} disabled={clicked} />
                </div>

                <div className="gateway__protocol">
                    <BlinkingCursor /> {t('gateway.protocol')}
                </div>

            </div>

            {/* ── Sélecteur de langue ── */}
            <div className="gateway__language" ref={dropdownRef}>
                <div className="gateway__lang-dropdown">
                    <button onClick={() => setOpenLang(!openLang)} className="gateway__lang-btn cursor-target">
                        {labelLang} ({lang}) ▼
                    </button>

                    {openLang && (
                        <div className="gateway__lang-menu">
                            <div onClick={() => changeLang('FR')} className="cursor-target">{t('gateway.french')}</div>
                            <div onClick={() => changeLang('EN')} className="cursor-target">{t('gateway.english')}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function GatewayButton({ onClick, onMouseEnter, disabled }) {
    const [hovered, setHovered] = useState(false);
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => { setHovered(true); onMouseEnter?.(); }}
            onMouseLeave={() => setHovered(false)}
            disabled={disabled}
            className="gateway__btn cursor-target"
        >
            {hovered && <span className="gateway__btn-scan" />}
            <span className="gateway__btn-dot" />
                {t('gateway.enterButton')} <ArrowUpRight />
            <span className="gateway__btn-arrow">
            </span>
        </button>
    );
}

function BlinkingCursor() {
    return <span className="gateway__cursor" />;
}

function CornerLines() {
    return (
        <>
            <div className="gateway__corner gateway__corner--tl">
                <div className="gateway__corner-line-h" />
                <div className="gateway__corner-line-v" />
            </div>
            <div className="gateway__corner gateway__corner--tr">
                <div className="gateway__corner-line-h" />
                <div className="gateway__corner-line-v" />
            </div>
            <div className="gateway__corner gateway__corner--bl">
                <div className="gateway__corner-line-h" />
                <div className="gateway__corner-line-v" />
            </div>
            <div className="gateway__corner gateway__corner--br">
                <div className="gateway__corner-line-h" />
                <div className="gateway__corner-line-v" />
            </div>
        </>
    );
}
