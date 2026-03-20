// // // // // // // VERSION FINALE - SCÉNARIO IMMERSIF
// // // // // // import { useRef, useEffect, useCallback, useState } from 'react';
// // // // // // import gsap from 'gsap';
// // // // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // // // // // import Akira3D from './Akira3D';
// // // // // // import GIS3D from './GIS3D';
// // // // // // import ImmersionOverlay from './ImmersionOverlay';

// // // // // // gsap.registerPlugin(ScrollTrigger);

// // // // // // export default function Hero({ title1, title2, subtitle }) {
// // // // // //     const heroRef         = useRef(null);
// // // // // //     const sloganRef       = useRef(null);
// // // // // //     const akiraHeroRef    = useRef(null);
// // // // // //     const gisHeroRef      = useRef(null);
// // // // // //     const buttonsRef      = useRef(null);
// // // // // //     const overlayAkiraRef = useRef(null);
// // // // // //     const overlayGisRef   = useRef(null);
// // // // // //     const loaderRef       = useRef(null);
// // // // // //     const scrollDownRef   = useRef(null);

// // // // // //     const akiraCam   = useRef({ camera: null, initialZ: null });
// // // // // //     const gisCam     = useRef({ camera: null, initialZ: null });
// // // // // //     const akiraModel = useRef(null);
// // // // // //     const gisModel   = useRef(null);

// // // // // //     const built      = useRef(false);
// // // // // //     const readyCount = useRef(0);
// // // // // //     const [loadedCount, setLoadedCount] = useState(0);

// // // // // //     const buildTimeline = useCallback(() => {
// // // // // //         if (built.current) {
// // // // // //             ScrollTrigger.getAll().forEach(st => st.kill());
// // // // // //         }
// // // // // //         built.current = true;

// // // // // //         if (loaderRef.current) {
// // // // // //             gsap.to(loaderRef.current, {
// // // // // //                 opacity: 0,
// // // // // //                 duration: 1,
// // // // // //                 ease: "power2.out",
// // // // // //                 onComplete: () => {
// // // // // //                     if (loaderRef.current) loaderRef.current.style.display = 'none';
// // // // // //                 }
// // // // // //             });
// // // // // //         }

// // // // // //         const hero       = heroRef.current;
// // // // // //         const slogan     = sloganRef.current;
// // // // // //         const akiraEl    = akiraHeroRef.current;
// // // // // //         const gisEl      = gisHeroRef.current;
// // // // // //         const buttons    = buttonsRef.current;
// // // // // //         const ovAkira    = overlayAkiraRef.current;
// // // // // //         const ovGis      = overlayGisRef.current;
// // // // // //         const scrollDown = scrollDownRef.current;

// // // // // //         const akiraCamera = akiraCam.current.camera;
// // // // // //         const gisCamera   = gisCam.current.camera;
// // // // // //         const akiraInitialZ = akiraCam.current.initialZ;
// // // // // //         const gisInitialZ   = gisCam.current.initialZ;

// // // // // //         if (!akiraCamera || !gisCamera) return;

// // // // // //         const akiraInitialY = akiraCamera.position.y;
// // // // // //         const gisInitialY   = gisCamera.position.y;
// // // // // //         const model3DAkira  = akiraModel.current;
// // // // // //         const model3DGis    = gisModel.current;

// // // // // //         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
// // // // // //         const gisProxy   = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

// // // // // //         // --- ÉTAT INITIAL ---
// // // // // //         gsap.set([akiraEl, gisEl, slogan, buttons, scrollDown], { opacity: 1, x: 0, y: 0 });
// // // // // //         akiraCamera.position.set(0, akiraInitialY, akiraInitialZ);
// // // // // //         gisCamera.position.set(0, gisInitialY, gisInitialZ);
// // // // // //         if (model3DAkira) model3DAkira.rotation.y = 0;
// // // // // //         if (model3DGis) model3DGis.rotation.y = 0;

// // // // // //         const tl = gsap.timeline({
// // // // // //             scrollTrigger: {
// // // // // //                 trigger: hero,
// // // // // //                 start: 'top top',
// // // // // //                 end: '+=800%', // Un peu plus long pour décomposer les phases
// // // // // //                 scrub: 1,
// // // // // //                 pin: true,
// // // // // //             }
// // // // // //         });

// // // // // //         // 1. DISPARITION UI + GIS SORT À DROITE
// // // // // //         tl.to([slogan, buttons, scrollDown], { opacity: 0, y: -50, duration: 0.5 }, 0)
// // // // // //           .to(gisEl, { x: 800, opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0);

// // // // // //         // 2. ZOOM AKIRA (Profil 90°)
// // // // // //         tl.to(akiraProxy, {
// // // // // //             z: akiraInitialZ * 0.25,
// // // // // //             y: akiraInitialY + 15,
// // // // // //             rotY: Math.PI / 2, 
// // // // // //             duration: 1.5,
// // // // // //             onUpdate: () => {
// // // // // //                 akiraCamera.position.z = akiraProxy.z;
// // // // // //                 akiraCamera.position.y = akiraProxy.y;
// // // // // //                 akiraCamera.lookAt(0, akiraProxy.y - 3, 0);
// // // // // //                 if (model3DAkira) model3DAkira.rotation.y = akiraProxy.rotY;
// // // // // //             }
// // // // // //         }, 0.5);

// // // // // //         // 3. OVERLAY AKIRA APPARAÎT
// // // // // //         tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 2);

// // // // // //         // 4. SORTIE AKIRA PAR LA GAUCHE + DISPARITION OVERLAY
// // // // // //         tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 3)
// // // // // //           .to(akiraEl, { x: -800, opacity: 0, duration: 1, ease: "power2.inOut" }, 3);

// // // // // //         // 5. RETOUR GIS PAR LA DROITE + ZOOM (Profil 45° vers la gauche)
// // // // // //         // On le reset d'abord hors écran à droite si besoin (déjà fait par le x: 800 plus haut)
// // // // // //         tl.to(gisEl, { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 4);
        
// // // // // //         tl.to(gisProxy, {
// // // // // //             z: gisInitialZ * 0.3,
// // // // // //             y: gisInitialY + 1.2,
// // // // // //             rotY: -Math.PI / 4, // 45 degrés vers la gauche
// // // // // //             duration: 1.5,
// // // // // //             onUpdate: () => {
// // // // // //                 gisCamera.position.z = gisProxy.z;
// // // // // //                 gisCamera.position.y = gisProxy.y;
// // // // // //                 gisCamera.lookAt(0, gisProxy.y - 0.3, 0);
// // // // // //                 if (model3DGis) model3DGis.rotation.y = gisProxy.rotY;
// // // // // //             }
// // // // // //         }, 4.5);

// // // // // //         // 6. OVERLAY GIS
// // // // // //         tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 6);

// // // // // //     }, []);

