// // import { useRef, useEffect, useCallback, useState } from 'react';
// // import gsap from 'gsap';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // import Akira3D from './Akira3D';
// // import GIS3D from './GIS3D';
// // import ImmersionOverlay from './ImmersionOverlay';
// // import Grainient from './Grainient';

// // gsap.registerPlugin(ScrollTrigger);

// // export default function Hero({ title1, title2, subtitle }) {
// //     <Grainient
// //     color1="#ba121b"
// //     color2="#521414"
// //     color3="#075a50"
// //     timeSpeed={0.25}
// //     colorBalance={0.27}
// //     warpStrength={1}
// //     warpFrequency={5}
// //     warpSpeed={2}
// //     warpAmplitude={56}
// //     blendAngle={0}
// //     blendSoftness={0.05}
// //     rotationAmount={500}
// //     noiseScale={2}
// //     grainAmount={0.1}
// //     grainScale={2}
// //     grainAnimated={false}
// //     contrast={1.5}
// //     gamma={1}
// //     saturation={1}
// //     centerX={-0.08}
// //     centerY={0.03}
// //     zoom={0.65}
// //     />

// //     const heroRef         = useRef(null);
// //     const sloganRef       = useRef(null);
// //     const akiraHeroRef    = useRef(null);
// //     const gisHeroRef      = useRef(null);
// //     const buttonsRef      = useRef(null);
// //     const overlayAkiraRef = useRef(null);
// //     const overlayGisRef   = useRef(null);
// //     const loaderRef       = useRef(null);
// //     const scrollDownRef   = useRef(null);

// //     const akiraCam    = useRef({ camera: null, initialZ: null });
// //     const gisCam      = useRef({ camera: null, initialZ: null });
// //     // ✅ built = true après le premier buildTimeline — évite tout double appel
// //     const built       = useRef(false);
// //     // ✅ readyCount en ref — pas de setState pour éviter les re-renders en cascade
// //     const readyCount  = useRef(0);

// //     // Seulement 2 états : 0, 1, 2 — clampé à 2 max
// //     const [loadedCount, setLoadedCount] = useState(0);

// //     const buildTimeline = useCallback(() => {
// //         // Guard — ne build qu'une seule fois
// //         if (built.current) return;
// //         built.current = true;

// //         const hero    = heroRef.current;
// //         const slogan  = sloganRef.current;
// //         const akiraEl = akiraHeroRef.current;
// //         const gisEl   = gisHeroRef.current;
// //         const buttons = buttonsRef.current;
// //         const ovAkira = overlayAkiraRef.current;
// //         const ovGis   = overlayGisRef.current;
// //         const scrollDown = scrollDownRef.current;

// //         if (!hero || !ovAkira || !ovGis) return;

// //         const akiraInitialZ = akiraCam.current.initialZ;
// //         const gisInitialZ   = gisCam.current.initialZ;


// //         const akiraProxy = { 
// //             z: akiraInitialZ, 
// //             y: akiraCam.current.camera?.position.y ?? 10 
// //         };

// //         const gisProxy = { 
// //             z: gisInitialZ, 
// //             y: gisCam.current.camera?.position.y ?? 0 
// //         };

// //         window.scrollTo(0, 0);
// //         if (akiraCam.current.camera) akiraCam.current.camera.position.z = akiraInitialZ;
// //         if (gisCam.current.camera)   gisCam.current.camera.position.z   = gisInitialZ;

// //         // Fade out loader
// //         gsap.to(loaderRef.current, {
// //             opacity: 0,
// //             duration: 2,
// //             ease: 'power3.out',
// //             onComplete: () => {
// //                 if (loaderRef.current) loaderRef.current.style.display = 'none';
// //             },
// //         });

// //         // On s'assure d'initialiser l'état de départ de tous les éléments pour éviter les glitches si l'utilisateur scroll avant le début de la timeline
// //             gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
// //             gsap.set([ovAkira, ovGis], { opacity: 0, pointerEvents: 'none' });
// //             gsap.set(ovAkira.querySelector('.overlay-title'),   { opacity: 0, y: 30 });
// //             gsap.set(ovAkira.querySelector('.overlay-bar'),     { opacity: 0 });
// //             gsap.set(ovAkira.querySelector('.overlay-content'), { opacity: 0, y: 20 });
// //             gsap.set(ovGis.querySelector('.overlay-title'),     { opacity: 0, y: 30 });
// //             gsap.set(ovGis.querySelector('.overlay-bar'),       { opacity: 0 });
// //             gsap.set(ovGis.querySelector('.overlay-content'),   { opacity: 0, y: 20 });

