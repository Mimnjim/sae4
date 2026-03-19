// // // // import { useRef, useEffect, useCallback } from 'react';
// // // // import gsap from 'gsap';
// // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // // // import Akira3D from './Akira3D';
// // // // import GIS3D from './GIS3D';
// // // // import ImmersionOverlay from './ImmersionOverlay';

// // // // gsap.registerPlugin(ScrollTrigger);

// // // // const Hero = ({ title1, title2, subtitle }) => {
// // // //     // DOM refs
// // // //     const heroRef         = useRef(null);
// // // //     const sloganRef       = useRef(null);
// // // //     const akiraHeroRef    = useRef(null);
// // // //     const gisHeroRef      = useRef(null);
// // // //     const buttonsRef      = useRef(null);
// // // //     const overlayAkiraRef = useRef(null);
// // // //     const overlayGisRef   = useRef(null);

// // // //     // Caméras Three.js — remplies par onReady
// // // //     const akiraCam = useRef({ camera: null, initialZ: null });
// // // //     const gisCam   = useRef({ camera: null, initialZ: null });

// // // //     // Indique si les deux modèles sont prêts
// // // //     const readyCount = useRef(0);

// // // //     const buildScrollTriggers = useCallback(() => {
// // // //         const hero    = heroRef.current;
// // // //         const slogan  = sloganRef.current;
// // // //         const akiraEl = akiraHeroRef.current;
// // // //         const gisEl   = gisHeroRef.current;
// // // //         const buttons = buttonsRef.current;
// // // //         const ovAkira = overlayAkiraRef.current;
// // // //         const ovGis   = overlayGisRef.current;

// // // //         if (!hero || !ovAkira || !ovGis) return;

// // // //         // ── Proxy objets pour animer camera.position.z via GSAP ──
// // // //         // GSAP ne peut pas animer directement une propriété Three.js,
// // // //         // on anime un objet plain JS et on sync onUpdate.
// // // //         const akiraProxy = { z: akiraCam.current.initialZ };
// // // //         const gisProxy   = { z: gisCam.current.initialZ };

// // // //         // ─────────────────────────────────────────────────────────────
// // // //         // TIMELINE 1 — Hero pinné
// // // //         //
// // // //         // Durée totale = 200vh de scroll pour avoir le temps de tout voir
// // // //         //
// // // //         //  0%→20%  : fade out slogan + boutons + GIS
// // // //         //  0%→45%  : zoom caméra Akira (initialZ → 0.5)
// // // //         //  45%→55% : fade out container Akira hero
// // // //         //  55%→75% : fade in overlay Akira
// // // //         //  75%→100%: texte overlay Akira slide in
// // // //         // ─────────────────────────────────────────────────────────────
// // // //         const tl1 = gsap.timeline({
// // // //             scrollTrigger: {
// // // //                 trigger: hero,
// // // //                 start: 'top top',
// // // //                 end: '+=100%',      // 2x hauteur écran = scroll long et fluide
// // // //                 scrub: 1.5,         // légère inertie pour fluidité
// // // //                 pin: true,
// // // //                 anticipatePin: 1,
// // // //             },
// // // //         });

// // // //         // Fade out slogan, boutons, GIS hero | Pour faire disparaître le GIS et le slogan / les boutons avant le zoom Akira
// // // //         tl1.to([slogan, buttons], { opacity: 0, y: -24, duration: 0.2, ease: 'power2.in' }, 0);
// // // //         tl1.to(gisEl,             { opacity: 0, duration: 0.15, ease: 'power2.in' }, 0);

// // // //         // Zoom caméra Akira hero — de initialZ à 0.5
// // // //         tl1.to(akiraProxy, {
// // // //             z: 0.5,
// // // //             duration: 0.30,
// // // //             ease: 'power2.inOut',
// // // //             onUpdate() {
// // // //                 const cam = akiraCam.current.camera;
// // // //                 if (cam) { cam.position.z = akiraProxy.z; cam.updateProjectionMatrix(); }
// // // //             },
// // // //         }, 0);

// // // //         // Fade out container Akira hero (après zoom)
// // // //         tl1.to(akiraEl, { opacity: 0, duration: 0.1, ease: 'power2.in' }, 0.30);

// // // //         // Fade in overlay Akira
// // // //         tl1.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.2, ease: 'power2.out' }, 0.35);

// // // //         // Texte overlay Akira
// // // //         tl1.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }, 0.45);
// // // //         tl1.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.15 }, 0.60);
// // // //         tl1.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }, 0.75);

// // // //         // ─────────────────────────────────────────────────────────────
// // // //         // TIMELINE 2 — Transition Akira → GIS
// // // //         //
// // // //         // Déclenchée quand on quitte la section #akira
// // // //         //  0%→30%  : fade out overlay Akira
// // // //         //  10%→55% : fade in container GIS hero + zoom caméra GIS
// // // //         //  55%→65% : fade out container GIS hero
// // // //         //  65%→85% : fade in overlay GIS
// // // //         //  85%→100%: texte overlay GIS
// // // //         // ─────────────────────────────────────────────────────────────
// // // //         const tl2 = gsap.timeline({
// // // //             scrollTrigger: {
// // // //                 trigger: '#akira',
// // // //                 start: 'top 10%',
// // // //                 end: '+=200%',
// // // //                 scrub: 1.5,
// // // //             },
// // // //         });

// // // //         // Fade out overlay Akira
// // // //         tl2.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' }, 0);

// // // //         // Rendre GIS hero visible pour le zoom
// // // //         tl2.to(gisEl, { opacity: 1, duration: 0.3 }, 0.1);

// // // //         // Zoom caméra GIS hero — de initialZ à 0.5
// // // //         tl2.to(gisProxy, {
// // // //             z: 0.5,
// // // //             duration: 0.45,
// // // //             ease: 'power2.inOut',
// // // //             onUpdate() {
// // // //                 const cam = gisCam.current.camera;
// // // //                 if (cam) { cam.position.z = gisProxy.z; cam.updateProjectionMatrix(); }
// // // //             },
// // // //         }, 0.1);

// // // //         // Fade out container GIS hero (après zoom)
// // // //         tl2.to(gisEl, { opacity: 0, duration: 0.1, ease: 'power2.in' }, 0.55);