// // // // // //     useEffect(() => {
// // // // // //         if (loadedCount >= 2) {
// // // // // //             // Petit délai pour laisser Three.js respirer après le loader
// // // // // //             setTimeout(buildTimeline, 100);
// // // // // //         }
// // // // // //     }, [loadedCount, buildTimeline]);

// // // // // //     const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
// // // // // //         akiraCam.current = { camera, initialZ };
// // // // // //         akiraModel.current = model;
// // // // // //         readyCount.current += 1;
// // // // // //         setLoadedCount(readyCount.current);
// // // // // //     }, []);

// // // // // //     const handleGisReady = useCallback(({ camera, initialZ, model }) => {
// // // // // //         gisCam.current = { camera, initialZ };
// // // // // //         gisModel.current = model;
// // // // // //         readyCount.current += 1;
// // // // // //         setLoadedCount(readyCount.current);
// // // // // //     }, []);

// // // // // //     useEffect(() => {
// // // // // //         return () => ScrollTrigger.getAll().forEach(st => st.kill());
// // // // // //     }, []);

// // // // // //     const loadPercent = Math.min(loadedCount * 50, 100);

// // // // // //     return (
// // // // // //         <>
// // // // // //             {/* LOADER DESIGN V1 */}
// // // // // //             <div ref={loaderRef} style={{
// // // // // //                 position: 'fixed', inset: 0, zIndex: 999, background: '#0a0a0a',
// // // // // //                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem'
// // // // // //             }}>
// // // // // //                 <p style={{ fontFamily: 'var(--ff-family-main)', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
// // // // // //                     Chargement de l'expérience
// // // // // //                 </p>
// // // // // //                 <div style={{ width: 'clamp(200px, 40vw, 400px)', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
// // // // // //                     <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'linear-gradient(to right, #00d4ff, #ff00ff)', transition: 'width 0.4s ease' }} />
// // // // // //                 </div>
// // // // // //                 <p style={{ color: '#fff', opacity: 0.4 }}>{loadPercent}%</p>
// // // // // //             </div>

// // // // // //             <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="Akira" content="Découvrez Neo-Tokyo et les mutations de ses héros." />
// // // // // //             <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="Ghost in the Shell" content="Plongez dans la conscience augmentée et l'identité." />

// // // // // //             <div className="hero-section" ref={heroRef}>
// // // // // //                 <div className="characters-infos">
// // // // // //                     {/* AKIRA À GAUCHE */}
// // // // // //                     <div className="akira" ref={akiraHeroRef}>
// // // // // //                         <Akira3D onReady={handleAkiraReady} />
// // // // // //                     </div>

// // // // // //                     {/* CONTENU AU MILIEU */}
// // // // // //                     <div className="container-hero">
// // // // // //                         <div className="container-slogan" ref={sloganRef}>
// // // // // //                             <div className="triangle"></div>
// // // // // //                             <h1 className="slogan">{title1}</h1>
// // // // // //                             <h1 className="slogan">{title2}</h1>
// // // // // //                             <div className="under-slogan">
// // // // // //                                 <h2>{subtitle}</h2>
// // // // // //                             </div>
// // // // // //                         </div>

// // // // // //                         <div ref={scrollDownRef} className="scroll-down">
// // // // // //                             <h3>Scroll pour en savoir plus</h3>
// // // // // //                             <div className="arrow">
// // // // // //                                 <span className="arrow-down"></span>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                     </div>

// // // // // //                     {/* GIS À DROITE */}
// // // // // //                     <div className="gis" ref={gisHeroRef}>
// // // // // //                         <GIS3D onReady={handleGisReady} />
// // // // // //                     </div>
// // // // // //                 </div>

// // // // // //                 <div className="buttons-hero" ref={buttonsRef}>
// // // // // //                     <a href="#">teaser</a>
// // // // // //                     <a href="#">tickets</a>
// // // // // //                 </div>
// // // // // //             </div>
// // // // // //         </>
// // // // // //     );
// // // // // // }


// // // // // import { useRef, useEffect, useCallback, useState } from 'react';
// // // // // import gsap from 'gsap';
// // // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // // // // import Akira3D from './Akira3D';
// // // // // import GIS3D from './GIS3D';
// // // // // import ImmersionOverlay from './ImmersionOverlay';

// // // // // gsap.registerPlugin(ScrollTrigger);

// // // // // export default function Hero({ title1, title2, subtitle }) {
// // // // //     const heroRef         = useRef(null);
// // // // //     const sloganRef       = useRef(null);
// // // // //     const akiraHeroRef    = useRef(null);
// // // // //     const gisHeroRef      = useRef(null);
// // // // //     const buttonsRef      = useRef(null);
// // // // //     const overlayAkiraRef = useRef(null);
// // // // //     const overlayGisRef   = useRef(null);
// // // // //     const loaderRef       = useRef(null);
// // // // //     const scrollDownRef   = useRef(null);

// // // // //     const akiraCam   = useRef({ camera: null, initialZ: null });
// // // // //     const gisCam     = useRef({ camera: null, initialZ: null });
// // // // //     const akiraModel = useRef(null);
// // // // //     const gisModel   = useRef(null);

// // // // //     const built      = useRef(false);
// // // // //     const [loadedCount, setLoadedCount] = useState(0);

// // // // //     // Force le scroll en haut au rafraîchissement
// // // // //     useEffect(() => {
// // // // //         window.history.scrollRestoration = 'manual';
// // // // //         window.scrollTo(0, 0);
// // // // //     }, []);

// // // // //     const buildTimeline = useCallback(() => {
// // // // //         if (built.current) ScrollTrigger.getAll().forEach(st => st.kill());
// // // // //         built.current = true;

// // // // //         const akiraCamera = akiraCam.current.camera;
// // // // //         const gisCamera   = gisCam.current.camera;
// // // // //         const akiraInitialZ = akiraCam.current.initialZ;
// // // // //         const gisInitialZ   = gisCam.current.initialZ;

// // // // //         if (!akiraCamera || !gisCamera) return;

// // // // //         const akiraInitialY = akiraCamera.position.y;
// // // // //         const gisInitialY   = gisCamera.position.y;

// // // // //         // Proxies pour des valeurs propres
// // // // //         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
// // // // //         const gisProxy   = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

// // // // //         // RESET ETAT INITIAL
// // // // //         gsap.set([akiraHeroRef.current, gisHeroRef.current, sloganRef.current, buttonsRef.current, scrollDownRef.current], { 
// // // // //             opacity: 1, x: 0, y: 0 
// // // // //         });

// // // // //         const tl = gsap.timeline({
// // // // //             scrollTrigger: {
// // // // //                 trigger: heroRef.current,
// // // // //                 start: 'top top',
// // // // //                 end: '+=1000%', 
// // // // //                 scrub: 1,
// // // // //                 pin: true,
// // // // //                 invalidateOnRefresh: true
// // // // //             }
// // // // //         });