// //         const tl = gsap.timeline({
// //             scrollTrigger: {
// //                 trigger: hero,
// //                 start: 'top top',
// //                 end: '+=600%',
// //                 scrub: 1.2,
// //                 pin: true,
// //                 anticipatePin: 1,
// //                 invalidateOnRefresh: true,
// //             },
// //         });

// //         // ── PHASE 1 : Zoom Akira ─────────────────────────────────────────────
// //         tl.to([slogan, buttons, scrollDown], { 
// //             opacity: 0, 
// //             y: -20, 
// //             duration: 0.08, 
// //             ease: 'power2.in' 
// //         }, 0);
        
// //         tl.to(gisEl, { 
// //             opacity: 0, 
// //             x: 500,
// //             duration: 0.10, 
// //             ease: 'power2.in' 
// //         }, 0);

// //         // tl.fromTo(akiraProxy,
// //         //     { z: akiraInitialZ },
// //         //     { z: 0.5, duration: 0.22, ease: 'power2.inOut',
// //         //       onUpdate() { const c = akiraCam.current.camera; if (c) c.position.z = akiraProxy.z; } },
// //         // 0);

// //         tl.fromTo(akiraProxy,
// //             { z: akiraInitialZ, y: akiraCam.current.camera?.position.y ?? 10 },
// //             { 
// //                 z: 30,
// //                 y: 35,
// //                 duration: 0.22, 
// //                 ease: 'power2.inOut',
// //                 onUpdate() { 
// //                     const c = akiraCam.current.camera; 
// //                     if (c) {
// //                         c.position.z = akiraProxy.z;
// //                         c.position.y = akiraProxy.y;
// //                         c.lookAt(0, 32, 0);
// //                     }
// //                 }
// //             },
// //         0);

                
// //         tl.fromTo(gisProxy,
// //             { z: gisInitialZ },
// //             { z: gisInitialZ, duration: 0.22,
// //               onUpdate() { const c = gisCam.current.camera; if (c) c.position.z = gisInitialZ; } },
// //         0);

// //         tl.to(akiraEl, { opacity: 0, duration: 0.05 }, 0.22);

// //         // ── PHASE 1b : Overlay Akira ─────────────────────────────────────────
// //         tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.25);
// //         tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.30);
// //         tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.35);
// //         tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.40);

// //         // ── PHASE 2 : Retour hero ─────────────────────────────────────────────
// //         tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.07 }, 0.50);

// //         tl.fromTo(akiraProxy,
// //             { z: 0.5 },
// //             { z: akiraInitialZ, duration: 0.08, ease: 'power2.out',
// //               onUpdate() { const c = akiraCam.current.camera; if (c) c.position.z = akiraProxy.z; } },
// //         0.50);

// //         tl.fromTo(gisProxy,
// //             { z: gisInitialZ },
// //             { z: gisInitialZ, duration: 0.15,
// //               onUpdate() { const c = gisCam.current.camera; if (c) c.position.z = gisInitialZ; } },
// //         0.50);

// //         tl.to([akiraEl, gisEl],  { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.55);
// //         tl.to([slogan, buttons], { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.60);

// //         // ── PHASE 3 : Zoom GIS ───────────────────────────────────────────────
// //         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.05, ease: 'power2.in' }, 0.65);
// //         tl.to(akiraEl,           { opacity: 0, duration: 0.05 }, 0.65);

// //         // tl.fromTo(gisProxy,
// //         //     { z: gisInitialZ },
// //         //     { z: 0.5, duration: 0.22, ease: 'power2.inOut',
// //         //       onUpdate() { const c = gisCam.current.camera; if (c) c.position.z = gisProxy.z; } },
// //         // 0.65);

// //         tl.fromTo(gisProxy,
// //             { z: gisInitialZ, y: gisCam.current.camera?.position.y ?? 0 },
// //             { 
// //                 z: 8,
// //                 y: 20,           // à ajuster selon la hauteur de la tête de Motoko
// //                 duration: 0.22, 
// //                 ease: 'power2.inOut',
// //                 onUpdate() { 
// //                     const c = gisCam.current.camera; 
// //                     if (c) {
// //                         c.position.z = gisProxy.z;
// //                         c.position.y = gisProxy.y;
// //                         c.lookAt(0, 25, 0); // à ajuster selon ton modèle GIS
// //                     }
// //                 }
// //             },
// //         0.65);


// //         tl.to(gisEl, { opacity: 0, duration: 0.05 }, 0.87);

// //         // ── PHASE 3b : Overlay GIS ───────────────────────────────────────────
// //         tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.87);
// //         tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.90);
// //         tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.93);
// //         tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.96);

