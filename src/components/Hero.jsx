import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Akira3D from './Akira3D';
import GIS3D from './GIS3D';
import ImmersionOverlay from './ImmersionOverlay';
import Grainient from './Grainient';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ title1, title2, subtitle }) {
    <Grainient
    color1="#ba121b"
    color2="#521414"
    color3="#075a50"
    timeSpeed={0.25}
    colorBalance={0.27}
    warpStrength={1}
    warpFrequency={5}
    warpSpeed={2}
    warpAmplitude={56}
    blendAngle={0}
    blendSoftness={0.05}
    rotationAmount={500}
    noiseScale={2}
    grainAmount={0.1}
    grainScale={2}
    grainAnimated={false}
    contrast={1.5}
    gamma={1}
    saturation={1}
    centerX={-0.08}
    centerY={0.03}
    zoom={0.65}
    />

    const heroRef         = useRef(null);
    const sloganRef       = useRef(null);
    const akiraHeroRef    = useRef(null);
    const gisHeroRef      = useRef(null);
    const buttonsRef      = useRef(null);
    const overlayAkiraRef = useRef(null);
    const overlayGisRef   = useRef(null);
    const loaderRef       = useRef(null);

    const akiraCam    = useRef({ camera: null, initialZ: null });
    const gisCam      = useRef({ camera: null, initialZ: null });
    // ✅ built = true après le premier buildTimeline — évite tout double appel
    const built       = useRef(false);
    // ✅ readyCount en ref — pas de setState pour éviter les re-renders en cascade
    const readyCount  = useRef(0);

    // Seulement 2 états : 0, 1, 2 — clampé à 2 max
    const [loadedCount, setLoadedCount] = useState(0);

    const buildTimeline = useCallback(() => {
        // Guard — ne build qu'une seule fois
        if (built.current) return;
        built.current = true;

        const hero    = heroRef.current;
        const slogan  = sloganRef.current;
        const akiraEl = akiraHeroRef.current;
        const gisEl   = gisHeroRef.current;
        const buttons = buttonsRef.current;
        const ovAkira = overlayAkiraRef.current;
        const ovGis   = overlayGisRef.current;

        if (!hero || !ovAkira || !ovGis) return;

        const akiraInitialZ = akiraCam.current.initialZ;
        const gisInitialZ   = gisCam.current.initialZ;

        const akiraProxy = { z: akiraInitialZ };
        const gisProxy   = { z: gisInitialZ };

        window.scrollTo(0, 0);
        if (akiraCam.current.camera) akiraCam.current.camera.position.z = akiraInitialZ;
        if (gisCam.current.camera)   gisCam.current.camera.position.z   = gisInitialZ;

        // Fade out loader
        gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 2,
            ease: 'power3.out',
            onComplete: () => {
                if (loaderRef.current) loaderRef.current.style.display = 'none';
            },
        });

        gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
        gsap.set([ovAkira, ovGis], { opacity: 0, pointerEvents: 'none' });
        gsap.set(ovAkira.querySelector('.overlay-title'),   { opacity: 0, y: 30 });
        gsap.set(ovAkira.querySelector('.overlay-bar'),     { opacity: 0 });
        gsap.set(ovAkira.querySelector('.overlay-content'), { opacity: 0, y: 20 });
        gsap.set(ovGis.querySelector('.overlay-title'),     { opacity: 0, y: 30 });
        gsap.set(ovGis.querySelector('.overlay-bar'),       { opacity: 0 });
        gsap.set(ovGis.querySelector('.overlay-content'),   { opacity: 0, y: 20 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '+=600%',
                scrub: 1.2,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        // ── PHASE 1 : Zoom Akira ─────────────────────────────────────────────
        tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in' }, 0);
        tl.to(gisEl,             { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0);

        tl.fromTo(akiraProxy,
            { z: akiraInitialZ },
            { z: 0.5, duration: 0.22, ease: 'power2.inOut',
              onUpdate() { const c = akiraCam.current.camera; if (c) c.position.z = akiraProxy.z; } },
        0);

        tl.fromTo(gisProxy,
            { z: gisInitialZ },
            { z: gisInitialZ, duration: 0.22,
              onUpdate() { const c = gisCam.current.camera; if (c) c.position.z = gisInitialZ; } },
        0);

        tl.to(akiraEl, { opacity: 0, duration: 0.05 }, 0.22);

        // ── PHASE 1b : Overlay Akira ─────────────────────────────────────────
        tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.25);
        tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.30);
        tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.35);
        tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.40);

        // ── PHASE 2 : Retour hero ─────────────────────────────────────────────
        tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.07 }, 0.50);

        tl.fromTo(akiraProxy,
            { z: 0.5 },
            { z: akiraInitialZ, duration: 0.08, ease: 'power2.out',
              onUpdate() { const c = akiraCam.current.camera; if (c) c.position.z = akiraProxy.z; } },
        0.50);

        tl.fromTo(gisProxy,
            { z: gisInitialZ },
            { z: gisInitialZ, duration: 0.15,
              onUpdate() { const c = gisCam.current.camera; if (c) c.position.z = gisInitialZ; } },
        0.50);

        tl.to([akiraEl, gisEl],  { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.55);
        tl.to([slogan, buttons], { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.60);

        // ── PHASE 3 : Zoom GIS ───────────────────────────────────────────────
        tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.05, ease: 'power2.in' }, 0.65);
        tl.to(akiraEl,           { opacity: 0, duration: 0.05 }, 0.65);

        tl.fromTo(gisProxy,
            { z: gisInitialZ },
            { z: 0.5, duration: 0.22, ease: 'power2.inOut',
              onUpdate() { const c = gisCam.current.camera; if (c) c.position.z = gisProxy.z; } },
        0.65);

        tl.to(gisEl, { opacity: 0, duration: 0.05 }, 0.87);

        // ── PHASE 3b : Overlay GIS ───────────────────────────────────────────
        tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.87);
        tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.90);
        tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.93);
        tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.96);

        // ── FIN ──────────────────────────────────────────────────────────────
        ScrollTrigger.create({
            trigger: hero,
            start: 'bottom bottom',
            onEnter: () => {
                gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
                if (gisCam.current.camera)   gisCam.current.camera.position.z   = gisInitialZ;
                if (akiraCam.current.camera) akiraCam.current.camera.position.z = akiraInitialZ;
                gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
            },
        });

    }, []);

    // ✅ buildTimeline appelé dans useEffect quand isLoaded devient true
    // — les refs des overlays sont disponibles dans le DOM à ce moment
    useEffect(() => {
        if (loadedCount >= 2) {
            // Petit délai pour laisser React monter les overlays dans le DOM
            const t = setTimeout(() => buildTimeline(), 50);
            return () => clearTimeout(t);
        }
    }, [loadedCount, buildTimeline]);

    const handleAkiraReady = useCallback(({ camera, initialZ }) => {
        if (akiraCam.current.initialZ !== null) return; // déjà enregistré
        akiraCam.current = { camera, initialZ };
        readyCount.current += 1;
        // ✅ clamp à 2 max pour éviter le 200%
        setLoadedCount(Math.min(readyCount.current, 2));
    }, []);

    const handleGisReady = useCallback(({ camera, initialZ }) => {
        if (gisCam.current.initialZ !== null) return; // déjà enregistré
        gisCam.current = { camera, initialZ };
        readyCount.current += 1;
        setLoadedCount(Math.min(readyCount.current, 2));
    }, []);

    useEffect(() => {
        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
            built.current = false;
            readyCount.current = 0;
        };
    }, []);

    const loadPercent = Math.min(loadedCount * 50, 100);
    const isLoaded    = loadedCount >= 2;

    return (
        <>
            {/* ── LOADER ── */}
            <div
                ref={loaderRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                    background: '#0a0a0a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                    pointerEvents: isLoaded ? 'none' : 'all',
                }}
            >
                <p style={{
                    fontFamily: 'var(--ff-family-main)',
                    fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                    fontWeight: 300,
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: '#fff',
                    opacity: 0.6,
                    margin: 0,
                }}>
                    Chargement de l'expérience
                </p>

                <div style={{
                    width: 'clamp(200px, 40vw, 400px)',
                    height: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${loadPercent}%`,
                        background: 'linear-gradient(to right, #00d4ff, #ff00ff)',
                        transition: 'width 0.4s ease',
                    }} />
                </div>

                <p style={{
                    fontFamily: 'var(--ff-family-main)',
                    fontSize: '0.85rem',
                    fontWeight: 300,
                    letterSpacing: '3px',
                    color: '#fff',
                    opacity: 0.4,
                    margin: 0,
                }}>
                    {loadPercent}%
                </p>
            </div>

            {/* ── OVERLAYS — montés après chargement complet ── */}
            <ImmersionOverlay
                ref={overlayAkiraRef}
                side="left"
                color="cyan"
                title="Akira"
                content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
            >
                {isLoaded && <Akira3D mode="immersion" />}
            </ImmersionOverlay>

            <ImmersionOverlay
                ref={overlayGisRef}
                side="right"
                color="magenta"
                title="Ghost in the Shell"
                content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
            >
                {isLoaded && <GIS3D mode="immersion" />}
            </ImmersionOverlay>

            {/* ── HERO ── */}
            <div className="hero-section" ref={heroRef}>
                <div className="characters-infos">
                    <div className="akira" ref={akiraHeroRef}>
                        <Akira3D mode="hero" cameraRef={akiraCam} onReady={handleAkiraReady} />
                    </div>

                    <div className="container-hero">
                        <div className="container-slogan" ref={sloganRef}>
                            <div className="triangle"></div>
                            <h1 className="slogan">{title1}</h1>
                            <h1 className="slogan">{title2}</h1>
                            <div className="under-slogan">
                                <h2>{subtitle}</h2>
                            </div>
                        </div>
                        <div className="scroll-down">
                            <h3>Scroll pour en savoir plus</h3>
                            <div className="arrow">
                                <span className="arrow-down"></span>
                            </div>
                        </div>
                    </div>

                    <div className="gis" ref={gisHeroRef}>
                        <GIS3D mode="hero" cameraRef={gisCam} onReady={handleGisReady} />
                    </div>
                </div>
                
                <div className="buttons-hero" ref={buttonsRef}>
                    <a href="#">teaser</a>
                    <a href="#">tickets</a>
                </div>
            </div>
        </>
    );
}