// // // // //         // 1. DISPARITION UI + DEPART GIS
// // // // //         tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 0, y: -50, duration: 1 }, 0)
// // // // //           .to(gisHeroRef.current, { x: 1000, opacity: 0, duration: 1.5 }, 0);

// // // // //         // 2. ZOOM AKIRA (PROFIL 90°)
// // // // //         tl.to(akiraProxy, {
// // // // //             z: akiraInitialZ * 0.22,
// // // // //             y: akiraInitialY + 12,
// // // // //             rotY: Math.PI / 2,
// // // // //             duration: 2,
// // // // //             onUpdate: () => {
// // // // //                 akiraCamera.position.z = akiraProxy.z;
// // // // //                 akiraCamera.position.y = akiraProxy.y;
// // // // //                 // Important: lookAt fixe pour éviter les tremblements
// // // // //                 akiraCamera.lookAt(0, akiraInitialY + 10, 0); 
// // // // //                 if (akiraModel.current) akiraModel.current.rotation.y = akiraProxy.rotY;
// // // // //             }
// // // // //         }, 0.5);

// // // // //         // 3. OVERLAY AKIRA (Apparition du conteneur + texte interne)
// // // // //         tl.to(overlayAkiraRef.current, { opacity: 1, pointerEvents: 'auto', duration: 1 }, 2.5)
// // // // //           .to(overlayAkiraRef.current.querySelectorAll('.overlay-title, .overlay-content'), { 
// // // // //               opacity: 1, y: 0, stagger: 0.2, duration: 1 
// // // // //           }, 2.6);

// // // // //         // 4. SORTIE AKIRA PAR LA GAUCHE
// // // // //         tl.to(overlayAkiraRef.current, { opacity: 0, pointerEvents: 'none', duration: 1 }, 4.5)
// // // // //           .to(akiraHeroRef.current, { x: -1000, opacity: 0, duration: 2 }, 4.5);

// // // // //         // 5. ARRIVEE GIS + ZOOM (PROFIL 45°)
// // // // //         tl.fromTo(gisHeroRef.current, { x: 1000, opacity: 0 }, { x: 0, opacity: 1, duration: 2 }, 6);
        
// // // // //         tl.to(gisProxy, {
// // // // //             z: gisInitialZ * 0.25,
// // // // //             y: gisInitialY + 1.5,
// // // // //             rotY: -Math.PI / 4,
// // // // //             duration: 2,
// // // // //             onUpdate: () => {
// // // // //                 gisCamera.position.z = gisProxy.z;
// // // // //                 gisCamera.position.y = gisProxy.y;
// // // // //                 gisCamera.lookAt(0, gisInitialY + 1, 0);
// // // // //                 if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
// // // // //             }
// // // // //         }, 6.5);

// // // // //         // 6. OVERLAY GIS
// // // // //         tl.to(overlayGisRef.current, { opacity: 1, pointerEvents: 'auto', duration: 1 }, 8.5)
// // // // //           .to(overlayGisRef.current.querySelectorAll('.overlay-title, .overlay-content'), { 
// // // // //               opacity: 1, y: 0, stagger: 0.2, duration: 1 
// // // // //           }, 8.6);

// // // // //         // Loader Out
// // // // //         if (loaderRef.current) {
// // // // //             gsap.to(loaderRef.current, { opacity: 0, duration: 1, onComplete: () => loaderRef.current.style.display = 'none' });
// // // // //         }

// // // // //     }, []);

// // // // //     useEffect(() => {
// // // // //         if (loadedCount >= 2) buildTimeline();
// // // // //     }, [loadedCount, buildTimeline]);

// // // // //     const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
// // // // //         akiraCam.current = { camera, initialZ };
// // // // //         akiraModel.current = model;
// // // // //         setLoadedCount(prev => prev + 1);
// // // // //     }, []);

// // // // //     const handleGisReady = useCallback(({ camera, initialZ, model }) => {
// // // // //         gisCam.current = { camera, initialZ };
// // // // //         gisModel.current = model;
// // // // //         setLoadedCount(prev => prev + 1);
// // // // //     }, []);

// // // // //     return (
// // // // //         <>
// // // // //             <div ref={loaderRef} style={{ position: 'fixed', inset: 0, zIndex: 999, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// // // // //                 <p style={{ color: '#fff', letterSpacing: '4px' }}>INITIALIZING NEURAL LINK...</p>
// // // // //             </div>

// // // // //             {/* Vérifie que ImmersionOverlay n'a pas de styles "display: none" cachés */}
// // // // //             <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="AKIRA / TESTUO" content="Les mutations physiques trahissent l'éveil d'une puissance divine incontrôlée." />
// // // // //             <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="MOTOKO KUSANAGI" content="Une âme cybernétique cherchant son humanité dans un océan de données." />

// // // // //             <div className="hero-section" ref={heroRef} style={{ overflow: 'hidden', background: '#050505' }}>
// // // // //                 <div className="characters-infos">
// // // // //                     <div className="akira" ref={akiraHeroRef}>
// // // // //                         <Akira3D onReady={handleAkiraReady} />
// // // // //                     </div>

// // // // //                     <div className="container-hero">
// // // // //                         <div className="container-slogan" ref={sloganRef}>
// // // // //                             <h1 className="slogan">{title1}</h1>
// // // // //                             <h1 className="slogan">{title2}</h1>
// // // // //                             <div className="under-slogan"><h2>{subtitle}</h2></div>
// // // // //                         </div>
// // // // //                         <div ref={scrollDownRef} className="scroll-down">
// // // // //                             <span className="arrow-down"></span>
// // // // //                         </div>
// // // // //                     </div>

// // // // //                     <div className="gis" ref={gisHeroRef}>
// // // // //                         <GIS3D onReady={handleGisReady} />
// // // // //                     </div>
// // // // //                 </div>

// // // // //                 <div className="buttons-hero" ref={buttonsRef}>
// // // // //                     <a href="#teaser">MISSION BRIEF</a>
// // // // //                 </div>
// // // // //             </div>
// // // // //         </>
// // // // //     );
// // // // // }

// // // // import { useRef, useEffect, useCallback, useState } from 'react';
// // // // import gsap from 'gsap';
// // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // // // import Akira3D from './Akira3D';
// // // // import GIS3D from './GIS3D';
// // // // import ImmersionOverlay from './ImmersionOverlay';

// // // // gsap.registerPlugin(ScrollTrigger);

// // // // export default function Hero({ title1, title2, subtitle }) {
// // // //     const heroRef         = useRef(null);
// // // //     const sloganRef       = useRef(null);
// // // //     const akiraHeroRef    = useRef(null);
// // // //     const gisHeroRef      = useRef(null);
// // // //     const buttonsRef      = useRef(null);
// // // //     const overlayAkiraRef = useRef(null);
// // // //     const overlayGisRef   = useRef(null);
// // // //     const loaderRef       = useRef(null);
// // // //     const scrollDownRef   = useRef(null);