// // // //         // Fade in overlay GIS
// // // //         tl2.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.2, ease: 'power2.out' }, 0.65);

// // // //         // Texte overlay GIS
// // // //         tl2.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }, 0.75);
// // // //         tl2.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.15 }, 0.82);
// // // //         tl2.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }, 0.87);

// // // //         // ─────────────────────────────────────────────────────────────
// // // //         // TIMELINE 3 — Sortie section #ghost → retour hero (les 2 modèles)
// // // //         //
// // // //         // On remet le hero dans son état initial avec les 2 containers visibles
// // // //         // ─────────────────────────────────────────────────────────────
// // // //         ScrollTrigger.create({
// // // //             trigger: '#ghost',
// // // //             start: 'top 10%',
// // // //             onEnter: () => {
// // // //                 // Fade out overlay GIS
// // // //                 gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.6, ease: 'power2.in' });

// // // //                 // Réinitialise les caméras hero à leur Z d'origine
// // // //                 const camA = akiraCam.current.camera;
// // // //                 const camG = gisCam.current.camera;
// // // //                 if (camA) gsap.to(akiraProxy, {
// // // //                     z: akiraCam.current.initialZ,
// // // //                     duration: 0.8,
// // // //                     ease: 'power2.out',
// // // //                     onUpdate() { camA.position.z = akiraProxy.z; camA.updateProjectionMatrix(); },
// // // //                 });
// // // //                 if (camG) gsap.to(gisProxy, {
// // // //                     z: gisCam.current.initialZ,
// // // //                     duration: 0.8,
// // // //                     ease: 'power2.out',
// // // //                     onUpdate() { camG.position.z = gisProxy.z; camG.updateProjectionMatrix(); },
// // // //                 });

// // // //                 // Remet slogan + les 2 containers visibles
// // // //                 gsap.to([slogan, buttons], { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
// // // //                 gsap.to([akiraEl, gisEl],  { opacity: 1, duration: 0.8, delay: 0.3, ease: 'power2.out' });
// // // //             },
// // // //             onLeaveBack: () => {
// // // //                 // Si on re-scroll vers le haut depuis #ghost : on remet l'overlay GIS
// // // //                 gsap.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.4 });
// // // //                 gsap.to([slogan, buttons, akiraEl, gisEl], { opacity: 0, duration: 0.3 });
// // // //             },
// // // //         });

// // // //     }, []);

// // // //     const handleAkiraReady = useCallback(({ camera, initialZ }) => {
// // // //         akiraCam.current = { camera, initialZ };
// // // //         readyCount.current += 1;
// // // //         if (readyCount.current === 2) buildScrollTriggers();
// // // //     }, [buildScrollTriggers]);

// // // //     const handleGisReady = useCallback(({ camera, initialZ }) => {
// // // //         gisCam.current = { camera, initialZ };
// // // //         readyCount.current += 1;
// // // //         if (readyCount.current === 2) buildScrollTriggers();
// // // //     }, [buildScrollTriggers]);

// // // //     useEffect(() => {
// // // //         return () => ScrollTrigger.getAll().forEach(st => st.kill());
// // // //     }, []);

// // // //     return (
// // // //         <>
// // // //             {/* ── OVERLAY IMMERSION AKIRA ── */}
// // // //             <ImmersionOverlay
// // // //                 ref={overlayAkiraRef}
// // // //                 side="left"
// // // //                 color="cyan"
// // // //                 title="Akira"
// // // //                 content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
// // // //             >
// // // //                 <Akira3D mode="immersion" />
// // // //             </ImmersionOverlay>

// // // //             {/* ── OVERLAY IMMERSION GIS ── */}
// // // //             <ImmersionOverlay
// // // //                 ref={overlayGisRef}
// // // //                 side="right"
// // // //                 color="magenta"
// // // //                 title="Ghost in the Shell"
// // // //                 content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
// // // //             >
// // // //                 <GIS3D mode="immersion" />
// // // //             </ImmersionOverlay>

// // // //             {/* ── HERO ── */}
// // // //             <div className="hero-section" ref={heroRef}>
// // // //                 <div className="characters-infos">
// // // //                     <div className="akira" ref={akiraHeroRef}>
// // // //                         <Akira3D
// // // //                             mode="hero"
// // // //                             cameraRef={akiraCam}
// // // //                             onReady={handleAkiraReady}
// // // //                         />
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
// // // //                         <div className="scroll-down">
// // // //                             <h3>Scroll pour en savoir plus</h3>
// // // //                             <div className="arrow">
// // // //                                 <span className="arrow-down"></span>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>

// // // //                     <div className="gis" ref={gisHeroRef}>
// // // //                         <GIS3D
// // // //                             mode="hero"
// // // //                             cameraRef={gisCam}
// // // //                             onReady={handleGisReady}
// // // //                         />
// // // //                     </div>
// // // //                 </div>

// // // //                 <div className="buttons-hero" ref={buttonsRef}>
// // // //                     <a href="#">teaser</a>
// // // //                     <a href="#">tickets</a>
// // // //                 </div>
// // // //             </div>
// // // //         </>
// // // //     );
// // // // };

// // // // export default Hero;


// // // import { useRef, useEffect, useCallback } from 'react';
// // // import gsap from 'gsap';
// // // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // // import Akira3D from './Akira3D';
// // // import GIS3D from './GIS3D';
// // // import ImmersionOverlay from './ImmersionOverlay';

// // // gsap.registerPlugin(ScrollTrigger);