// //         // ── FIN ──────────────────────────────────────────────────────────────
// //         ScrollTrigger.create({
// //             trigger: hero,
// //             start: 'bottom bottom',
// //             onEnter: () => {
// //                 gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
// //                 if (gisCam.current.camera)   gisCam.current.camera.position.z   = gisInitialZ;
// //                 if (akiraCam.current.camera) akiraCam.current.camera.position.z = akiraInitialZ;
// //                 gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
// //             },
// //         });

// //     }, []);

// //     // ✅ buildTimeline appelé dans useEffect quand isLoaded devient true
// //     // — les refs des overlays sont disponibles dans le DOM à ce moment
// //     useEffect(() => {
// //         if (loadedCount >= 2) {
// //             // Petit délai pour laisser React monter les overlays dans le DOM
// //             const t = setTimeout(() => buildTimeline(), 50);
// //             return () => clearTimeout(t);
// //         }
// //     }, [loadedCount, buildTimeline]);

// //     const handleAkiraReady = useCallback(({ camera, initialZ }) => {
// //         if (akiraCam.current.initialZ !== null) return; // déjà enregistré
// //         akiraCam.current = { camera, initialZ };
// //         readyCount.current += 1;
// //         // ✅ clamp à 2 max pour éviter le 200%
// //         setLoadedCount(Math.min(readyCount.current, 2));
// //     }, []);

// //     const handleGisReady = useCallback(({ camera, initialZ }) => {
// //         if (gisCam.current.initialZ !== null) return; // déjà enregistré
// //         gisCam.current = { camera, initialZ };
// //         readyCount.current += 1;
// //         setLoadedCount(Math.min(readyCount.current, 2));
// //     }, []);

// //     useEffect(() => {
// //         return () => {
// //             ScrollTrigger.getAll().forEach(st => st.kill());
// //             built.current = false;
// //             readyCount.current = 0;
// //         };
// //     }, []);

// //     const loadPercent = Math.min(loadedCount * 50, 100);
// //     const isLoaded    = loadedCount >= 2;

// //     return (
// //         <>
// //             {/* ── LOADER ── */}
// //             <div
// //                 ref={loaderRef}
// //                 style={{
// //                     position: 'fixed',
// //                     inset: 0,
// //                     zIndex: 999,
// //                     background: '#0a0a0a',
// //                     display: 'flex',
// //                     flexDirection: 'column',
// //                     alignItems: 'center',
// //                     justifyContent: 'center',
// //                     gap: '2rem',
// //                     pointerEvents: isLoaded ? 'none' : 'all',
// //                 }}
// //             >
// //                 <p style={{
// //                     fontFamily: 'var(--ff-family-main)',
// //                     fontSize: 'clamp(1rem, 2vw, 1.4rem)',
// //                     fontWeight: 300,
// //                     letterSpacing: '6px',
// //                     textTransform: 'uppercase',
// //                     color: '#fff',
// //                     opacity: 0.6,
// //                     margin: 0,
// //                 }}>
// //                     Chargement de l'expérience
// //                 </p>

// //                 <div style={{
// //                     width: 'clamp(200px, 40vw, 400px)',
// //                     height: '2px',
// //                     background: 'rgba(255,255,255,0.1)',
// //                     position: 'relative',
// //                     overflow: 'hidden',
// //                 }}>
// //                     <div style={{
// //                         position: 'absolute',
// //                         top: 0,
// //                         left: 0,
// //                         height: '100%',
// //                         width: `${loadPercent}%`,
// //                         background: 'linear-gradient(to right, #00d4ff, #ff00ff)',
// //                         transition: 'width 0.4s ease',
// //                     }} />
// //                 </div>

// //                 <p style={{
// //                     fontFamily: 'var(--ff-family-main)',
// //                     fontSize: '0.85rem',
// //                     fontWeight: 300,
// //                     letterSpacing: '3px',
// //                     color: '#fff',
// //                     opacity: 0.4,
// //                     margin: 0,
// //                 }}>
// //                     {loadPercent}%
// //                 </p>
// //             </div>

// //             {/* ── OVERLAYS — montés après chargement complet ── */}
// //             <ImmersionOverlay
// //                 ref={overlayAkiraRef}
// //                 side="left"
// //                 color="cyan"
// //                 title="Akira"
// //                 content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
// //             >
// //                 {isLoaded && <Akira3D mode="immersion" />}
// //             </ImmersionOverlay>

// //             <ImmersionOverlay
// //                 ref={overlayGisRef}
// //                 side="right"
// //                 color="magenta"
// //                 title="Ghost in the Shell"
// //                 content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
// //             >
// //                 {isLoaded && <GIS3D mode="immersion" />}
// //             </ImmersionOverlay>

// //             {/* ── HERO ── */}
// //             <div className="hero-section" ref={heroRef}>
// //                 <div className="characters-infos">
// //                     <div className="akira" ref={akiraHeroRef}>
// //                         <Akira3D mode="hero" cameraRef={akiraCam} onReady={handleAkiraReady} />
// //                     </div>