// // // //     const akiraCam   = useRef({ camera: null, initialZ: null });
// // // //     const gisCam     = useRef({ camera: null, initialZ: null });
// // // //     const akiraModel = useRef(null);
// // // //     const gisModel   = useRef(null);

// // // //     const built      = useRef(false);
// // // //     const readyCount = useRef(0);
// // // //     const [loadedCount, setLoadedCount] = useState(0);

// // // //     // 1. FORCE LE HAUT DE PAGE IMMÉDIATEMENT
// // // //     useEffect(() => {
// // // //         window.history.scrollRestoration = 'manual';
// // // //         window.scrollTo(0, 0);
// // // //     }, []);

// // // //     const buildTimeline = useCallback(() => {
// // // //         if (built.current) ScrollTrigger.getAll().forEach(st => st.kill());
// // // //         built.current = true;

// // // //         const akiraCamera = akiraCam.current.camera;
// // // //         const gisCamera   = gisCam.current.camera;
// // // //         const akiraInitialZ = akiraCam.current.initialZ;
// // // //         const gisInitialZ   = gisCam.current.initialZ;

// // // //         if (!akiraCamera || !gisCamera) return;

// // // //         const akiraInitialY = akiraCamera.position.y;
// // // //         const gisInitialY   = gisCamera.position.y;

// // // //         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
// // // //         const gisProxy   = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

// // // //         // --- ÉTAT INITIAL CRITIQUE (FORCE TOUT À L'ÉCRAN) ---
// // // //         gsap.set([akiraHeroRef.current, gisHeroRef.current, sloganRef.current, buttonsRef.current, scrollDownRef.current], { 
// // // //             opacity: 1, 
// // // //             x: 0, 
// // // //             y: -10,
// // // //             visibility: 'visible' 
// // // //         });
        
// // // //         // On cache les overlays au départ
// // // //         gsap.set([overlayAkiraRef.current, overlayGisRef.current], { opacity: 0, pointerEvents: 'none' });

// // // //         const tl = gsap.timeline({
// // // //             scrollTrigger: {
// // // //                 trigger: heroRef.current,
// // // //                 start: 'top top',
// // // //                 end: '+=800%', 
// // // //                 scrub: 1,
// // // //                 pin: true,
// // // //                 invalidateOnRefresh: true
// // // //             }
// // // //         });

// // // //         // --- SÉQUENCE ---

// // // //         // 1. DÉPART : L'UI s'efface et GIS dégage à droite
// // // //         tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 0, y: -50, duration: 1 }, 0)
        
// // // //         // tl.from(gisHeroRef.current, { x: 500, opacity: 0, duration: 1.5 }, 0);
// // // //         // tl.to(gisHeroRef.current, { x: 0, opacity: 0, duration: 1.5 }, 0);
// // // //         tl.fromTo(gisHeroRef.current, { x: 0, opacity: 1, duration: 2 }, { x: 800, opacity: 0, duration: 1}, 0);

// // // //         // 2. AKIRA ZOOM
// // // //         tl.to(akiraProxy, {
// // // //             z: akiraInitialZ * 0.54,
// // // //             y: akiraInitialY + 18,
// // // //             rotY: Math.PI / 2,
// // // //             duration: 2,
// // // //             onUpdate: () => {
// // // //                 akiraCamera.position.z = akiraProxy.z;
// // // //                 akiraCamera.position.y = akiraProxy.y;
// // // //                 akiraCamera.lookAt(0, akiraInitialY + 20, 0); 
// // // //                 if (akiraModel.current) akiraModel.current.rotation.y = akiraProxy.rotY;
// // // //             }
// // // //         }, 0.5);

// // // //         // 3. TEXTE AKIRA (On cible TOUT ce qui est dans l'overlay)
// // // //         tl.to(overlayAkiraRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 1);

// // // //         // 4. AKIRA SORT À GAUCHE
// // // //         // tl.to(overlayAkiraRef.current, { opacity: 0, pointerEvents: 'none', duration: 1 }, 4.5)
// // // //         //   .to(akiraHeroRef.current, { x: -1200, opacity: 0, duration: 2 }, 4.5);

// // // //         // 5. GIS REVIENT
// // // //         tl.fromTo(gisHeroRef.current, { x: 1200, opacity: 0 }, { x: 0, opacity: 1, duration: 2 }, 6);
        
// // // //         tl.to(gisProxy, {
// // // //             z: gisInitialZ * 0.25,
// // // //             y: gisInitialY + 1.5,
// // // //             rotY: -Math.PI / 4,
// // // //             duration: 2,
// // // //             onUpdate: () => {
// // // //                 gisCamera.position.z = gisProxy.z;
// // // //                 gisCamera.position.y = gisProxy.y;
// // // //                 gisCamera.lookAt(0, gisInitialY + 1, 0);
// // // //                 if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
// // // //             }
// // // //         }, 6.5);

// // // //         // 6. TEXTE GIS
// // // //         tl.to(overlayGisRef.current, { opacity: 1, pointerEvents: 'auto', duration: 1 }, 8.5);

// // // //         // FIN : SORTIE LOADER
// // // //         if (loaderRef.current) {
// // // //             gsap.to(loaderRef.current, { 
// // // //                 opacity: 0, duration: 0.8, 
// // // //                 onComplete: () => { if(loaderRef.current) loaderRef.current.style.display = 'none'; }
// // // //             });
// // // //         }
// // // //     }, []);

// // // //     useEffect(() => {
// // // //         if (loadedCount >= 2) {
// // // //             setTimeout(buildTimeline, 200);
// // // //         }
// // // //     }, [loadedCount, buildTimeline]);

// // // //     const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
// // // //         akiraCam.current = { camera, initialZ };
// // // //         akiraModel.current = model;
// // // //         readyCount.current += 1;
// // // //         setLoadedCount(readyCount.current);
// // // //     }, []);

// // // //     const handleGisReady = useCallback(({ camera, initialZ, model }) => {
// // // //         gisCam.current = { camera, initialZ };
// // // //         gisModel.current = model;
// // // //         readyCount.current += 1;
// // // //         setLoadedCount(readyCount.current);
// // // //     }, []);

// // // //     const loadPercent = Math.min(loadedCount * 50, 100);