// // // // ─────────────────────────────────────────────────────────────────────────────
// // // // SÉQUENCE COMPLÈTE (une seule timeline scrubbée, hero pinné) :
// // // //
// // // //  [0.00 → 0.08]  Fade out slogan + boutons
// // // //  [0.00 → 0.20]  Fade out GIS hero
// // // //  [0.00 → 0.22]  ZOOM caméra Akira  (initialZ → 0.5)
// // // //  [0.22 → 0.27]  Fade out container Akira hero
// // // //  [0.27 → 0.35]  Fade in overlay Akira
// // // //  [0.35 → 0.43]  Texte overlay Akira slide in
// // // //  [0.43 → 0.50]  Fade out overlay Akira (texte + container)
// // // //  [0.50 → 0.55]  Reset zoom Akira (0.5 → initialZ) + fade in hero complet
// // // //  [0.55 → 0.60]  Pause visuelle hero (les 2 persos bien visibles)
// // // //  [0.60 → 0.62]  Fade out Akira hero + slogan + boutons
// // // //  [0.60 → 0.82]  ZOOM caméra GIS    (initialZ → 0.5)
// // // //  [0.82 → 0.87]  Fade out container GIS hero
// // // //  [0.87 → 0.92]  Fade in overlay GIS
// // // //  [0.92 → 1.00]  Texte overlay GIS slide in
// // // //  [fin]          Overlay GIS reste visible → l'utilisateur continue à scroller
// // // //                 vers les vraies sections #akira et #ghost
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // const Hero = ({ title1, title2, subtitle }) => {
// // //     const heroRef         = useRef(null);
// // //     const sloganRef       = useRef(null);
// // //     const akiraHeroRef    = useRef(null);
// // //     const gisHeroRef      = useRef(null);
// // //     const buttonsRef      = useRef(null);
// // //     const overlayAkiraRef = useRef(null);
// // //     const overlayGisRef   = useRef(null);

// // //     const akiraCam  = useRef({ camera: null, initialZ: null });
// // //     const gisCam    = useRef({ camera: null, initialZ: null });
// // //     const readyCount = useRef(0);

// // //     const buildTimeline = useCallback(() => {
// // //         const hero    = heroRef.current;
// // //         const slogan  = sloganRef.current;
// // //         const akiraEl = akiraHeroRef.current;
// // //         const gisEl   = gisHeroRef.current;
// // //         const buttons = buttonsRef.current;
// // //         const ovAkira = overlayAkiraRef.current;
// // //         const ovGis   = overlayGisRef.current;

// // //         if (!hero || !ovAkira || !ovGis) return;

// // //         // Proxies pour animer camera.position.z (GSAP ne touche pas Three.js directement)
// // //         const akiraProxy = { z: akiraCam.current.initialZ };
// // //         const gisProxy   = { z: gisCam.current.initialZ };

// // //         // État initial garanti
// // //         gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
// // //         gsap.set([ovAkira, ovGis], { opacity: 0, pointerEvents: 'none' });
// // //         gsap.set(ovAkira.querySelector('.overlay-title'),   { opacity: 0, y: 30 });
// // //         gsap.set(ovAkira.querySelector('.overlay-bar'),     { opacity: 0 });
// // //         gsap.set(ovAkira.querySelector('.overlay-content'), { opacity: 0, y: 20 });
// // //         gsap.set(ovGis.querySelector('.overlay-title'),     { opacity: 0, y: 30 });
// // //         gsap.set(ovGis.querySelector('.overlay-bar'),       { opacity: 0 });
// // //         gsap.set(ovGis.querySelector('.overlay-content'),   { opacity: 0, y: 20 });

// // //         const tl = gsap.timeline({
// // //             scrollTrigger: {
// // //                 trigger: hero,
// // //                 start: 'top top',
// // //                 end: '+=600%',   // 6× la hauteur de l'écran — assez pour tout sans zone morte
// // //                 scrub: 1.2,
// // //                 pin: true,
// // //                 anticipatePin: 1,
// // //             },
// // //         });

// // //         // ── PHASE 1 : Zoom Akira ──────────────────────────────────────────────

// // //         // Fade out slogan + boutons
// // //         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in' }, 0);
// // //         // Fade out GIS
// // //         tl.to(gisEl, { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0);

// // //         // Zoom caméra Akira
// // //         tl.to(akiraProxy, {
// // //             z: 0.5,
// // //             duration: 0.22,
// // //             ease: 'power2.inOut',
// // //             onUpdate() {
// // //                 const cam = akiraCam.current.camera;
// // //                 if (cam) { cam.position.z = akiraProxy.z; }
// // //             },
// // //         }, 0);

// // //         // Fade out container Akira hero
// // //         tl.to(akiraEl, { opacity: 0, duration: 0.05 }, 0.22);

// // //         // Fade in overlay Akira
// // //         tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.27);

// // //         // Texte overlay Akira
// // //         tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.35);
// // //         tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.40);
// // //         tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.43);

// // //         // ── PHASE 2 : Retour hero (les 2 persos) ─────────────────────────────

// // //         // Fade out overlay Akira (tout)
// // //         tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.07 }, 0.50);

// // //         // Reset zoom Akira en parallèle
// // //         tl.to(akiraProxy, {
// // //             z: akiraCam.current.initialZ,
// // //             duration: 0.08,
// // //             ease: 'power2.out',
// // //             onUpdate() {
// // //                 const cam = akiraCam.current.camera;
// // //                 if (cam) { cam.position.z = akiraProxy.z; }
// // //             },
// // //         }, 0.50);

// // //         // Retour des deux persos + slogan + boutons
// // //         tl.to([akiraEl, gisEl],  { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.53);
// // //         tl.to([slogan, buttons], { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.55);

// // //         // Pause visuelle hero (0.55 → 0.62) : rien ne se passe, les 2 persos sont là

// // //         // ── PHASE 3 : Zoom GIS ───────────────────────────────────────────────

// // //         // Fade out Akira hero + slogan + boutons
// // //         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.05, ease: 'power2.in' }, 0.62);
// // //         tl.to(akiraEl,           { opacity: 0, duration: 0.05 }, 0.62);

// // //         // Zoom caméra GIS
// // //         tl.to(gisProxy, {
// // //             z: 0.5,
// // //             duration: 0.22,
// // //             ease: 'power2.inOut',
// // //             onUpdate() {
// // //                 const cam = gisCam.current.camera;
// // //                 if (cam) { cam.position.z = gisProxy.z; }
// // //             },
// // //         }, 0.60);

// // //         // Fade out container GIS hero
// // //         tl.to(gisEl, { opacity: 0, duration: 0.05 }, 0.82);

// // //         // Fade in overlay GIS
// // //         tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.87);

// // //         // Texte overlay GIS
// // //         tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.92);
// // //         tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.95);
// // //         tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.97);