// //                     <div className="container-hero">
// //                         <div className="container-slogan" ref={sloganRef}>
// //                             <div className="triangle"></div>
// //                             <h1 className="slogan">{title1}</h1>
// //                             <h1 className="slogan">{title2}</h1>
// //                             <div className="under-slogan">
// //                                 <h2>{subtitle}</h2>
// //                             </div>
// //                         </div>
// //                         <div ref={scrollDownRef} className="scroll-down">
// //                             <h3>Scroll pour en savoir plus</h3>
// //                             <div className="arrow">
// //                                 <span className="arrow-down"></span>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <div className="gis" ref={gisHeroRef}>
// //                         <GIS3D mode="hero" cameraRef={gisCam} onReady={handleGisReady} />
// //                     </div>
// //                 </div>
                
// //                 <div className="buttons-hero" ref={buttonsRef}>
// //                     <a href="#">teaser</a>
// //                     <a href="#">tickets</a>
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
//     const readyCount = useRef(0);
//     const [loadedCount, setLoadedCount] = useState(0);

//     const buildTimeline = useCallback(() => {
//         if (built.current) return;
//         built.current = true;

//         const hero       = heroRef.current;
//         const slogan     = sloganRef.current;
//         const akiraEl    = akiraHeroRef.current;
//         const gisEl      = gisHeroRef.current;
//         const buttons    = buttonsRef.current;
//         const ovAkira    = overlayAkiraRef.current;
//         const ovGis      = overlayGisRef.current;
//         const scrollDown = scrollDownRef.current;

//         if (!hero || !ovAkira || !ovGis) return;

//         const akiraCamera   = akiraCam.current.camera;
//         const gisCamera     = gisCam.current.camera;
//         const akiraInitialZ = akiraCam.current.initialZ;
//         const gisInitialZ   = gisCam.current.initialZ;
//         const akiraInitialY = akiraCamera?.position.y ?? 10;
//         const gisInitialY   = gisCamera?.position.y ?? 0;
//         const model3DAkira  = akiraModel.current;
//         const model3DGis    = gisModel.current;

//         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
//         const gisProxy   = { z: gisInitialZ,   y: gisInitialY,   rotY: 0 };

//         window.scrollTo(0, 0);
//         if (akiraCamera) { akiraCamera.position.z = akiraInitialZ; akiraCamera.position.y = akiraInitialY; }
//         if (gisCamera)   { gisCamera.position.z   = gisInitialZ;   gisCamera.position.y   = gisInitialY; }
//         if (model3DAkira) model3DAkira.rotation.y = 0;
//         if (model3DGis)   model3DGis.rotation.y   = 0;

//         // Fade out loader
//         gsap.to(loaderRef.current, {
//             opacity: 0, duration: 2, ease: 'power3.out',
//             onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = 'none'; },
//         });

//         // État initial

//         gsap.set(gisEl, { opacity: 1, x: 0, clearProps: 'all' });
//         gsap.set(akiraEl, { opacity: 1, x: 0, clearProps: 'all' });
//         gsap.set([slogan, buttons, scrollDown], { opacity: 1, y: 0, clearProps: 'transform' });
//         gsap.set([ovAkira, ovGis], { opacity: 0, pointerEvents: 'none' });
//         gsap.set(ovAkira.querySelector('.overlay-title'),   { opacity: 0, y: 30 });
//         gsap.set(ovAkira.querySelector('.overlay-bar'),     { opacity: 0 });
//         gsap.set(ovAkira.querySelector('.overlay-content'), { opacity: 0, y: 20 });
//         gsap.set(ovGis.querySelector('.overlay-title'),     { opacity: 0, y: 30 });
//         gsap.set(ovGis.querySelector('.overlay-bar'),       { opacity: 0 });
//         gsap.set(ovGis.querySelector('.overlay-content'),   { opacity: 0, y: 20 });

//         const tl = gsap.timeline({
//             scrollTrigger: {
//                 trigger: hero,
//                 start: 'top top',
//                 end: '+=600%',
//                 scrub: 1.2,
//                 pin: true,
//                 anticipatePin: 1,
//                 invalidateOnRefresh: true,
//             },
//         });

//             // PHASE 1 : Contenu disparaît + GIS glisse à droite (ton animation)
//             tl.to([slogan, buttons, scrollDown], {
//                 opacity: 0, y: -20, duration: 0.08, ease: 'power2.in'
//             }, 0.08);

//             // tl.to(gisEl, {
//             //     opacity: 0, x: 500, duration: 0.10, ease: 'power2.in'
//             // }, 0.2);