// // // //     return (
// // // //         <>
// // // //             {/* LOADER DESIGN D'ORIGINE */}
// // // //             <div ref={loaderRef} style={{
// // // //                 position: 'fixed', inset: 0, zIndex: 999, background: '#0a0a0a',
// // // //                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem'
// // // //             }}>
// // // //                 <p style={{ fontFamily: 'var(--ff-family-main)', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
// // // //                     Chargement de l'expérience
// // // //                 </p>
// // // //                 <div style={{ width: 'clamp(200px, 40vw, 400px)', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
// // // //                     <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'linear-gradient(to right, #00d4ff, #ff00ff)', transition: 'width 0.4s ease' }} />
// // // //                 </div>
// // // //                 <p style={{ color: '#fff', opacity: 0.4 }}>{loadPercent}%</p>
// // // //             </div>

// // // //             <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="Akira" content="Découvrez Neo-Tokyo et les mutations de ses héros." />
// // // //             <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="Ghost in the Shell" content="Plongez dans la conscience augmentée et l'identité." />

// // // //             <div className="hero-section" ref={heroRef} style={{ overflow: 'hidden' }}>
// // // //                 <div className="characters-infos">
// // // //                     <div className="akira" ref={akiraHeroRef}>
// // // //                         <Akira3D onReady={handleAkiraReady} />
// // // //                     </div>

// // // //                     <div className="container-hero">
// // // //                         <div className="container-slogan" ref={sloganRef}>
// // // //                             <div className="triangle"></div>
// // // //                             <h1 className="slogan">{title1}</h1>
// // // //                             <h1 className="slogan">{title2}</h1>
// // // //                             <div className="under-slogan">
// // // //                                 <h2>{subtitle}</h2>
// // // //                             </div>
// // // //                         </div>
// // // //                         <div ref={scrollDownRef} className="scroll-down">
// // // //                             <h3>Scroll pour en savoir plus</h3>
// // // //                             <div className="arrow"><span className="arrow-down"></span></div>
// // // //                         </div>
// // // //                     </div>

// // // //                     <div className="gis" ref={gisHeroRef}>
// // // //                         <GIS3D onReady={handleGisReady} />
// // // //                     </div>
// // // //                 </div>

// // // //                 <div className="buttons-hero" ref={buttonsRef}>
// // // //                     <a href="#">teaser</a>
// // // //                     <a href="#">tickets</a>
// // // //                 </div>
// // // //             </div>
// // // //         </>
// // // //     );
// // // // }

// import { useRef, useEffect, useCallback, useState } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Akira3D from './Akira3D';
// import GIS3D from './GIS3D';
// import ImmersionOverlay from './ImmersionOverlay';

// gsap.registerPlugin(ScrollTrigger);

// export default function Hero({ title1, title2, subtitle }) {
//     const heroRef         = useRef(null);
//     const sloganRef       = useRef(null);
//     const akiraHeroRef    = useRef(null);
//     const gisHeroRef      = useRef(null);
//     const buttonsRef      = useRef(null);
//     const overlayAkiraRef = useRef(null);
//     const overlayGisRef   = useRef(null);
//     const loaderRef       = useRef(null);
//     const scrollDownRef   = useRef(null);

//     const akiraCam   = useRef({ camera: null, initialZ: null });
//     const gisCam     = useRef({ camera: null, initialZ: null });
//     const akiraModel = useRef(null);
//     const gisModel   = useRef(null);

//     const built      = useRef(false);
//     const readyCount = useRef(0);
//     const [loadedCount, setLoadedCount] = useState(0);

//     // Reset du scroll au refresh
//     useEffect(() => {
//         window.history.scrollRestoration = 'manual';
//         window.scrollTo(0, 0);
//     }, []);

//     const buildTimeline = useCallback(() => {
//         if (built.current) ScrollTrigger.getAll().forEach(st => st.kill());
//         built.current = true;

//         const akiraCamera = akiraCam.current.camera;
//         const gisCamera   = gisCam.current.camera;
//         if (!akiraCamera || !gisCamera) return;

//         const akiraInitialZ = akiraCam.current.initialZ;
//         const gisInitialZ   = gisCam.current.initialZ;
//         const akiraInitialY = akiraCamera.position.y;
//         const gisInitialY   = gisCamera.position.y;

//         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
//         const gisProxy   = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

//         // --- RESET ÉTAT INITIAL (On force GIS à droite au départ) ---
//         gsap.set([akiraHeroRef.current, gisHeroRef.current, sloganRef.current, buttonsRef.current, scrollDownRef.current], { 
//             opacity: 1, x: 0, y: 0, visibility: 'visible' 
//         });
//         gsap.set([overlayAkiraRef.current, overlayGisRef.current], { opacity: 0, pointerEvents: 'none' });

//         const tl = gsap.timeline({
//             scrollTrigger: {
//                 trigger: heroRef.current,
//                 start: 'top top',
//                 end: '+=1000%', 
//                 scrub: 1,
//                 pin: true,
//                 invalidateOnRefresh: true
//             }
//         });

//         // 1. DÉPART : UI s'efface + GIS sort à droite
//         tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 0, y: -50, duration: 1 }, 0)
//           .to(gisHeroRef.current, { x: 1200, opacity: 0, duration: 1.5 }, 0);

//         // 2. ZOOM AKIRA
//         tl.to(akiraProxy, {
//             z: akiraInitialZ * 0.45,
//             y: akiraInitialY + 15,
//             rotY: Math.PI / 2,
//             duration: 2,
//             onUpdate: () => {
//                 akiraCamera.position.z = akiraProxy.z;
//                 akiraCamera.position.y = akiraProxy.y;
//                 akiraCamera.lookAt(0, akiraInitialY + 10, 0); 
//                 if (akiraModel.current) akiraModel.current.rotation.y = akiraProxy.rotY;
//             }
//         }, 0.5);

//         // 3. TEXTES AKIRA
//         tl.to(overlayAkiraRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 2);
//         tl.to(overlayAkiraRef.current.querySelectorAll('.overlay-title, .overlay-bar, .overlay-content'), {
//             opacity: 1, y: 0, stagger: 0.2, duration: 1 
//         }, 2.1);

//         // 4. SORTIE AKIRA
//         tl.to(overlayAkiraRef.current, { opacity: 0, pointerEvents: 'none', duration: 1 }, 4.5)
//           .to(akiraHeroRef.current, { x: -1200, opacity: 0, duration: 2 }, 4.5);

//         // 5. GIS REVIENT ET ZOOM
//         tl.fromTo(gisHeroRef.current, { x: 1200, opacity: 0 }, { x: 0, opacity: 1, duration: 2 }, 6.5);
//         tl.to(gisProxy, {
//             z: gisInitialZ * 0.25,
//             y: gisInitialY + 1.5,
//             rotY: -Math.PI / 4,
//             duration: 2,
//             onUpdate: () => {
//                 gisCamera.position.z = gisProxy.z;
//                 gisCamera.position.y = gisProxy.y;
//                 gisCamera.lookAt(0, gisInitialY + 1, 0);
//                 if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
//             }
//         }, 7);