// // //         // ── PHASE 4 : Retour hero final (après GIS) ──────────────────────────

// // //         // Fade out overlay GIS
// // //         // (déclenché par un ScrollTrigger séparé sur la fin du pin,
// // //         //  car après le pin l'utilisateur scroll librement vers les sections)
// // //         // On reset également les caméras et on remet le hero propre
// // //         ScrollTrigger.create({
// // //             trigger: hero,
// // //             start: 'bottom bottom',  // quand le hero défile hors écran
// // //             onEnter: () => {
// // //                 gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });

// // //                 // Reset caméras
// // //                 gsap.to(gisProxy, {
// // //                     z: gisCam.current.initialZ,
// // //                     duration: 0.6,
// // //                     ease: 'power2.out',
// // //                     onUpdate() {
// // //                         const cam = gisCam.current.camera;
// // //                         if (cam) cam.position.z = gisProxy.z;
// // //                     },
// // //                 });
// // //                 gsap.to(akiraProxy, {
// // //                     z: akiraCam.current.initialZ,
// // //                     duration: 0.6,
// // //                     ease: 'power2.out',
// // //                     onUpdate() {
// // //                         const cam = akiraCam.current.camera;
// // //                         if (cam) cam.position.z = akiraProxy.z;
// // //                     },
// // //                 });

// // //                 // Remettre le hero dans son état initial (au cas où on reviendrait)
// // //                 gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
// // //             },
// // //         });

// // //     }, []);

// // //     const handleAkiraReady = useCallback(({ camera, initialZ }) => {
// // //         akiraCam.current = { camera, initialZ };
// // //         readyCount.current += 1;
// // //         if (readyCount.current === 2) buildTimeline();
// // //     }, [buildTimeline]);

// // //     const handleGisReady = useCallback(({ camera, initialZ }) => {
// // //         gisCam.current = { camera, initialZ };
// // //         readyCount.current += 1;
// // //         if (readyCount.current === 2) buildTimeline();
// // //     }, [buildTimeline]);

// // //     useEffect(() => {
// // //         return () => ScrollTrigger.getAll().forEach(st => st.kill());
// // //     }, []);

// // //     return (
// // //         <>
// // //             <ImmersionOverlay
// // //                 ref={overlayAkiraRef}
// // //                 side="left"
// // //                 color="cyan"
// // //                 title="Akira"
// // //                 content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
// // //             >
// // //                 <Akira3D mode="immersion" />
// // //             </ImmersionOverlay>

// // //             <ImmersionOverlay
// // //                 ref={overlayGisRef}
// // //                 side="right"
// // //                 color="magenta"
// // //                 title="Ghost in the Shell"
// // //                 content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
// // //             >
// // //                 <GIS3D mode="immersion" />
// // //             </ImmersionOverlay>

// // //             <div className="hero-section" ref={heroRef}>
// // //                 <div className="characters-infos">
// // //                     <div className="akira" ref={akiraHeroRef}>
// // //                         <Akira3D mode="hero" cameraRef={akiraCam} onReady={handleAkiraReady} />
// // //                     </div>

// // //                     <div className="container-hero">
// // //                         <div className="container-slogan" ref={sloganRef}>
// // //                             <div className="triangle"></div>
// // //                             <h1 className="slogan">{title1}</h1>
// // //                             <h1 className="slogan">{title2}</h1>
// // //                             <div className="under-slogan">
// // //                                 <h2>{subtitle}</h2>
// // //                             </div>
// // //                         </div>
// // //                         <div className="scroll-down">
// // //                             <h3>Scroll pour en savoir plus</h3>
// // //                             <div className="arrow">
// // //                                 <span className="arrow-down"></span>
// // //                             </div>
// // //                         </div>
// // //                     </div>

// // //                     <div className="gis" ref={gisHeroRef}>
// // //                         <GIS3D mode="hero" cameraRef={gisCam} onReady={handleGisReady} />
// // //                     </div>
// // //                 </div>

// // //                 <div className="buttons-hero" ref={buttonsRef}>
// // //                     <a href="#">teaser</a>
// // //                     <a href="#">tickets</a>
// // //                 </div>
// // //             </div>
// // //         </>
// // //     );
// // // };

// // // export default Hero;


// // import { useRef, useEffect, useCallback } from 'react';
// // import gsap from 'gsap';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // import Akira3D from './Akira3D';
// // import GIS3D from './GIS3D';
// // import ImmersionOverlay from './ImmersionOverlay';

// // gsap.registerPlugin(ScrollTrigger);

// // const Hero = ({ title1, title2, subtitle }) => {
// //     const heroRef         = useRef(null);
// //     const sloganRef       = useRef(null);
// //     const akiraHeroRef    = useRef(null);
// //     const gisHeroRef      = useRef(null);
// //     const buttonsRef      = useRef(null);
// //     const overlayAkiraRef = useRef(null);
// //     const overlayGisRef   = useRef(null);

// //     const akiraCam   = useRef({ camera: null, initialZ: null });
// //     const gisCam     = useRef({ camera: null, initialZ: null });
// //     const readyCount = useRef(0);

// //     const buildTimeline = useCallback(() => {
// //         const hero    = heroRef.current;
// //         const slogan  = sloganRef.current;
// //         const akiraEl = akiraHeroRef.current;
// //         const gisEl   = gisHeroRef.current;
// //         const buttons = buttonsRef.current;
// //         const ovAkira = overlayAkiraRef.current;
// //         const ovGis   = overlayGisRef.current;

// //         if (!hero || !ovAkira || !ovGis) return;

// //         // Proxies séparés — chacun repart toujours de initialZ
// //         const akiraProxy = { z: akiraCam.current.initialZ };
// //         const akiraProxyDefault = { z: akiraCam.current.initialZ }; // pour reset rapide en phase 2
// //         // ✅ Le proxy GIS est défini ici mais on le REinitialise explicitement
// //         //    juste avant que le zoom GIS commence (phase 3)
// //         const gisProxy   = { z: gisCam.current.initialZ };

