import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Akira3D from './Akira3D';
import GIS3D from './GIS3D';
import ImmersionOverlay from './ImmersionOverlay';

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
        if (built.current) ScrollTrigger.getAll().forEach(st => st.kill());
        built.current = true;

        const akiraCamera = akiraCam.current.camera;
        const gisCamera   = gisCam.current.camera;
        const akiraInitialZ = akiraCam.current.initialZ;
        const gisInitialZ   = gisCam.current.initialZ;

        if (!akiraCamera || !gisCamera) return;

        const akiraInitialY = akiraCamera.position.y;
        const gisInitialY   = gisCamera.position.y;

        const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
        const gisProxy   = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

        // --- RESET ÉTAT INITIAL ---
        gsap.set([akiraHeroRef.current, gisHeroRef.current, sloganRef.current, buttonsRef.current, scrollDownRef.current], { 
            opacity: 1, x: 0, y: 0, visibility: 'visible' 
        });
        gsap.set([overlayAkiraRef.current, overlayGisRef.current], { opacity: 0, pointerEvents: 'none' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: '+=800%', 
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true
            }
        });

        // 1. DÉPART : UI s'efface + GIS dégage à droite
        tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 0, y: -50, duration: 1 }, 0)

        tl.fromTo(gisHeroRef.current, {
                x: 0, 
                opacity: 1
            },
            { 
                x: 1200, 
                opacity: 0, 
                duration: 1.5
            }, 0);

        // tl.from(gisHeroRef.current, { x: 0, opacity: 1, duration: 1.5 }, 0);
        // tl.to(gisHeroRef.current, { x: 0, opacity: 1, duration: 1.5 }, 0);

        // 2. ZOOM AKIRA
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

        // 3. RÉVEIL TEXTES AKIRA
        tl.to(overlayAkiraRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 2);
        tl.to(overlayAkiraRef.current.querySelectorAll('.overlay-title, .overlay-bar, .overlay-content'), {
            opacity: 1, y: 0, stagger: 0.2, duration: 1 
        }, 2.1);

        // 4. SORTIE AKIRA GAUCHE
        tl.to(overlayAkiraRef.current, { opacity: 0, pointerEvents: 'none', duration: 1 }, 4.5)
          .to(akiraHeroRef.current, { x: -1200, opacity: 0, duration: 2 }, 4.5);

        // 5. GIS REVIENT ET ZOOM
        tl.fromTo(gisHeroRef.current, { x: 1200, opacity: 0 }, { x: 0, opacity: 1, duration: 2 }, 6.5);
        tl.to(gisProxy, {
            z: gisInitialZ * 0.25,
            y: gisInitialY + 1.5,
            rotY: -Math.PI / 4,
            duration: 2,
            onUpdate: () => {
                gisCamera.position.z = gisProxy.z;
                gisCamera.position.y = gisProxy.y;
                gisCamera.lookAt(0, gisInitialY + 1, 0);
                if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
            }
        }, 7);

        // 6. RÉVEIL TEXTES GIS
        tl.to(overlayGisRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 8.5);
        tl.to(overlayGisRef.current.querySelectorAll('.overlay-title, .overlay-bar, .overlay-content'), {
            opacity: 1, y: 0, stagger: 0.2, duration: 1 
        }, 8.6);

        // LOADER OUT
        if (loaderRef.current) {
            gsap.to(loaderRef.current, { 
                opacity: 0, duration: 0.8, 
                onComplete: () => { if(loaderRef.current) loaderRef.current.style.display = 'none'; }
            });
        }
    }, []);

    useEffect(() => {
        if (loadedCount >= 2) setTimeout(buildTimeline, 300);
    }, [loadedCount, buildTimeline]);

    const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
        akiraCam.current = { camera, initialZ };
        akiraModel.current = model;
        setLoadedCount(prev => prev + 1);
        console.log('Akira ready, total loaded:', readyCount.current + 1);

    }, []);

    const handleGisReady = useCallback(({ camera, initialZ, model }) => {
        gisCam.current = { camera, initialZ };
        gisModel.current = model;
        setLoadedCount(prev => prev + 1);
        console.log('GIS ready, total loaded:', readyCount.current + 1);
    }, []);

    const loadPercent = Math.min(loadedCount * 50, 100);


    return (
        <>
            {/* LOADER */}
            {/* <div ref={loaderRef} style={{
                position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0a',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <p style={{ color: '#fff', opacity: 0.6, letterSpacing: '4px' }}>INITIALIZING NEURAL LINK...</p>
            </div> */}

            <div ref={loaderRef} style={{
                position: 'fixed', inset: 0, zIndex: 999, background: '#0a0a0a',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem'
            }}>
                <p style={{ fontFamily: 'var(--ff-family-main)', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
                    Chargement de l'expérience
                </p>
                <div style={{ width: 'clamp(200px, 40vw, 400px)', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'linear-gradient(to right, #00d4ff, #ff00ff)', transition: 'width 0.4s ease' }} />
                </div>
                <p style={{ color: '#fff', opacity: 0.4 }}>{loadPercent}%</p>
            </div>


            <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="Akira" content="Découvrez Neo-Tokyo et les mutations de ses héros." />
            <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="Ghost in the Shell" content="Plongez dans la conscience augmentée et l'identité." />

            <div className="hero-section" ref={heroRef} style={{ position: 'relative', overflow: 'hidden' }}>
                {/* <div className="characters-infos" style={{ position: 'relative', width: '100%', height: '100vh' }}> */}
                <div className="characters-infos">
                    
                    {/* AKIRA : position absolute pour ne pas pousser l'UI */}
                    <div className="akira" ref={akiraHeroRef}>
                        <Akira3D onReady={handleAkiraReady} />
                    </div>

                    {/* UI CENTRALE */}
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

                    {/* GIS : position absolute à droite */}
                    {/* <div className="gis" ref={gisHeroRef} style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%' }}> */}
                    <div className="gis" ref={gisHeroRef}>
                        <GIS3D onReady={handleGisReady} />
                    </div>
                </div>

                <div className="buttons-hero" ref={buttonsRef} style={{ zIndex: 20 }}>
                    <a href="#">teaser</a>
                    <a href="#">tickets</a>
                </div>
            </div>
        </>
    );
}