//         // 6. TEXTES GIS
//         tl.to(overlayGisRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 8.5);
//         tl.to(overlayGisRef.current.querySelectorAll('.overlay-title, .overlay-bar, .overlay-content'), {
//             opacity: 1, y: 0, stagger: 0.2, duration: 1 
//         }, 8.6);

//         // Sortie du loader
//         if (loaderRef.current) {
//             gsap.to(loaderRef.current, { 
//                 opacity: 0, duration: 0.8, 
//                 onComplete: () => { if(loaderRef.current) loaderRef.current.style.display = 'none'; }
//             });
//         }
//     }, []);

//     useEffect(() => {
//         if (loadedCount >= 2) setTimeout(buildTimeline, 300);
//     }, [loadedCount, buildTimeline]);

//     const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
//         akiraCam.current = { camera, initialZ };
//         akiraModel.current = model;
//         readyCount.current += 1;
//         setLoadedCount(readyCount.current);
//     }, []);

//     const handleGisReady = useCallback(({ camera, initialZ, model }) => {
//         gisCam.current = { camera, initialZ };
//         gisModel.current = model;
//         readyCount.current += 1;
//         setLoadedCount(readyCount.current);
//     }, []);

//     const loadPercent = Math.min(loadedCount * 50, 100);

//     return (
//         <>
//             {/* LOADER DESIGN D'ORIGINE RESTAURÉ */}
//             <div ref={loaderRef} style={{
//                 position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0a',
//                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem'
//             }}>
//                 <p style={{ fontFamily: 'var(--ff-family-main)', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
//                     Chargement de l'expérience
//                 </p>
//                 <div style={{ width: 'clamp(200px, 40vw, 400px)', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
//                     <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'linear-gradient(to right, #00d4ff, #ff00ff)', transition: 'width 0.4s ease' }} />
//                 </div>
//                 <p style={{ color: '#fff', opacity: 0.4 }}>{loadPercent}%</p>
//             </div>

//             <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="Akira" content="Découvrez Neo-Tokyo et les mutations de ses héros." />
//             <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="Ghost in the Shell" content="Plongez dans la conscience augmentée et l'identité." />

//             <div className="hero-section" ref={heroRef}>
                
//                 {/* LES PERSONNAGES (Background) */}
//                 <div className="characters-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
//                     <div className="akira" ref={akiraHeroRef} style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%' }}>
//                         <Akira3D onReady={handleAkiraReady} />
//                     </div>
//                     <div className="gis" ref={gisHeroRef} style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%' }}>
//                         <GIS3D onReady={handleGisReady} />
//                     </div>
//                 </div>

//                 {/* L'INTERFACE (Foreground - gère le centrage propre) */}
//                 <div className="ui-overlay" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    
//                     <div className="container-hero" style={{ textAlign: 'center' }}>
//                         <div className="container-slogan" ref={sloganRef}>
//                             <div className="triangle"></div>
//                             <h1 className="slogan">{title1}</h1>
//                             <h1 className="slogan">{title2}</h1>
//                             <div className="under-slogan"><h2>{subtitle}</h2></div>
//                         </div>
//                     </div>

//                     {/* Scroll Down en bas de l'écran */}
//                     <div ref={scrollDownRef} className="scroll-down" style={{ position: 'absolute', bottom: '15%' }}>
//                         <h3>Scroll pour en savoir plus</h3>
//                         <div className="arrow"><span className="arrow-down"></span></div>
//                     </div>

//                     {/* Boutons tout en bas */}
//                     <div className="buttons-hero" ref={buttonsRef} style={{ position: 'absolute', bottom: '5%' }}>
//                         <a href="#">teaser</a>
//                         <a href="#">tickets</a>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }


// // import { useRef, useEffect, useCallback, useState } from 'react';
// // import gsap from 'gsap';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // import Akira3D from './Akira3D';
// // import GIS3D from './GIS3D';
// // import ImmersionOverlay from './ImmersionOverlay';

// // gsap.registerPlugin(ScrollTrigger);

// // export default function Hero({ title1, title2, subtitle }) {
// //     const heroRef = useRef(null);
// //     const sloganRef = useRef(null);
// //     const akiraHeroRef = useRef(null);
// //     const gisHeroRef = useRef(null);
// //     const buttonsRef = useRef(null);
// //     const overlayAkiraRef = useRef(null);
// //     const overlayGisRef = useRef(null);
// //     const loaderRef = useRef(null);
// //     const scrollDownRef = useRef(null);

// //     const akiraCam = useRef({ camera: null, initialZ: null });
// //     const gisCam = useRef({ camera: null, initialZ: null });
// //     const akiraModel = useRef(null);
// //     const gisModel = useRef(null);

// //     const [loadedCount, setLoadedCount] = useState(0);

// //     useEffect(() => {
// //         window.history.scrollRestoration = 'manual';
// //         window.scrollTo(0, 0);
// //     }, []);

// //     const buildTimeline = useCallback(() => {
// //         // 1. Nettoyage TOTAL
// //         ScrollTrigger.getAll().forEach(st => st.kill());
        
// //         const akiraCamera = akiraCam.current.camera;
// //         const gisCamera = gisCam.current.camera;

// //         if (!akiraCamera || !gisCamera) return;

// //         // 2. Initialisation des positions
// //         const akiraInitialZ = akiraCam.current.initialZ;
// //         const gisInitialZ = gisCam.current.initialZ;
// //         const akiraInitialY = akiraCamera.position.y;
// //         const gisInitialY = gisCamera.position.y;

// //         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
// //         const gisProxy = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

// //         // 3. Setup de l'état "Zéro"
// //         gsap.set(gisHeroRef.current, { xPercent: 100, opacity: 0 });
// //         gsap.set(akiraHeroRef.current, { xPercent: 0, opacity: 1 });
// //         gsap.set([overlayAkiraRef.current, overlayGisRef.current], { opacity: 0 });

// //         const tl = gsap.timeline({
// //             scrollTrigger: {
// //                 trigger: heroRef.current,
// //                 start: 'top top',
// //                 end: '+=1200%',
// //                 scrub: 1.5, // Scrub un peu plus doux pour éviter les saccades
// //                 pin: true,
// //                 invalidateOnRefresh: true
// //             }
// //         });

// //         // --- SEQUENCE ---

// //         // Phase A : L'UI s'en va
// //         tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { 
// //             opacity: 0, y: -100, duration: 2 
// //         }, 0);

// //         // Phase B : Zoom Akira
// //         tl.to(akiraProxy, {
// //             z: akiraInitialZ * 0.45,
// //             y: akiraInitialY + 12,
// //             rotY: Math.PI / 2,
// //             duration: 4,
// //             onUpdate: () => {
// //                 akiraCamera.position.z = akiraProxy.z;
// //                 akiraCamera.position.y = akiraProxy.y;
// //                 akiraCamera.lookAt(0, akiraInitialY + 8, 0);
// //                 if (akiraModel.current) akiraModel.current.rotation.y = akiraProxy.rotY;
// //             }
// //         }, 1);