// //         // État initial garanti
// //         gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
// //         gsap.set([ovAkira, ovGis], { opacity: 0, pointerEvents: 'none' });
// //         gsap.set(ovAkira.querySelector('.overlay-title'),   { opacity: 0, y: 30 });
// //         gsap.set(ovAkira.querySelector('.overlay-bar'),     { opacity: 0 });
// //         gsap.set(ovAkira.querySelector('.overlay-content'), { opacity: 0, y: 20 });
// //         gsap.set(ovGis.querySelector('.overlay-title'),     { opacity: 0, y: 30 });
// //         gsap.set(ovGis.querySelector('.overlay-bar'),       { opacity: 0 });
// //         gsap.set(ovGis.querySelector('.overlay-content'),   { opacity: 0, y: 20 });

// //         const tl = gsap.timeline({
// //             scrollTrigger: {
// //                 trigger: hero,
// //                 start: 'top top',
// //                 end: '+=600%',
// //                 scrub: 1.2,
// //                 pin: true,
// //                 anticipatePin: 1,
// //             },
// //         });

// //         // ── PHASE 1 : Zoom Akira ─────────────────────────────────────────────
// //         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in' }, 0);
// //         tl.to(gisEl,             { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0);

// //         tl.to(akiraProxy, {
// //             z: 0.5,
// //             duration: 0.22,
// //             ease: 'power2.inOut',
// //             onUpdate() {
// //                 const cam = akiraCam.current.camera;
// //                 if (cam) cam.position.z = akiraProxy.z;
// //             },
// //         }, 0);

// //         tl.to(akiraEl, { opacity: 0, duration: 0.05 }, 0.22);

// //         // ── PHASE 1b : Overlay Akira ─────────────────────────────────────────
// //         tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.25);
// //         tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.30);
// //         tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.35);
// //         tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.40);

// //         // ── PHASE 2 : Retour hero (les 2 persos) ─────────────────────────────
// //         tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.07 }, 0.50);

// //         // Reset zoom Akira → initialZ
// //         // tl.to(akiraProxy, {
// //         //     z: akiraCam.current.initialZ,
// //         //     duration: 0.08,
// //         //     ease: 'power2.out',
// //         //     onUpdate() {
// //         //         const cam = akiraCam.current.camera;
// //         //         if (cam) cam.position.z = akiraProxy.z;
// //         //     },
// //         // }, 0.50);

// //         // ✅ Reset explicite caméra GIS à initialZ via un callbackau moment exact
// //         //    où le hero réapparaît — avant que le zoom GIS démarre
// //         // tl.call(() => {
// //         //     const cam = gisCam.current.camera;

// //         //     if (cam) {
// //         //         // cam.position.z = gisCam.current.initialZ;
// //         //         cam.position.z = akiraProxyDefault.z; // reset rapide si on est encore dans la phase 2 et que le proxy a bougé
// //         //         gisProxy.z     = gisCam.current.initialZ; // sync le proxy
// //         //     }
// //         // }, [], 0.52);

// //         // Retour des deux persos + slogan + boutons
// //         tl.to([akiraEl, gisEl],  { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.55);
// //         tl.to([slogan, buttons], { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.65);

// //         // Pause visuelle (0.55 → 0.62) : les 2 persos bien visibles, rien ne bouge

// //         // ── PHASE 3 : Zoom GIS ───────────────────────────────────────────────
// //         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.05, ease: 'power2.in' }, 0.65);
// //         tl.to(akiraEl,           { opacity: 0, duration: 0.05 }, 0.62);

// //         // ✅ Le zoom GIS part maintenant de initialZ (garanti par le call() ci-dessus)
// //         tl.to(gisProxy, {
// //             z: 2,
// //             duration: 0.22,
// //             ease: 'power2.inOut',
// //             onUpdate() {
// //                 const cam = gisCam.current.camera;
// //                 if (cam) cam.position.z = gisProxy.z;
// //             },
// //         }, 0.60);

// //         // tl.to(gisEl, { opacity: 0, duration: 0.05 }, 0.82);

// //         // ── PHASE 3b : Overlay GIS ───────────────────────────────────────────
// //         tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.87);
// //         tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.70);
// //         tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.75);
// //         tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.80);

// //         // ── FIN : cleanup quand le hero défile hors écran ────────────────────
// //         // ScrollTrigger.create({
// //         //     trigger: hero,
// //         //     start: 'bottom bottom',
// //         //     onEnter: () => {
// //         //         gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
// //         //         const camG = gisCam.current.camera;
// //         //         const camA = akiraCam.current.camera;
// //         //         if (camG) camG.position.z = gisCam.current.initialZ;
// //         //         if (camA) camA.position.z = akiraCam.current.initialZ;
// //         //         gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
// //         //     },
// //         // });

// //     }, []);

// //     const handleAkiraReady = useCallback(({ camera, initialZ }) => {
// //         akiraCam.current = { camera, initialZ };
// //         readyCount.current += 1;
// //         if (readyCount.current === 2) buildTimeline();
// //     }, [buildTimeline]);

// //     const handleGisReady = useCallback(({ camera, initialZ }) => {
// //         gisCam.current = { camera, initialZ };
// //         readyCount.current += 1;
// //         if (readyCount.current === 2) buildTimeline();
// //     }, [buildTimeline]);

// //     useEffect(() => {
// //         return () => ScrollTrigger.getAll().forEach(st => st.kill());
// //     }, []);

// //     return (
// //         <>
// //             <ImmersionOverlay
// //                 ref={overlayAkiraRef}
// //                 side="left"
// //                 color="cyan"
// //                 title="Akira"
// //                 content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
// //             >
// //                 <Akira3D mode="immersion" />
// //             </ImmersionOverlay>

// //             <ImmersionOverlay
// //                 ref={overlayGisRef}
// //                 side="right"
// //                 color="magenta"
// //                 title="Ghost in the Shell"
// //                 content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
// //             >
// //                 <GIS3D mode="immersion" />
// //             </ImmersionOverlay>

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
// //                         <div className="scroll-down">
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
// // };

// // export default Hero;


// import { useRef, useEffect, useCallback, useState } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Akira3D from './Akira3D';
// import GIS3D from './GIS3D';
// import ImmersionOverlay from './ImmersionOverlay';

// gsap.registerPlugin(ScrollTrigger);

