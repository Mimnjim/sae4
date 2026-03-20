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

    const buildTimeline = useCallback(() => {
        if (built.current) return;
        built.current = true;

        console.log('🎬 buildTimeline called');
        console.log('✅ akiraCam:', akiraCam.current);
        console.log('✅ gisCam:', gisCam.current);
        console.log('✅ akiraModel:', akiraModel.current);
        console.log('✅ gisModel:', gisModel.current);

        const hero       = heroRef.current;
        const slogan     = sloganRef.current;
        const akiraEl    = akiraHeroRef.current;
        const gisEl      = gisHeroRef.current;
        const buttons    = buttonsRef.current;
        const ovAkira    = overlayAkiraRef.current;
        const ovGis      = overlayGisRef.current;
        const scrollDown = scrollDownRef.current;

        if (!hero || !ovAkira || !ovGis) {
            console.error('❌ Missing required DOM elements!');
            return;
        }

        const akiraCamera   = akiraCam.current.camera;
        const gisCamera     = gisCam.current.camera;
        const akiraInitialZ = akiraCam.current.initialZ;
        const gisInitialZ   = gisCam.current.initialZ;
        const akiraInitialY = akiraCamera?.position.y ?? 10;
        const gisInitialY   = gisCamera?.position.y ?? 0;
        const model3DAkira  = akiraModel.current;
        const model3DGis    = gisModel.current;

        if (!akiraCamera || !gisCamera) {
            console.error('❌ Missing camera objects!');
            return;
        }

        console.log('📽️ Timeline variables ready:', {
            akiraInitialZ,
            gisInitialZ,
            akiraInitialY,
            gisInitialY,
            model3DAkira: !!model3DAkira,
            model3DGis: !!model3DGis,
        });

        const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
        const gisProxy   = { z: gisInitialZ,   y: gisInitialY,   rotY: 0 };

        window.scrollTo(0, 0);

        // Réinitialise tout
        akiraCamera.position.z = akiraInitialZ;
        akiraCamera.position.y = akiraInitialY;
        akiraCamera.lookAt(0, 0, 0);
        gisCamera.position.z = gisInitialZ;
        gisCamera.position.y = gisInitialY;
        gisCamera.lookAt(0, 0, 0);
        if (model3DAkira) model3DAkira.rotation.y = 0;
        if (model3DGis) model3DGis.rotation.y = 0;

        gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 2,
            ease: 'power3.out',
            onComplete: () => {
                if (loaderRef.current) loaderRef.current.style.display = 'none';
            },
        });

        gsap.set([slogan, buttons, scrollDown], { opacity: 1, y: 0 });
        gsap.set(akiraEl, { opacity: 1, x: 0 });
        gsap.set(gisEl, { opacity: 1, x: 0 });
        gsap.set([ovAkira, ovGis], { opacity: 0, pointerEvents: 'none' });
        gsap.set(ovAkira.querySelector('.overlay-title'), { opacity: 0, y: 30 });
        gsap.set(ovAkira.querySelector('.overlay-bar'), { opacity: 0 });
        gsap.set(ovAkira.querySelector('.overlay-content'), { opacity: 0, y: 20 });
        gsap.set(ovGis.querySelector('.overlay-title'), { opacity: 0, y: 30 });
        gsap.set(ovGis.querySelector('.overlay-bar'), { opacity: 0 });
        gsap.set(ovGis.querySelector('.overlay-content'), { opacity: 0, y: 20 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '+=600%',
                scrub: 1.2,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    console.log('📊 ScrollTrigger progress:', self.progress.toFixed(2));
                },
            },
        });

        // PHASE 1: Contenu disparaît + GIS sort à droite
        tl.to([slogan, buttons, scrollDown], {
            opacity: 0,
            y: -20,
            duration: 0.08,
            ease: 'none',
        }, 0.05);

        tl.to(
            gisEl,
            { opacity: 0, x: 600, duration: 0.12, ease: 'none' },
            0.05
        );

        // PHASE 1b: Zoom + rotation Akira 90°
        tl.fromTo(
            akiraProxy,
            { z: akiraInitialZ, y: akiraInitialY, rotY: 0 },
            {
                z: akiraInitialZ * 0.15,
                y: akiraInitialY + 18,
                rotY: Math.PI / 2,
                duration: 0.23,  // ← IMPORTANT: doit aller jusqu'à 0.33
                ease: 'none',
                onUpdate() {
                    console.log('🎥 Akira onUpdate - proxy:', {
                        z: akiraProxy.z.toFixed(2),
                        y: akiraProxy.y.toFixed(2),
                        rotY: akiraProxy.rotY.toFixed(2),
                    });
                    akiraCamera.position.z = akiraProxy.z;
                    akiraCamera.position.y = akiraProxy.y;
                    akiraCamera.lookAt(0, akiraProxy.y - 3, 0);
                    if (model3DAkira) {
                        model3DAkira.rotation.y = akiraProxy.rotY;
                        console.log('🎭 Model rotation updated to:', akiraProxy.rotY.toFixed(3));
                    }
                },
            },
            0.10
        );

        tl.to(akiraEl, { opacity: 0, duration: 0.05, ease: 'none' }, 0.29);

        // PHASE 2: Overlay Akira
        tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08, ease: 'none' }, 0.33);
        tl.to(ovAkira.querySelector('.overlay-title'), { opacity: 1, y: 0, duration: 0.07, ease: 'none' }, 0.36);
        tl.to(ovAkira.querySelector('.overlay-bar'), { opacity: 1, duration: 0.05, ease: 'none' }, 0.40);
        tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'none' }, 0.43);

        // PHASE 3: Akira disparaît
        tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.06, ease: 'none' }, 0.52);

        tl.fromTo(
            akiraProxy,
            { z: akiraInitialZ * 0.15, y: akiraInitialY + 18, rotY: Math.PI / 2 },
            {
                z: akiraInitialZ,
                y: akiraInitialY,
                rotY: 0,
                duration: 0.08,  // ← IMPORTANT: doit aller jusqu'à 0.60
                ease: 'none',
                onUpdate() {
                    console.log('🎥 Akira RETURN:', {
                        z: akiraProxy.z.toFixed(2),
                        y: akiraProxy.y.toFixed(2),
                        rotY: akiraProxy.rotY.toFixed(2),
                    });
                    akiraCamera.position.z = akiraProxy.z;
                    akiraCamera.position.y = akiraProxy.y;
                    akiraCamera.lookAt(0, akiraProxy.y, 0);
                    if (model3DAkira) {
                        model3DAkira.rotation.y = akiraProxy.rotY;
                    }
                },
            },
            0.52
        );

        tl.to(akiraEl, { opacity: 0, x: -600, duration: 0.10, ease: 'none' }, 0.52);

        // PHASE 4: GIS revient
        tl.to(
            gisEl,
            { opacity: 1, x: 0, duration: 0.12, ease: 'none' },
            0.60
        );

        // PHASE 5: Zoom + rotation GIS -45°
        tl.fromTo(
            gisProxy,
            { z: gisInitialZ, y: gisInitialY, rotY: 0 },
            {
                z: gisInitialZ * 0.25,
                y: gisInitialY + 0.8,
                rotY: -Math.PI / 4,
                duration: 0.27,  // ← IMPORTANT: doit aller jusqu'à 0.87
                ease: 'none',
                onUpdate() {
                    console.log('🎥 GIS onUpdate - proxy:', {
                        z: gisProxy.z.toFixed(2),
                        y: gisProxy.y.toFixed(2),
                        rotY: gisProxy.rotY.toFixed(2),
                    });
                    gisCamera.position.z = gisProxy.z;
                    gisCamera.position.y = gisProxy.y;
                    gisCamera.lookAt(0, gisProxy.y - 0.3, 0);
                    if (model3DGis) {
                        model3DGis.rotation.y = gisProxy.rotY;
                        console.log('🎭 GIS Model rotation updated to:', gisProxy.rotY.toFixed(3));
                    }
                },
            },
            0.60
        );

        tl.to(gisEl, { opacity: 0, duration: 0.05, ease: 'none' }, 0.87);

        // PHASE 6: Overlay GIS
        tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08, ease: 'none' }, 0.87);
        tl.to(ovGis.querySelector('.overlay-title'), { opacity: 1, y: 0, duration: 0.07, ease: 'none' }, 0.90);
        tl.to(ovGis.querySelector('.overlay-bar'), { opacity: 1, duration: 0.05, ease: 'none' }, 0.93);
        tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'none' }, 0.96);

        // FIN
        ScrollTrigger.create({
            trigger: hero,
            start: 'bottom bottom',
            onEnter: () => {
                gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
                gisCamera.position.z = gisInitialZ;
                gisCamera.position.y = gisInitialY;
                gisCamera.lookAt(0, 0, 0);
                akiraCamera.position.z = akiraInitialZ;
                akiraCamera.position.y = akiraInitialY;
                akiraCamera.lookAt(0, 0, 0);
                if (model3DAkira) model3DAkira.rotation.y = 0;
                if (model3DGis) model3DGis.rotation.y = 0;
                gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0, x: 0 });
            },
        });
    }, []);

    useEffect(() => {
        if (loadedCount >= 2) {
            const timer = setTimeout(() => buildTimeline(), 50);
            return () => clearTimeout(timer);
        }
    }, [loadedCount, buildTimeline]);

    const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
        console.log('✅ handleAkiraReady called:', { hasCamera: !!camera, initialZ, hasModel: !!model });
        if (akiraCam.current.initialZ !== null) {
            console.warn('⚠️ Akira already ready');
            return;
        }
        akiraCam.current.camera = camera;
        akiraCam.current.initialZ = initialZ;
        if (model) akiraModel.current = model;
        readyCount.current += 1;
        console.log('📊 readyCount:', readyCount.current);
        setLoadedCount(Math.min(readyCount.current, 2));
    }, []);

    const handleGisReady = useCallback(({ camera, initialZ, model }) => {
        console.log('✅ handleGisReady called:', { hasCamera: !!camera, initialZ, hasModel: !!model });
        if (gisCam.current.initialZ !== null) {
            console.warn('⚠️ GIS already ready');
            return;
        }
        gisCam.current.camera = camera;
        gisCam.current.initialZ = initialZ;
        if (model) gisModel.current = model;
        readyCount.current += 1;
        console.log('📊 readyCount:', readyCount.current);
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
    const isLoaded = loadedCount >= 2;

    return (
        <>
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
                <p
                    style={{
                        fontFamily: 'var(--ff-family-main)',
                        fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                        fontWeight: 300,
                        letterSpacing: '6px',
                        textTransform: 'uppercase',
                        color: '#fff',
                        opacity: 0.6,
                        margin: 0,
                    }}
                >
                    Chargement de l'expérience
                </p>
                <div
                    style={{
                        width: 'clamp(200px, 40vw, 400px)',
                        height: '2px',
                        background: 'rgba(255,255,255,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: `${loadPercent}%`,
                            background: 'linear-gradient(to right, #00d4ff, #ff00ff)',
                            transition: 'width 0.4s ease',
                        }}
                    />
                </div>
                <p
                    style={{
                        fontFamily: 'var(--ff-family-main)',
                        fontSize: '0.85rem',
                        fontWeight: 300,
                        letterSpacing: '3px',
                        color: '#fff',
                        opacity: 0.4,
                        margin: 0,
                    }}
                >
                    {loadPercent}%
                </p>
            </div>

            <ImmersionOverlay
                ref={overlayAkiraRef}
                side="left"
                color="cyan"
                title="Akira"
                content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
            />

            <ImmersionOverlay
                ref={overlayGisRef}
                side="right"
                color="magenta"
                title="Ghost in the Shell"
                content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
            />

            <div className="hero-section" ref={heroRef}>
                <div className="characters-infos">
                    <div className="akira" ref={akiraHeroRef}>
                        <Akira3D onReady={handleAkiraReady} />
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
                        <div ref={scrollDownRef} className="scroll-down">
                            <h3>Scroll pour en savoir plus</h3>
                            <div className="arrow">
                                <span className="arrow-down"></span>
                            </div>
                        </div>
                    </div>

                    <div className="gis" ref={gisHeroRef}>
                        <GIS3D onReady={handleGisReady} />
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