// //         // Phase C : Overlay Akira
// //         tl.to(overlayAkiraRef.current, { opacity: 1, duration: 2 }, 3);

// //         // Phase D : Switch Akira (Sort à gauche) -> GIS (Arrive de droite)
// //         tl.to(overlayAkiraRef.current, { opacity: 0, duration: 2 }, 6)
// //           .to(akiraHeroRef.current, { xPercent: -100, opacity: 0, duration: 4 }, 6)
// //           .to(gisHeroRef.current, { xPercent: 0, opacity: 1, duration: 4 }, 6.5);

// //         // Phase E : Zoom GIS
// //         tl.to(gisProxy, {
// //             z: gisInitialZ * 0.3,
// //             y: gisInitialY + 1.5,
// //             rotY: -Math.PI / 4,
// //             duration: 4,
// //             onUpdate: () => {
// //                 gisCamera.position.z = gisProxy.z;
// //                 gisCamera.position.y = gisProxy.y;
// //                 gisCamera.lookAt(0, gisInitialY + 1, 0);
// //                 if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
// //             }
// //         }, 8);

// //         // Phase F : Overlay GIS
// //         tl.to(overlayGisRef.current, { opacity: 1, duration: 2 }, 10);

// //         // Rafraîchissement final
// //         ScrollTrigger.refresh();

// //         if (loaderRef.current) {
// //             gsap.to(loaderRef.current, { opacity: 0, duration: 1, onComplete: () => loaderRef.current.style.display = 'none' });
// //         }
// //     }, []);

// //     useEffect(() => {
// //         if (loadedCount >= 2) {
// //             const timer = setTimeout(buildTimeline, 1000); // On laisse 1sec de marge
// //             return () => clearTimeout(timer);
// //         }
// //     }, [loadedCount, buildTimeline]);

// //     const handleAkiraReady = useCallback((data) => {
// //         akiraCam.current = { camera: data.camera, initialZ: data.initialZ };
// //         akiraModel.current = data.model;
// //         setLoadedCount(prev => prev + 1);
// //     }, []);

// //     const handleGisReady = useCallback((data) => {
// //         gisCam.current = { camera: data.camera, initialZ: data.initialZ };
// //         gisModel.current = data.model;
// //         setLoadedCount(prev => prev + 1);
// //     }, []);

// //     return (
// //         <>
// //             <div ref={loaderRef} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
// //                 <p>SYNCING NEURAL INTERFACE... {Math.min(loadedCount * 50, 100)}%</p>
// //             </div>

// //             <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="Akira" content="..." />
// //             <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="G.I.S" content="..." />

// //             <div className="hero-section" ref={heroRef} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#050505' }}>
                
// //                 {/* PERSONNAGES : Ils font TOUTE la taille de l'écran, l'un sur l'autre */}
// //                 <div className="akira" ref={akiraHeroRef} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
// //                     <Akira3D onReady={handleAkiraReady} />
// //                 </div>

// //                 <div className="gis" ref={gisHeroRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
// //                     <GIS3D onReady={handleGisReady} />
// //                 </div>

// //                 {/* UI : Par-dessus tout */}
// //                 <div className="ui-overlay" style={{ position: 'relative', zIndex: 10, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
// //                     <div className="container-slogan" ref={sloganRef} style={{ textAlign: 'center', pointerEvents: 'auto' }}>
// //                         <h1 className="slogan" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', margin: 0 }}>{title1}</h1>
// //                         <h1 className="slogan" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', margin: 0 }}>{title2}</h1>
// //                         <h2>{subtitle}</h2>
// //                     </div>

// //                     <div ref={scrollDownRef} className="scroll-down" style={{ position: 'absolute', bottom: '10%' }}>
// //                         <span>SCROLL TO BEGIN</span>
// //                     </div>

// //                     <div className="buttons-hero" ref={buttonsRef} style={{ position: 'absolute', bottom: '5%', pointerEvents: 'auto' }}>
// //                         <button>EXPLORE</button>
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // }

// import { useRef, useEffect, useCallback, useState } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Akira3D from './Akira3D';
// import GIS3D from './GIS3D';
// import ImmersionOverlay from './ImmersionOverlay';

// gsap.registerPlugin(ScrollTrigger);

// export default function Hero({ title1, title2, subtitle }) {
//     const heroRef         = useRef(null);
//     const sloganRef       = useRef(null);
//     const akiraHeroRef    = useRef(null);
//     const gisHeroRef      = useRef(null);
//     const buttonsRef      = useRef(null);
//     const overlayAkiraRef = useRef(null);
//     const overlayGisRef   = useRef(null);
//     const loaderRef       = useRef(null);
//     const scrollDownRef   = useRef(null);

//     const akiraCam   = useRef({ camera: null, initialZ: null });
//     const gisCam     = useRef({ camera: null, initialZ: null });
//     const akiraModel = useRef(null);
//     const gisModel   = useRef(null);

//     const built      = useRef(false);
//     const [loadedCount, setLoadedCount] = useState(0);

//     useEffect(() => {
//         window.history.scrollRestoration = 'manual';
//         window.scrollTo(0, 0);
//     }, []);

//     const buildTimeline = useCallback(() => {
//         if (built.current) ScrollTrigger.getAll().forEach(st => st.kill());
//         built.current = true;

//         const akiraCamera = akiraCam.current.camera;
//         const gisCamera   = gisCam.current.camera;
//         if (!akiraCamera || !gisCamera) return;

//         const akiraInitialZ = akiraCam.current.initialZ;
//         const gisInitialZ   = gisCam.current.initialZ;
//         const akiraInitialY = akiraCamera.position.y;
//         const gisInitialY   = gisCamera.position.y;

//         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
//         const gisProxy   = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

//         // --- RESET INITIAL ---
//         // On utilise xPercent pour que ce soit relatif à l'écran et pas des pixels fixes
//         gsap.set(gisHeroRef.current, { xPercent: 100, opacity: 0 });
//         gsap.set(akiraHeroRef.current, { xPercent: 0, opacity: 1 });
//         gsap.set([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 1, y: 0 });
//         gsap.set([overlayAkiraRef.current, overlayGisRef.current], { opacity: 0, pointerEvents: 'none' });

//         const tl = gsap.timeline({
//             scrollTrigger: {
//                 trigger: heroRef.current,
//                 start: 'top top',
//                 end: '+=1000%', 
//                 scrub: 1,
//                 pin: true,
//                 invalidateOnRefresh: true
//             }
//         });

//         // 1. UI s'efface
//         tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 0, y: -50, duration: 1 }, 0);