// const Hero = ({ title1, title2, subtitle }) => {
//     const heroRef         = useRef(null);
//     const sloganRef       = useRef(null);
//     const akiraHeroRef    = useRef(null);
//     const gisHeroRef      = useRef(null);
//     const buttonsRef      = useRef(null);
//     const overlayAkiraRef = useRef(null);
//     const overlayGisRef   = useRef(null);
//     const loaderRef       = useRef(null);

//     const akiraCam   = useRef({ camera: null, initialZ: null });
//     const gisCam     = useRef({ camera: null, initialZ: null });
//     const readyCount = useRef(0);

//     // 0 = rien chargé, 1 = un modèle prêt, 2 = les deux prêts
//     const [loadedCount, setLoadedCount] = useState(0);

//     const buildTimeline = useCallback(() => {
//         const hero    = heroRef.current;
//         const slogan  = sloganRef.current;
//         const akiraEl = akiraHeroRef.current;
//         const gisEl   = gisHeroRef.current;
//         const buttons = buttonsRef.current;
//         const ovAkira = overlayAkiraRef.current;
//         const ovGis   = overlayGisRef.current;

//         if (!hero || !ovAkira || !ovGis) return;

//         // const akiraInitialZ = akiraCam.current.initialZ;
//         const akiraInitialZ = 58;
//         const gisInitialZ   = gisCam.current.initialZ;

//         const akiraProxy = { z: akiraInitialZ };
//         const gisProxy   = { z: gisInitialZ };

//         // Fade out du loader puis lancement des ScrollTriggers
//         gsap.to(loaderRef.current, {
//             opacity: 0,
//             duration: 2,
//             ease: 'power3.out',
//             onComplete: () => {
//                 if (loaderRef.current) loaderRef.current.style.display = 'none';
//             },
//         });

//         // État initial garanti
//         gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
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
//             },
//         });

//         // ── PHASE 1 : Zoom Akira ─────────────────────────────────────────────
//         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in' }, 0);
//         tl.to(gisEl,             { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0);

//         tl.fromTo(akiraProxy,
//             { z: akiraInitialZ },

//             {
//                 z: 0.5,
//                 duration: 0.22,
//                 ease: 'power2.inOut',
//                 onUpdate() {
//                     const cam = akiraCam.current.camera;
//                     if (cam) cam.position.z = akiraProxy.z;
//                 },
//             },
//         0);
//         console.log("akiraInitialZ : " + akiraInitialZ),
//         console.log("gisInitialZ : " + gisInitialZ),


//         tl.to(akiraEl, { opacity: 0, duration: 0.05 }, 0.22);

//         // ── PHASE 1b : Overlay Akira ─────────────────────────────────────────
//         tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.25);
//         tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.30);
//         tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.35);
//         tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.40);

//         // ── PHASE 2 : Retour hero (les 2 persos) ─────────────────────────────
//         tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.07 }, 0.50);

//         tl.fromTo(akiraProxy,
//             { z: 0.5 },
//             {
//                 z: akiraInitialZ,
//                 duration: 0.08,
//                 ease: 'power2.out',
//                 onUpdate() {
//                     const camA = akiraCam.current.camera;
//                     if (camA) camA.position.z = akiraProxy.z;
//                     // Force GIS à initialZ à chaque frame — propre quand gisEl réapparaît
//                     const camG = gisCam.current.camera;
//                     if (camG) {
//                         camG.position.z = gisInitialZ;
//                         gisProxy.z      = gisInitialZ;
//                     }
//                 },
//             },
//         0.50);

//         tl.to([akiraEl, gisEl],  { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.55);
//         tl.to([slogan, buttons], { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.60);

//         // Pause visuelle (0.60 → 0.65) : les 2 persos bien visibles, rien ne bouge

//         // ── PHASE 3 : Zoom GIS ───────────────────────────────────────────────
//         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.05, ease: 'power2.in' }, 0.65);
//         tl.to(akiraEl,           { opacity: 0, duration: 0.05 }, 0.65);

//         tl.fromTo(gisProxy,
//             { z: gisInitialZ },
//             {
//                 z: 0.5,
//                 duration: 0.22,
//                 ease: 'power2.inOut',
//                 onUpdate() {
//                     const cam = gisCam.current.camera;
//                     if (cam) cam.position.z = gisProxy.z;
//                 },
//             },
//         0.65);

//         tl.to(gisEl, { opacity: 0, duration: 0.05 }, 0.87);

//         // ── PHASE 3b : Overlay GIS ───────────────────────────────────────────
//         tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.87);
//         tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.90);
//         tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.93);
//         tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.96);

//         // ── FIN : cleanup quand le hero défile hors écran ────────────────────
//         ScrollTrigger.create({
//             trigger: hero,
//             start: 'bottom bottom',
//             onEnter: () => {
//                 gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
//                 const camG = gisCam.current.camera;
//                 const camA = akiraCam.current.camera;
//                 if (camG) camG.position.z = gisInitialZ;
//                 if (camA) camA.position.z = akiraInitialZ;
//                 gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
//             },
//         });

//     }, []);

//     const handleAkiraReady = useCallback(({ camera, initialZ }) => {
//         akiraCam.current = { camera, initialZ };
//         readyCount.current += 1;
//         setLoadedCount(readyCount.current);
//         if (readyCount.current === 2) buildTimeline();
//     }, [buildTimeline]);

//     const handleGisReady = useCallback(({ camera, initialZ }) => {
//         gisCam.current = { camera, initialZ };
//         readyCount.current += 1;
//         setLoadedCount(readyCount.current);
//         if (readyCount.current === 2) buildTimeline();
//     }, [buildTimeline]);

//     useEffect(() => {
//         return () => ScrollTrigger.getAll().forEach(st => st.kill());
//     }, []);

//     // Pourcentage de chargement : 0 → 50 → 100
//     const loadPercent = loadedCount * 50;
//     const isLoaded    = loadedCount >= 2;