//             tl.fromTo(gisEl,
//                 { opacity: 1, x: 0 },
//                 { opacity: 0, x: 600, duration: 0.15, ease: 'power2.out' },
//             0.08);

//             // PHASE 1b : Zoom + rotation Akira 90°
//             tl.fromTo(akiraProxy,
//                 { z: akiraInitialZ, y: akiraInitialY, rotY: 0 },
//                 {
//                     z: 5,          // très proche (au lieu de 58 * 0.15 = 8.7)
//                     y: 800,         // monte vers la tête
//                     rotY: Math.PI / 2,
//                     duration: 0.22,
//                     ease: 'power2.inOut',
//                     onUpdate() {
//                         if (akiraCamera) {
//                             akiraCamera.position.z = akiraProxy.z;
//                             akiraCamera.position.y = akiraProxy.y;
//                             akiraCamera.lookAt(0, 25, 0); // vise la tête

//                             console.log('camera pos:', akiraCamera.position.z); // ← ici


//                         }
//                         if (model3DAkira) model3DAkira.rotation.y = akiraProxy.rotY;
//                     }
//                 },
//             0.08);

//         // ── PHASE 2 : Overlay Akira (texte) ──────────────────────────────────
//         tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.33);
//         tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.36);
//         tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.41);
//         tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.44);

//         // ── PHASE 3 : Overlay Akira disparaît, Akira sort par la gauche ──────
//         tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.07 }, 0.52);

//         // Akira dézoom + rotation retour + sort par la gauche
//         tl.fromTo(akiraProxy,
//             { z: akiraInitialZ * 0.15, y: akiraInitialY + 20, rotY: Math.PI / 2 },
//             {
//                 z: akiraInitialZ,
//                 y: akiraInitialY,
//                 rotY: 0,
//                 duration: 0.10,
//                 ease: 'power2.in',
//                 onUpdate() {
//                     if (akiraCamera) {
//                         akiraCamera.position.z = akiraProxy.z;
//                         akiraCamera.position.y = akiraProxy.y;
//                         akiraCamera.lookAt(0, akiraProxy.y - 5, 0);
//                     }
//                     if (model3DAkira) model3DAkira.rotation.y = akiraProxy.rotY;
//                 }
//             },
//         0.52);

//         tl.to(akiraEl, { opacity: 0, x: -500, duration: 0.10, ease: 'power2.in' }, 0.52);

//         // ── PHASE 4 : GIS arrive par la droite, se déplace vers la gauche ────
//         // GIS entre depuis la droite hors écran et glisse vers sa position finale
//         tl.fromTo(gisEl,
//             { opacity: 0, x: 600 },
//             { opacity: 1, x: 0, duration: 0.15, ease: 'power2.out' },
//         0.55);

//         // // ── PHASE 5 : Zoom + rotation GIS 45° profil vers la gauche ──────────
//         // tl.fromTo(gisProxy,
//         //     { z: gisInitialZ, y: gisInitialY, rotY: 0 },
//         //     {
//         //         z: gisInitialZ * 0.15,
//         //         y: gisInitialY + 0.8,
//         //         rotY: -Math.PI / 4,
//         //         duration: 0.22,
//         //         ease: 'power2.inOut',
//         //         onUpdate() {
//         //             if (gisCamera) {
//         //                 gisCamera.position.z = gisProxy.z;
//         //                 gisCamera.position.y = gisProxy.y;
//         //                 gisCamera.lookAt(0, gisProxy.y - 0.3, 0);
//         //             }
//         //             if (model3DGis) model3DGis.rotation.y = gisProxy.rotY;
//         //         }
//         //     },
//         // 0.55);

//         // ── PHASE 5 : Zoom + rotation GIS 45° profil vers la gauche ──────────
//         tl.fromTo(gisProxy,
//             { z: gisInitialZ, y: gisInitialY, rotY: 0 },
//             {
//                 z: gisInitialZ * 0.5,  // zoom doux — 50% au lieu de 15%
//                 y: gisInitialY + 0.6,  // monte légèrement vers la tête (modèle = 1.78u)
//                 rotY: Math.PI / 2,     // 90° profil
//                 duration: 0.22,
//                 ease: 'power2.inOut',
//                 onUpdate() {
//                     if (gisCamera) {
//                         gisCamera.position.z = gisProxy.z;
//                         gisCamera.position.y = gisProxy.y;
//                         gisCamera.lookAt(0, gisProxy.y - 0.2, 0);
//                     }
//                     if (model3DGis) model3DGis.rotation.y = gisProxy.rotY;
//                 }
//             },
//         0.65);


//         tl.to(gisEl, { opacity: 0, duration: 0.05 }, 0.96);

//         // ── PHASE 6 : Overlay GIS (texte) ────────────────────────────────────
//         tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.87);
//         tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.90);
//         tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.93);
//         tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.96);

