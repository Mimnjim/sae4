import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Akira3D from './Akira3D';
import GIS3D from './GIS3D';
import ImmersionOverlay from './ImmersionOverlay';
import MangaArchive from './MangaArchive';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ title1, title2, subtitle }) {
    const heroRef         = useRef(null);
    const sloganRef       = useRef(null);
    const akiraHeroRef    = useRef(null);
    const gisHeroRef      = useRef(null);
    const buttonsRef      = useRef(null);
    const overlayAkiraRef = useRef(null);
    const overlayGisRef   = useRef(null);
    const loaderRef       = useRef(null);
    const scrollDownRef   = useRef(null);

    const akiraCam   = useRef({ camera: null, initialZ: null });
    const gisCam     = useRef({ camera: null, initialZ: null });
    const akiraModel = useRef(null);
    const gisModel   = useRef(null);

    const built      = useRef(false);
    const readyCount = useRef(0);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    }, []);

    const buildTimeline = useCallback(() => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        built.current = true;

        const akiraCamera   = akiraCam.current.camera;
        const gisCamera     = gisCam.current.camera;
        const akiraInitialZ = akiraCam.current.initialZ;
        const gisInitialZ   = gisCam.current.initialZ;

        if (!akiraCamera || !gisCamera) return;

        window.dispatchEvent(new Event('resize'));

        const akiraInitialY = akiraCamera.position.y;
        const gisInitialY   = gisCamera.position.y;
        const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
        const gisProxy   = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

        gsap.set([sloganRef.current, buttonsRef.current, scrollDownRef.current], {
            opacity: 1, y: 0, visibility: 'visible'
        });
        gsap.set(akiraHeroRef.current, { x: 0, opacity: 1, visibility: 'visible', scale: 1 });
        gsap.set(gisHeroRef.current, { x: 0, y: -30, opacity: 1, visibility: 'visible', scale: 1 });
        gsap.set([overlayAkiraRef.current, overlayGisRef.current], { opacity: 0, pointerEvents: 'none' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: '+=3000%',
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true,
            }
        });

        // PHASE 1 : DÉPART
        tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 0, y: -50, duration: 1 }, 0);
        tl.to(gisHeroRef.current, { x: 1200, opacity: 0, duration: 1.5, ease: "power2.inOut" }, 0);

        // PHASE 2 : ZOOM AKIRA
        tl.to(akiraProxy, {
            z: akiraInitialZ * 0.45,
            y: akiraInitialY + 30,
            rotY: Math.PI / 2,
            duration: 2,
            onUpdate: () => {
                akiraCamera.position.z = akiraProxy.z;
                akiraCamera.position.y = akiraProxy.y;
                akiraCamera.lookAt(0, akiraInitialY + 30, -85);
                if (akiraModel.current) akiraModel.current.rotation.y = akiraProxy.rotY;
            }
        }, 0.5);

        // PHASE 3 : HUD AKIRA
        const akiraHUD = overlayAkiraRef.current;
        if (akiraHUD) {
            tl.to(akiraHUD, { opacity: 1, pointerEvents: 'auto', duration: 0.1 }, 1.5);
            tl.fromTo(akiraHUD.querySelector('.hud-pointer'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 1.7);
            tl.to(akiraHUD.querySelector('.hud-line'), { strokeDashoffset: 0, duration: 0.9, ease: "none" }, 1.9);
            tl.to(akiraHUD.querySelector('.text-box-frame'), { visibility: 'visible', opacity: 1, y: 0, duration: 0.4 }, 2.1);
            tl.to(akiraHUD.querySelector('.overlay-title'), { opacity: 1, duration: 0.3 }, 2.4);
            tl.to(akiraHUD.querySelector('.overlay-bar'), { width: '100%', duration: 0.4 }, 2.8);
            tl.to(akiraHUD.querySelector('.overlay-content'), { opacity: 1, duration: 0.4 }, 3.2);
        }

        // PHASE 4 : TRANSITION SYNCHRO
        tl.to(akiraHeroRef.current, { x: -1200, opacity: 0, duration: 2, ease: "power2.inOut" }, 4.0);
        tl.to(gisHeroRef.current, { x: 0, opacity: 1, duration: 2, ease: "power2.out" }, 4.2);
        tl.to(overlayAkiraRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 4.6);

        // PHASE 5 : ZOOM GIS
        tl.to(gisProxy, {
            z: gisInitialZ * 0.28,
            y: gisInitialY + 1.48,
            rotY: (-Math.PI / 2) + 0.5,
            duration: 2,
            onUpdate: () => {
                gisCamera.position.z = gisProxy.z;
                gisCamera.position.y = gisProxy.y;
                gisCamera.lookAt(0, gisInitialY + 1.78, -0.35);
                if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
            }
        }, 6.6);

        // PHASE 6 : HUD GIS
        const gisHUD = overlayGisRef.current;
        if (gisHUD) {
            tl.to(gisHUD, { opacity: 1, pointerEvents: 'auto', duration: 0.1 }, 6.5);
            tl.fromTo(gisHUD.querySelector('.hud-pointer'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 6.6);
            tl.to(gisHUD.querySelector('.hud-line'), { strokeDashoffset: 0, duration: 0.9, ease: "none" }, 6.7);
            tl.to(gisHUD.querySelector('.text-box-frame'), { visibility: 'visible', opacity: 1, y: 0, duration: 0.4 }, 7.5);
            tl.to(gisHUD.querySelector('.overlay-title'), { opacity: 1, duration: 0.3 }, 7.7);
            tl.to(gisHUD.querySelector('.overlay-bar'), { width: '100%', duration: 0.4 }, 7.8);
            tl.to(gisHUD.querySelector('.overlay-content'), { opacity: 1, duration: 0.4 }, 7.9);
        }

        // PHASE 7 : SORTIE FINALE
        tl.to(overlayGisRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 9.5);


        const backgroundTransition = document.querySelector('.hero-background-transition');

        // Animation clip-path : révèle de bas vers haut
        gsap.set(backgroundTransition, { 
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" 
        });

        tl.to(backgroundTransition, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.5,
            ease: "power2.inOut"
        }, 9.7);


        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            if (loaderRef.current) {
                gsap.to(loaderRef.current, {
                    opacity: 0, duration: 0.8, delay: 0.2,
                    onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = 'none'; }
                });
            }
        });
    }, [akiraCam, gisCam, akiraModel, gisModel]);

    useEffect(() => {
        if (loadedCount >= 2) setTimeout(buildTimeline, 300);
    }, [loadedCount, buildTimeline]);

    useEffect(() => {
        const updateTransitionHeight = () => {
            const backgroundTransition = document.querySelector('.hero-background-transition');
            if (backgroundTransition) {
                // Mesure la vraie hauteur du contenu
                const height = backgroundTransition.offsetHeight;
                if (height > 100) {  // Vérifier que c'est un vrai contenu
                    backgroundTransition.style.height = `${height}px`;
                }
            }
        };

        // Attendre que MangaArchive soit complètement chargé (images, etc)
        setTimeout(updateTransitionHeight, 1000);
        window.addEventListener('resize', updateTransitionHeight);
        
        return () => window.removeEventListener('resize', updateTransitionHeight);
    }, []);


    const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
        akiraCam.current = { camera, initialZ };
        akiraModel.current = model;
        setLoadedCount(prev => prev + 1);
    }, []);

    const handleGisReady = useCallback(({ camera, initialZ, model }) => {
        gisCam.current = { camera, initialZ };
        gisModel.current = model;
        setLoadedCount(prev => prev + 1);
    }, []);

    const loadPercent = Math.min(loadedCount * 50, 100);

    return (
        <>
            {/* LOADER */}
            <div ref={loaderRef} style={{
                position: 'fixed', inset: 0, zIndex: 999, background: '#0a0a0a',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '2rem'
            }}>
                <p style={{ fontFamily: 'var(--ff-family-main)', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
                    Chargement de l'expérience
                </p>
                <div style={{ width: 'clamp(200px, 40vw, 400px)', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'linear-gradient(to right, #00d4ff, #ff00ff)', transition: 'width 0.4s ease' }} />
                </div>
                <p style={{ color: '#fff', opacity: 0.4 }}>{loadPercent}%</p>
            </div>

            {/* HERO MAIN SECTION */}
            <div className="hero-section" ref={heroRef} style={{ position: 'relative', overflow: 'visible' }}>
                <div className="characters-infos">

                    <div className="akira" ref={akiraHeroRef}>
                        <Akira3D onReady={handleAkiraReady} />
                    </div>

                    <div className="container-hero">
                        <div className="container-slogan" ref={sloganRef}>
                            <div className="triangle"></div>
                            <h1 className="slogan">{title1}</h1>
                            <h1 className="slogan">{title2}</h1>
                            <div className="under-slogan"><h2>{subtitle}</h2></div>
                        </div>
                        <div ref={scrollDownRef} className="scroll-down">
                            <h3>Scroll pour en savoir plus</h3>
                            <div className="arrow"><span className="arrow-down"></span></div>
                        </div>
                    </div>

                    <div className="gis" ref={gisHeroRef}>
                        <GIS3D onReady={handleGisReady} />
                    </div>
                </div>

                <div className="buttons-hero" ref={buttonsRef} style={{ zIndex: 20 }}>
                    <a href="#">teaser</a>
                    <a href="#">tickets</a>
                </div>

                {/* ── Image de fond de transition de fin de section*/}
                <div className="hero-background-transition">
                    <MangaArchive />
                </div>

            </div>

            {/* ── HUD AKIRA ──
                Présentation courte d'Akira sur le modèle 3D.
                title  = nom de l'œuvre
                content = présentation immersive courte
            */}
            <ImmersionOverlay
                ref={overlayAkiraRef}
                side="left"
                color="cyan"
                title="Akira"
                content="1982. Katsuhiro Otomo imagine Neo-Tokyo — ville-monstre surgie de ses propres cendres. Tetsuo, adolescent brisé, devient le réceptacle d'une puissance inhumaine. Akira n'est pas un manga. C'est une prophétie."
            />

            {/* ── HUD GHOST IN THE SHELL ──
                Présentation courte de GIS sur le modèle 3D.
            */}
            <ImmersionOverlay
                ref={overlayGisRef}
                side="right"
                color="magenta"
                title="Ghost in the Shell"
                content="1989. Masamune Shirow pose la question qui hante notre siècle : si tout ce que tu es — tes souvenirs, tes sensations, ta pensée — peut être copié, effacé, reprogrammé, qu'est-ce qui reste de toi ? Le Major cherche encore."
            />
        </>
    );
}