//     return (
//         <>
//             {/* ── LOADER ── */}
//             <div
//                 ref={loaderRef}
//                 style={{
//                     position: 'fixed',
//                     inset: 0,
//                     zIndex: 999,
//                     background: '#0a0a0a',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '2rem',
//                     pointerEvents: isLoaded ? 'none' : 'all',
//                 }}
//             >
//                 {/* Titre */}
//                 <p style={{
//                     fontFamily: 'var(--ff-family-main)',
//                     fontSize: 'clamp(1rem, 2vw, 1.4rem)',
//                     fontWeight: 300,
//                     letterSpacing: '6px',
//                     textTransform: 'uppercase',
//                     color: '#fff',
//                     opacity: 0.6,
//                     margin: 0,
//                 }}>
//                     Chargement de l'expérience
//                 </p>

//                 {/* Barre de chargement */}
//                 <div style={{
//                     width: 'clamp(200px, 40vw, 400px)',
//                     height: '2px',
//                     background: 'rgba(255,255,255,0.1)',
//                     position: 'relative',
//                     overflow: 'hidden',
//                 }}>
//                     <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         height: '100%',
//                         width: `${loadPercent}%`,
//                         background: 'linear-gradient(to right, #00d4ff, #ff00ff)',
//                         transition: 'width 0.4s ease',
//                     }} />
//                 </div>

//                 {/* Pourcentage */}
//                 <p style={{
//                     fontFamily: 'var(--ff-family-main)',
//                     fontSize: '0.85rem',
//                     fontWeight: 300,
//                     letterSpacing: '3px',
//                     color: '#fff',
//                     opacity: 0.4,
//                     margin: 0,
//                 }}>
//                     {loadPercent}%
//                 </p>
//             </div>

//             {/* ── OVERLAY IMMERSION AKIRA ── */}
//             <ImmersionOverlay
//                 ref={overlayAkiraRef}
//                 side="left"
//                 color="cyan"
//                 title="Akira"
//                 content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
//             >
//                 <Akira3D mode="immersion" />
//             </ImmersionOverlay>

//             {/* ── OVERLAY IMMERSION GIS ── */}
//             <ImmersionOverlay
//                 ref={overlayGisRef}
//                 side="right"
//                 color="magenta"
//                 title="Ghost in the Shell"
//                 content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
//             >
//                 <GIS3D mode="immersion" />
//             </ImmersionOverlay>

//             {/* ── HERO ── */}
//             <div className="hero-section" ref={heroRef}>
//                 <div className="characters-infos">
//                     <div className="akira" ref={akiraHeroRef}>
//                         <Akira3D mode="hero" cameraRef={akiraCam} onReady={handleAkiraReady} />
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
//                         <div className="scroll-down">
//                             <h3>Scroll pour en savoir plus</h3>
//                             <div className="arrow">
//                                 <span className="arrow-down"></span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="gis" ref={gisHeroRef}>
//                         <GIS3D mode="hero" cameraRef={gisCam} onReady={handleGisReady} />
//                     </div>
//                 </div>

//                 <div className="buttons-hero" ref={buttonsRef}>
//                     <a href="#">teaser</a>
//                     <a href="#">tickets</a>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Hero;


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

//     const akiraCam   = useRef({ camera: null, initialZ: null });
//     const gisCam     = useRef({ camera: null, initialZ: null });
//     const readyCount = useRef(0);

//     const [loadedCount, setLoadedCount] = useState(0);

//     const buildTimeline = useCallback(() => {
//         const hero    = heroRef.current;
//         const slogan  = sloganRef.current;
//         const akiraEl = akiraHeroRef.current;
//         const gisEl   = gisHeroRef.current;
//         const buttons = buttonsRef.current;
//         const ovAkira = overlayAkiraRef.current;
//         const ovGis   = overlayGisRef.current;

//         if (!hero || !ovAkira || !ovGis) return;

//         const akiraInitialZ = akiraCam.current.initialZ;
//         const gisInitialZ   = gisCam.current.initialZ;

//         const akiraProxy = { z: akiraInitialZ };
//         const gisProxy   = { z: gisInitialZ };

//         // ✅ FIX REFRESH : scroll reset + caméras forcées à initialZ
//         // avant que ScrollTrigger ne calcule quoi que ce soit
//         window.scrollTo(0, 0);
//         const camA = akiraCam.current.camera;
//         const camG = gisCam.current.camera;
//         if (camA) camA.position.z = akiraInitialZ;
//         if (camG) camG.position.z = gisInitialZ;

//         // Fade out loader
//         gsap.to(loaderRef.current, {
//             opacity: 0,
//             duration: 2,
//             ease: 'power3.out',
//             onComplete: () => {
//                 if (loaderRef.current) loaderRef.current.style.display = 'none';
//             },
//         });

//         // État initial garanti
//         gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
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
//                 // ✅ FIX REFRESH : invalide les positions au refresh
//                 // pour que GSAP recalcule depuis scroll=0
//                 invalidateOnRefresh: true,
//             },
//         });

//         // ── PHASE 1 : Zoom Akira ─────────────────────────────────────────────
//         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in' }, 0);
//         tl.to(gisEl,             { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0);

//         tl.fromTo(akiraProxy,
//             { z: akiraInitialZ },
//             {
//                 z: 0.5,
//                 duration: 0.22,
//                 ease: 'power2.inOut',
//                 onUpdate() {
//                     const cam = akiraCam.current.camera;
//                     if (cam) cam.position.z = akiraProxy.z;
//                 },
//             },
//         0);

//         tl.to(akiraEl, { opacity: 0, duration: 0.05 }, 0.22);

//         // ── PHASE 1b : Overlay Akira ─────────────────────────────────────────
//         tl.to(ovAkira, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.25);
//         tl.to(ovAkira.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.30);
//         tl.to(ovAkira.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.35);
//         tl.to(ovAkira.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.40);

//         // ── PHASE 2 : Retour hero (les 2 persos) ─────────────────────────────
//         tl.to(ovAkira, { opacity: 0, pointerEvents: 'none', duration: 0.07 }, 0.50);

//         tl.fromTo(akiraProxy,
//             { z: 0.5 },
//             {
//                 z: akiraInitialZ,
//                 duration: 0.08,
//                 ease: 'power2.out',
//                 // onUpdate() {
//                 //     const camA = akiraCam.current.camera;
//                 //     if (camA) camA.position.z = akiraProxy.z;
//                 //     // Force GIS à initialZ à chaque frame
//                 //     const camG = gisCam.current.camera;
//                 //     if (camG) {
//                 //         camG.position.z = gisInitialZ;
//                 //         gisProxy.z      = gisInitialZ;
//                 //     }
//                 // },
//             },
//         0.50);