//         // ── FIN ──────────────────────────────────────────────────────────────
//         ScrollTrigger.create({
//             trigger: hero,
//             start: 'bottom bottom',
//             onEnter: () => {
//                 gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
//                 if (gisCamera)   { gisCamera.position.z = gisInitialZ; gisCamera.position.y = gisInitialY; }
//                 if (akiraCamera) { akiraCamera.position.z = akiraInitialZ; akiraCamera.position.y = akiraInitialY; }
//                 if (model3DAkira) model3DAkira.rotation.y = 0;
//                 if (model3DGis)   model3DGis.rotation.y   = 0;
//                 gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0, x: 0 });
//             },
//         });

//     }, []);

//     useEffect(() => {
//         if (loadedCount >= 2) {
//             const t = setTimeout(() => buildTimeline(), 50);
//             return () => clearTimeout(t);
//         }
//     }, [loadedCount, buildTimeline]);

//     const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
//         console.log('handleAkiraReady:', { camera, initialZ, model }); // ← ajoute ça

//         if (akiraCam.current.initialZ !== null) return;
//         akiraCam.current = { camera, initialZ };
//         if (model) akiraModel.current = model;
//         readyCount.current += 1;
//         setLoadedCount(Math.min(readyCount.current, 2));
//     }, []);

//     const handleGisReady = useCallback(({ camera, initialZ, model }) => {
//         console.log('handleGisReady:', { camera, initialZ, model }); // ← ajoute ça

//         if (gisCam.current.initialZ !== null) return;
//         gisCam.current = { camera, initialZ };
//         if (model) gisModel.current = model;
//         readyCount.current += 1;
//         setLoadedCount(Math.min(readyCount.current, 2));
//     }, []);

//     useEffect(() => {
//         return () => {
//             ScrollTrigger.getAll().forEach(st => st.kill());
//             built.current = false;
//             readyCount.current = 0;
//         };
//     }, []);

//     const loadPercent = Math.min(loadedCount * 50, 100);
//     const isLoaded    = loadedCount >= 2;

//     return (
//         <>
//             {/* ── LOADER ── */}
//             <div ref={loaderRef} style={{
//                 position: 'fixed', inset: 0, zIndex: 999,
//                 background: '#0a0a0a', display: 'flex',
//                 flexDirection: 'column', alignItems: 'center',
//                 justifyContent: 'center', gap: '2rem',
//                 pointerEvents: isLoaded ? 'none' : 'all',
//             }}>
//                 <p style={{
//                     fontFamily: 'var(--ff-family-main)',
//                     fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 300,
//                     letterSpacing: '6px', textTransform: 'uppercase',
//                     color: '#fff', opacity: 0.6, margin: 0,
//                 }}>
//                     Chargement de l'expérience
//                 </p>
//                 <div style={{
//                     width: 'clamp(200px, 40vw, 400px)', height: '2px',
//                     background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden',
//                 }}>
//                     <div style={{
//                         position: 'absolute', top: 0, left: 0, height: '100%',
//                         width: `${loadPercent}%`,
//                         background: 'linear-gradient(to right, #00d4ff, #ff00ff)',
//                         transition: 'width 0.4s ease',
//                     }} />
//                 </div>
//                 <p style={{
//                     fontFamily: 'var(--ff-family-main)', fontSize: '0.85rem',
//                     fontWeight: 300, letterSpacing: '3px',
//                     color: '#fff', opacity: 0.4, margin: 0,
//                 }}>
//                     {loadPercent}%
//                 </p>
//             </div>

//             {/* ── OVERLAYS — texte uniquement, pas de 3D dedans ── */}
//             <ImmersionOverlay
//                 ref={overlayAkiraRef}
//                 side="left" color="cyan" title="Akira"
//                 content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
//             />

//             <ImmersionOverlay
//                 ref={overlayGisRef}
//                 side="right" color="magenta" title="Ghost in the Shell"
//                 content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
//             />

//             {/* ── HERO ── */}
//             <div className="hero-section" ref={heroRef}>
//                 <div className="characters-infos">
//                     <div className="akira" ref={akiraHeroRef}>
//                         <Akira3D mode="hero" onReady={handleAkiraReady} />
//                     </div>

//                     <div className="container-hero">
//                         <div className="container-slogan" ref={sloganRef}>
//                             <div className="triangle"></div>
//                             <h1 className="slogan">{title1}</h1>
//                             <h1 className="slogan">{title2}</h1>
//                             <div className="under-slogan">
//                                 <h2>{subtitle}</h2>
//                             </div>
//                         </div>
//                         <div ref={scrollDownRef} className="scroll-down">
//                             <h3>Scroll pour en savoir plus</h3>
//                             <div className="arrow">
//                                 <span className="arrow-down"></span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="gis" ref={gisHeroRef}>
//                         <GIS3D mode="hero" onReady={handleGisReady} />
//                     </div>
//                 </div>