//         // 2. ZOOM AKIRA
//         tl.to(akiraProxy, {
//             z: akiraInitialZ * 0.45,
//             y: akiraInitialY + 15,
//             rotY: Math.PI / 2,
//             duration: 2,
//             onUpdate: () => {
//                 akiraCamera.position.z = akiraProxy.z;
//                 akiraCamera.position.y = akiraProxy.y;
//                 // On ajuste le lookAt pour ne pas couper les jambes (+8 au lieu de +10)
//                 akiraCamera.lookAt(0, akiraInitialY + 8, 0); 
//                 if (akiraModel.current) akiraModel.current.rotation.y = akiraProxy.rotY;
//             }
//         }, 0.5);

//         // 3. TEXTES AKIRA
//         tl.to(overlayAkiraRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 2);

//         // 4. SORTIE AKIRA / ENTREE GIS (On utilise xPercent: 100 pour sortir proprement du cadre)
//         tl.to(overlayAkiraRef.current, { opacity: 0, pointerEvents: 'none', duration: 1 }, 4.5)
//           .to(akiraHeroRef.current, { xPercent: -100, opacity: 0, duration: 2 }, 4.5)
//           .to(gisHeroRef.current, { xPercent: 0, opacity: 1, duration: 2 }, 5.5);

//         // 5. ZOOM GIS
//         tl.to(gisProxy, {
//             z: gisInitialZ * 0.25,
//             y: gisInitialY + 1.5,
//             rotY: -Math.PI / 4,
//             duration: 2,
//             onUpdate: () => {
//                 gisCamera.position.z = gisProxy.z;
//                 gisCamera.position.y = gisProxy.y;
//                 gisCamera.lookAt(0, gisInitialY + 1, 0);
//                 if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
//             }
//         }, 7);

//         // 6. TEXTES GIS
//         tl.to(overlayGisRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 8.5);

//         // IMPORTANT : Rafraîchir ScrollTrigger APRES la timeline
//         ScrollTrigger.refresh();

//         if (loaderRef.current) {
//             gsap.to(loaderRef.current, { 
//                 opacity: 0, duration: 0.8, 
//                 onComplete: () => { if(loaderRef.current) loaderRef.current.style.display = 'none'; }
//             });
//         }
//     }, []);

//     useEffect(() => {
//         if (loadedCount >= 2) {
//             // Augmenter le délai permet à Three.js de bien calculer sa taille de canvas
//             const t = setTimeout(buildTimeline, 500);
//             return () => clearTimeout(t);
//         }
//     }, [loadedCount, buildTimeline]);

//     const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
//         akiraCam.current = { camera, initialZ };
//         akiraModel.current = model;
//         setLoadedCount(prev => prev + 1);
//     }, []);

//     const handleGisReady = useCallback(({ camera, initialZ, model }) => {
//         gisCam.current = { camera, initialZ };
//         gisModel.current = model;
//         setLoadedCount(prev => prev + 1);
//     }, []);

//     const loadPercent = Math.min(loadedCount * 50, 100);

//     return (
//         <>
//             <div ref={loaderRef} style={{
//                 position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0a',
//                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem'
//             }}>
//                 <p style={{ fontFamily: 'sans-serif', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
//                     Chargement de l'expérience
//                 </p>
//                 <div style={{ width: '300px', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
//                     <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'cyan' }} />
//                 </div>
//             </div>

//             <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="Akira" content="Découvrez Neo-Tokyo." />
//             <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="G.I.S" content="Plongez dans la conscience." />

//             <div className="hero-section" ref={heroRef} style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
                
//                 <div className="characters-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
//                     <div className="akira" ref={akiraHeroRef} style={{ position: 'absolute', inset: 0 }}>
//                         <Akira3D onReady={handleAkiraReady} />
//                     </div>
//                     <div className="gis" ref={gisHeroRef} style={{ position: 'absolute', inset: 0 }}>
//                         <GIS3D onReady={handleGisReady} />
//                     </div>
//                 </div>

//                 <div className="ui-overlay" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
//                     <div className="container-hero" style={{ textAlign: 'center', pointerEvents: 'auto' }}>
//                         <div className="container-slogan" ref={sloganRef}>
//                             <h1 className="slogan">{title1}</h1>
//                             <h1 className="slogan">{title2}</h1>
//                             <div className="under-slogan"><h2>{subtitle}</h2></div>
//                         </div>
//                     </div>

//                     <div ref={scrollDownRef} className="scroll-down" style={{ position: 'absolute', bottom: '15%' }}>
//                         <h3>Scroll pour en savoir plus</h3>
//                     </div>

//                     <div className="buttons-hero" ref={buttonsRef} style={{ position: 'absolute', bottom: '5%', pointerEvents: 'auto' }}>
//                         <a href="#">teaser</a>
//                         <a href="#">tickets</a>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }



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
                end: '+=1000%', 
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true
            }
        });

        // 1. DÉPART : UI s'efface + GIS dégage à droite
        tl.to([sloganRef.current, buttonsRef.current, scrollDownRef.current], { opacity: 0, y: -50, duration: 1 }, 0)
          .to(gisHeroRef.current, { x: 1200, opacity: 0, duration: 1.5 }, 0);

        // 2. ZOOM AKIRA
        tl.to(akiraProxy, {
            z: akiraInitialZ * 0.45,
            y: akiraInitialY + 15,
            rotY: Math.PI / 2,
            duration: 2,
            onUpdate: () => {
                akiraCamera.position.z = akiraProxy.z;
                akiraCamera.position.y = akiraProxy.y;
                akiraCamera.lookAt(0, akiraInitialY + 10, 0); 
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
    }, []);

    const handleGisReady = useCallback(({ camera, initialZ, model }) => {
        gisCam.current = { camera, initialZ };
        gisModel.current = model;
        setLoadedCount(prev => prev + 1);
    }, []);

    return (
        <>
            {/* LOADER */}
            <div ref={loaderRef} style={{
                position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0a',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <p style={{ color: '#fff', opacity: 0.6, letterSpacing: '4px' }}>INITIALIZING NEURAL LINK...</p>
            </div>

            <ImmersionOverlay ref={overlayAkiraRef} side="left" color="cyan" title="Akira" content="Découvrez Neo-Tokyo et les mutations de ses héros." />
            <ImmersionOverlay ref={overlayGisRef} side="right" color="magenta" title="Ghost in the Shell" content="Plongez dans la conscience augmentée et l'identité." />

            <div className="hero-section" ref={heroRef} style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="characters-infos" style={{ position: 'relative', width: '100%', height: '100vh' }}>
                    
                    {/* AKIRA : position absolute pour ne pas pousser l'UI */}
                    <div className="akira" ref={akiraHeroRef} style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%' }}>
                        <Akira3D onReady={handleAkiraReady} />
                    </div>

                    {/* UI CENTRALE */}
                    <div className="container-hero" style={{ position: 'relative', zIndex: 10 }}>
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
                    <div className="gis" ref={gisHeroRef} style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%' }}>
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