//         tl.to([akiraEl, gisEl],  { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.55);
//         tl.to([slogan, buttons], { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.60);

//         // Pause visuelle (0.60 → 0.65)

//         // ── PHASE 3 : Zoom GIS ───────────────────────────────────────────────
//         tl.to([slogan, buttons], { opacity: 0, y: -20, duration: 0.05, ease: 'power2.in' }, 0.65);
//         tl.to(akiraEl,           { opacity: 0, duration: 0.05 }, 0.65);
            
//         tl.fromTo(gisProxy,
//             { z: 2 },
//             {
//                 z: 0.5,
//                 duration: 0.22,
//                 ease: 'power2.inOut',
//                 onUpdate() {
//                     const cam = gisCam.current.camera;
//                     if (cam) cam.position.z = gisProxy.z;
//                 },
//             },
//         0.65);

//         tl.to(gisEl, { opacity: 0, duration: 0.05 }, 0.87);

//         // ── PHASE 3b : Overlay GIS ───────────────────────────────────────────
//         tl.to(ovGis, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.87);
//         tl.to(ovGis.querySelector('.overlay-title'),   { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.90);
//         tl.to(ovGis.querySelector('.overlay-bar'),     { opacity: 1, duration: 0.05 }, 0.93);
//         tl.to(ovGis.querySelector('.overlay-content'), { opacity: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.96);

//         // ── FIN : cleanup quand le hero défile hors écran ────────────────────
//         ScrollTrigger.create({
//             trigger: hero,
//             start: 'bottom bottom',
//             onEnter: () => {
//                 gsap.to(ovGis, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
//                 const camG = gisCam.current.camera;
//                 const camA = akiraCam.current.camera;
//                 if (camG) camG.position.z = gisInitialZ;
//                 if (camA) camA.position.z = akiraInitialZ;
//                 gsap.set([slogan, buttons, akiraEl, gisEl], { opacity: 1, y: 0 });
//             },
//         });

//     }, []);

//     const handleAkiraReady = useCallback(({ camera, initialZ }) => {
//         akiraCam.current = { camera, initialZ };
//         readyCount.current += 1;
//         setLoadedCount(readyCount.current);
//         if (readyCount.current === 2) buildTimeline();
//     }, [buildTimeline]);

//     const handleGisReady = useCallback(({ camera, initialZ }) => {
//         gisCam.current = { camera, initialZ };
//         readyCount.current += 1;
//         setLoadedCount(readyCount.current);
//         if (readyCount.current === 2) buildTimeline();
//     }, [buildTimeline]);

//     useEffect(() => {
//         return () => ScrollTrigger.getAll().forEach(st => st.kill());
//     }, []);

//     const loadPercent = loadedCount * 50;
//     const isLoaded    = loadedCount >= 2;

//     return (
//         <>
//             {/* ── LOADER ── */}
//             <div
//                 ref={loaderRef}
//                 style={{
//                     position: 'fixed',
//                     inset: 0,
//                     zIndex: 999,
//                     background: '#0a0a0a',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '2rem',
//                     pointerEvents: isLoaded ? 'none' : 'all',
//                 }}
//             >
//                 <p style={{
//                     fontFamily: 'var(--ff-family-main)',
//                     fontSize: 'clamp(1rem, 2vw, 1.4rem)',
//                     fontWeight: 300,
//                     letterSpacing: '6px',
//                     textTransform: 'uppercase',
//                     color: '#fff',
//                     opacity: 0.6,
//                     margin: 0,
//                 }}>
//                     Chargement de l'expérience
//                 </p>

//                 <div style={{
//                     width: 'clamp(200px, 40vw, 400px)',
//                     height: '2px',
//                     background: 'rgba(255,255,255,0.1)',
//                     position: 'relative',
//                     overflow: 'hidden',
//                 }}>
//                     <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         height: '100%',
//                         width: `${loadPercent}%`,
//                         background: 'linear-gradient(to right, #00d4ff, #ff00ff)',
//                         transition: 'width 0.4s ease',
//                     }} />
//                 </div>

//                 <p style={{
//                     fontFamily: 'var(--ff-family-main)',
//                     fontSize: '0.85rem',
//                     fontWeight: 300,
//                     letterSpacing: '3px',
//                     color: '#fff',
//                     opacity: 0.4,
//                     margin: 0,
//                 }}>
//                     {loadPercent}%
//                 </p>
//             </div>

//             {/* ── OVERLAY IMMERSION AKIRA ── */}
//             <ImmersionOverlay
//                 ref={overlayAkiraRef}
//                 side="left"
//                 color="cyan"
//                 title="Akira"
//                 content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
//             >
//                 <Akira3D mode="immersion" />
//             </ImmersionOverlay>

//             {/* ── OVERLAY IMMERSION GIS ── */}
//             <ImmersionOverlay
//                 ref={overlayGisRef}
//                 side="right"
//                 color="magenta"
//                 title="Ghost in the Shell"
//                 content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
//             >
//                 <GIS3D mode="immersion" />
//             </ImmersionOverlay>

//             {/* ── HERO ── */}
//             <div className="hero-section" ref={heroRef}>
//                 <div className="characters-infos">
//                     <div className="akira" ref={akiraHeroRef}>
//                         <Akira3D mode="hero" cameraRef={akiraCam} onReady={handleAkiraReady} />
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
//                         <div className="scroll-down">
//                             <h3>Scroll pour en savoir plus</h3>
//                             <div className="arrow">
//                                 <span className="arrow-down"></span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="gis" ref={gisHeroRef}>
//                         <GIS3D mode="hero" cameraRef={gisCam} onReady={handleGisReady} />
//                     </div>
//                 </div>

//                 <div className="buttons-hero" ref={buttonsRef}>
//                     <a href="#">teaser</a>
//                     <a href="#">tickets</a>
//                 </div>
//             </div>
//         </>
//     );
// };
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