//                 <div className="buttons-hero" ref={buttonsRef}>
//                     <a href="#">teaser</a>
//                     <a href="#">tickets</a>
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
        built.current      = false;
        readyCount.current = 0;
        akiraCam.current   = { camera: null, initialZ: null };
        gisCam.current     = { camera: null, initialZ: null };
        akiraModel.current = null;
        gisModel.current   = null;
    }, []);

    const buildTimeline = useCallback(() => {
        if (built.current) return;
        built.current = true;

        const hero       = heroRef.current;
        const slogan     = sloganRef.current;
        const akiraEl    = akiraHeroRef.current;
        const gisEl      = gisHeroRef.current;
        const buttons    = buttonsRef.current;
        const ovAkira    = overlayAkiraRef.current;
        const ovGis      = overlayGisRef.current;
        const scrollDown = scrollDownRef.current;

        if (!hero || !ovAkira || !ovGis) return;

        const akiraCamera   = akiraCam.current.camera;
        const gisCamera     = gisCam.current.camera;
        const akiraInitialZ = akiraCam.current.initialZ;
        const gisInitialZ   = gisCam.current.initialZ;
        const akiraInitialY = akiraCamera?.position.y ?? 10;
        const gisInitialY   = gisCamera?.position.y ?? 0;
        const model3DAkira  = akiraModel.current;
        const model3DGis    = gisModel.current;

        const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
        const gisProxy   = { z: gisInitialZ,   y: gisInitialY,   rotY: 0 };

        window.scrollTo(0, 0);

        // Réinitialise tout proprement
        if (akiraCamera) { akiraCamera.position.z = akiraInitialZ; akiraCamera.position.y = akiraInitialY; akiraCamera.lookAt(0, 0, 0); }
        if (gisCamera)   { gisCamera.position.z   = gisInitialZ;   gisCamera.position.y   = gisInitialY;   gisCamera.lookAt(0, 0, 0); }
        if (model3DAkira) model3DAkira.rotation.y = 0;
        if (model3DGis)   model3DGis.rotation.y   = 0;

        // Fade out loader
        gsap.to(loaderRef.current, {
            opacity: 0, duration: 2, ease: 'power3.out',
            onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = 'none'; },
        });

        // État initial de tous les éléments
        gsap.set([slogan, buttons, scrollDown], { opacity: 1, y: 0 });
        gsap.set(akiraEl, { opacity: 1, x: 0 });
        gsap.set(gisEl,   { opacity: 1, x: 0 });
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
                // scrub: 1.2,
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        // ── PHASE 1 : Contenu + GIS disparaissent ───────────────────────────
        tl.to([slogan, buttons, scrollDown], {
            opacity: 0, y: -20, duration: 0.08, ease: 'power2.in'
        }, 0.05);

        tl.fromTo(gisEl,
            { opacity: 1, x: 0 },
            { opacity: 0, x: 600, duration: 0.12, ease: 'power2.in' },
        0.05);

        // ── PHASE 1b : Zoom + rotation Akira 90° ────────────────────────────
        tl.fromTo(akiraProxy,
            { z: akiraInitialZ, y: akiraInitialY, rotY: 0 },
            {
                z: 5,
                y: akiraInitialY + 20,
                rotY: Math.PI / 2,
                duration: 0.20,
                ease: 'power2.inOut',
                onUpdate() {
                    if (akiraCamera) {
                        akiraCamera.position.z = akiraProxy.z;
                        akiraCamera.position.y = akiraProxy.y;
                        akiraCamera.lookAt(0, akiraProxy.y - 5, 0);
                    }
                    if (model3DAkira) model3DAkira.rotation.y = akiraProxy.rotY;
                }
            },
        0.10);

        tl.to(akiraEl, { opacity: 0, duration: 0.04 }, 0.30);

        // ── PHASE 2 : Overlay Akira ──────────────────────────────────────────
        tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.07 }, 0.33);
        tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.06, ease: 'power3.out' }, 0.36);
        tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.04 }, 0.40);
        tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.06, ease: 'power3.out' }, 0.43);

        // ── PHASE 3 : Overlay Akira disparaît, Akira sort à gauche ──────────
        tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.06 }, 0.52);

        tl.fromTo(akiraProxy,
            { z: 5, y: akiraInitialY + 20, rotY: Math.PI / 2 },
            {
                z: akiraInitialZ,
                y: akiraInitialY,
                rotY: 0,
                duration: 0.08,
                ease: 'power2.in',
                onUpdate() {
                    if (akiraCamera) {
                        akiraCamera.position.z = akiraProxy.z;
                        akiraCamera.position.y = akiraProxy.y;
                        akiraCamera.lookAt(0, akiraProxy.y - 5, 0);
                    }
                    if (model3DAkira) model3DAkira.rotation.y = akiraProxy.rotY;
                }
            },
        0.52);

        tl.to(akiraEl, { opacity: 0, x: -600, duration: 0.10, ease: 'power2.in' }, 0.52);

        // ── PHASE 4 : GIS revient depuis la droite ───────────────────────────
        tl.fromTo(gisEl,
            { opacity: 0, x: 600 },
            { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' },
        0.60);

        // ── PHASE 5 : Zoom + rotation GIS 90° ───────────────────────────────
        // Démarre en même temps que GIS arrive (0.60)
        // gisInitialZ = 2.59, on zoom à 50% = 1.3 — pas trop proche
        tl.fromTo(gisProxy,
            { z: gisInitialZ, y: gisInitialY, rotY: 0 },
            {
                z: gisInitialZ * 0.5,
                y: gisInitialY + 0.6,
                rotY: Math.PI / 2,
                duration: 0.20,
                ease: 'power2.inOut',
                onUpdate() {
                    if (gisCamera) {
                        gisCamera.position.z = gisProxy.z;
                        gisCamera.position.y = gisProxy.y;
                        gisCamera.lookAt(0, gisProxy.y - 0.2, 0);
                    }
                    if (model3DGis) model3DGis.rotation.y = gisProxy.rotY;
                }
            },
        0.65);

        tl.to(gisEl, { opacity: 0, duration: 0.04 }, 0.87);

        // ── PHASE 6 : Overlay GIS ────────────────────────────────────────────
        tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.07 }, 0.87);
        tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.06, ease: 'power3.out' }, 0.90);
        tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.04 }, 0.93);
        tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.06, ease: 'power3.out' }, 0.96);

        // ── FIN ──────────────────────────────────────────────────────────────
        ScrollTrigger.create({
            trigger: hero,
            start: 'bottom bottom',
            onEnter: () => {
                gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
                if (gisCamera)   { gisCamera.position.z = gisInitialZ;   gisCamera.position.y = gisInitialY;   gisCamera.lookAt(0, 0, 0); }
                if (akiraCamera) { akiraCamera.position.z = akiraInitialZ; akiraCamera.position.y = akiraInitialY; akiraCamera.lookAt(0, 0, 0); }
                if (model3DAkira) model3DAkira.rotation.y = 0;
                if (model3DGis)   model3DGis.rotation.y   = 0;
                gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0, x: 0 });
            },
        });

    }, []);

    useEffect(() => {
        if (loadedCount >= 2) {
            const t = setTimeout(() => buildTimeline(), 50);
            return () => clearTimeout(t);
        }
    }, [loadedCount, buildTimeline]);

    const handleAkiraReady = useCallback(({ camera, initialZ, model }) => {
        if (akiraCam.current.initialZ !== null) return;
        akiraCam.current = { camera, initialZ };
        if (model) akiraModel.current = model;
        readyCount.current += 1;
        setLoadedCount(Math.min(readyCount.current, 2));
    }, []);

    const handleGisReady = useCallback(({ camera, initialZ, model }) => {
        if (gisCam.current.initialZ !== null) return;
        gisCam.current = { camera, initialZ };
        if (model) gisModel.current = model;
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
            <div ref={loaderRef} style={{
                position: 'fixed', inset: 0, zIndex: 999,
                background: '#0a0a0a', display: 'flex',
                flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '2rem',
                pointerEvents: isLoaded ? 'none' : 'all',
            }}>
                <p style={{
                    fontFamily: 'var(--ff-family-main)',
                    fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 300,
                    letterSpacing: '6px', textTransform: 'uppercase',
                    color: '#fff', opacity: 0.6, margin: 0,
                }}>
                    Chargement de l'expérience
                </p>
                <div style={{
                    width: 'clamp(200px, 40vw, 400px)', height: '2px',
                    background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        width: `${loadPercent}%`,
                        background: 'linear-gradient(to right, #00d4ff, #ff00ff)',
                        transition: 'width 0.4s ease',
                    }} />
                </div>
                <p style={{
                    fontFamily: 'var(--ff-family-main)', fontSize: '0.85rem',
                    fontWeight: 300, letterSpacing: '3px',
                    color: '#fff', opacity: 0.4, margin: 0,
                }}>
                    {loadPercent}%
                </p>
            </div>

            <ImmersionOverlay
                ref={overlayAkiraRef}
                side="left" color="cyan" title="Akira"
                content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
            />

            <ImmersionOverlay
                ref={overlayGisRef}
                side="right" color="magenta" title="Ghost in the Shell"
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
