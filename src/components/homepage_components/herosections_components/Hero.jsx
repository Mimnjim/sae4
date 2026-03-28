// import { useRef, useEffect, useCallback, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Akira3D from './Akira3D';
// import GIS3D from './GIS3D';
// import ImmersionOverlay from './ImmersionOverlay';
// import { ArrowUpRight } from '@boxicons/react';

// gsap.registerPlugin(ScrollTrigger);

// export default function Hero({ title1, title2, subtitle }) {
//     const { t } = useTranslation();
//     const heroRef = useRef(null);
//     const sloganRef = useRef(null);
//     const akiraHeroRef = useRef(null);
//     const gisHeroRef = useRef(null);
//     const buttonsRef = useRef(null);
//     const footerHeroRef = useRef(null);
//     const overlayAkiraRef = useRef(null);
//     const overlayGisRef = useRef(null);
//     const loaderRef = useRef(null);
//     const scrollDownRef = useRef(null);
//     const transitionRef = useRef(null);

//     const akiraCam = useRef({ camera: null, initialZ: null });
//     const gisCam = useRef({ camera: null, initialZ: null });
//     const akiraModel = useRef(null);
//     const gisModel = useRef(null);

//     const built = useRef(false);
//     const readyCount = useRef(0);

//     const [loadedCount, setLoadedCount] = useState(0);

//     const floatingAnimRef = useRef(null);

//     useEffect(() => {
//         window.history.scrollRestoration = 'manual';
//         window.scrollTo(0, 0);
//     }, []);

//     // Animation flottante du texte "Scroll pour en savoir plus"
//     useEffect(() => {
//         // Petit délai pour s'assurer que le DOM est prêt
//         const timeoutId = setTimeout(() => {
//             if (scrollDownRef.current) {
//                 // Tuer toute animation existante
//                 gsap.killTweensOf(scrollDownRef.current);

//                 // Créer la nouvelle animation flottante
//                 floatingAnimRef.current = gsap.to(scrollDownRef.current, {
//                     y: 10,
//                     duration: 0.8,
//                     repeat: -1,
//                     yoyo: true,
//                     ease: 'sine.inOut',
//                 });
//             }
//         }, 200);

//         return () => {
//             clearTimeout(timeoutId);
//             if (floatingAnimRef.current) {
//                 floatingAnimRef.current.kill();
//                 floatingAnimRef.current = null;
//             }
//         };
//     }, []);

//     const buildTimeline = useCallback(() => {
//         if (built.current) return;
//         built.current = true;

//         ScrollTrigger.getAll().forEach(st => st.kill());

//         const akiraCamera = akiraCam.current.camera;
//         const gisCamera = gisCam.current.camera;
//         const akiraInitialZ = akiraCam.current.initialZ;
//         const gisInitialZ = gisCam.current.initialZ;

//         if (!akiraCamera || !gisCamera) return;

//         window.dispatchEvent(new Event('resize'));

//         const akiraInitialY = akiraCamera.position.y;
//         const gisInitialY = gisCamera.position.y;
//         const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
//         const gisProxy = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

//         // Filtrer les éléments null avant de les animer
//         const elementsToAnimate = [sloganRef.current, buttonsRef.current, scrollDownRef.current, footerHeroRef.current].filter(Boolean);
//         if (elementsToAnimate.length > 0) {
//             gsap.set(elementsToAnimate, { opacity: 1, y: 0, visibility: 'visible' });
//         }
//         gsap.set(akiraHeroRef.current, { x: 0, opacity: 1, visibility: 'visible', scale: 1 });
//         gsap.set(gisHeroRef.current, { x: 0, y: -30, opacity: 1, visibility: 'visible', scale: 1 });
//         const overlayElements = [overlayAkiraRef.current?.element, overlayGisRef.current?.element].filter(Boolean);
//         if (overlayElements.length > 0) gsap.set(overlayElements, { opacity: 0, pointerEvents: 'none' });
//         gsap.set(transitionRef.current, { opacity: 0, pointerEvents: 'none' });

//         // Relancer l'animation flottante du scrollDown
//         if (scrollDownRef.current && !floatingAnimRef.current?.isActive()) {
//             gsap.killTweensOf(scrollDownRef.current);
//             floatingAnimRef.current = gsap.to(scrollDownRef.current, {
//                 y: 10,
//                 duration: 0.8,
//                 repeat: -1,
//                 yoyo: true,
//                 ease: 'sine.inOut',
//             });
//         }

//         const tl = gsap.timeline({
//             scrollTrigger: {
//                 trigger: heroRef.current,
//                 start: 'top top',
//                 end: '+=600%',
//                 scrub: 2,
//                 pin: true,
//                 invalidateOnRefresh: true,
//                 onUpdate: (self) => {
//                     // Pause l'animation flottante quand on commence à scroller vers le bas
//                     if (self.progress > 0.01) {
//                         if (floatingAnimRef.current && !floatingAnimRef.current.paused()) {
//                             floatingAnimRef.current.pause();
//                         }
//                     } else {
//                         // Relancer l'animation quand on revient vers le top
//                         if (floatingAnimRef.current && floatingAnimRef.current.paused()) {
//                             floatingAnimRef.current.play();
//                         }
//                     }
//                 }
//             }
//         });

//         // PHASE 1 : DÉPART
//         tl.to(scrollDownRef.current, {
//             opacity: 0, y: -50, duration: 1,
//         }, 0);
//         const elementsToHide = [sloganRef.current, buttonsRef.current, footerHeroRef.current].filter(Boolean);
//         if (elementsToHide.length > 0) {
//             tl.to(elementsToHide, { opacity: 0, y: -50, duration: 1 }, 0);
//         }
//         tl.to(gisHeroRef.current,
//             { x: 1200, opacity: 0, duration: 1.5, ease: 'power2.inOut' }, 0);

//         // PHASE 2 : ZOOM AKIRA
//         tl.to(akiraProxy, {
//             z: akiraInitialZ * 0.45,
//             y: akiraInitialY + 30,
//             rotY: Math.PI / 2,
//             duration: 2,
//             onUpdate: () => {
//                 akiraCamera.position.z = akiraProxy.z;
//                 akiraCamera.position.y = akiraProxy.y;
//                 akiraCamera.lookAt(0, akiraInitialY + 30, -85);
//                 if (akiraModel.current) akiraModel.current.rotation.y = akiraProxy.rotY;
//             }
//         }, 0.5);

//         // PHASE 3 : HUD AKIRA — replay() déclenche DecryptedText au moment de l'apparition
//         const akiraHUD = overlayAkiraRef.current?.element;
//         if (akiraHUD) {
//             tl.to(akiraHUD, { opacity: 1, pointerEvents: 'auto', duration: 0.1, onStart: () => overlayAkiraRef.current?.replay?.() }, 1.5);

//             const akiraPointer = akiraHUD.querySelector('.hud-pointer');
//             const akiraLine = akiraHUD.querySelector('.hud-line');
//             const akiraTextBox = akiraHUD.querySelector('.text-box-frame');
//             const akiraTitle = akiraHUD.querySelector('.overlay-title');
//             const akiraBar = akiraHUD.querySelector('.overlay-bar');
//             const akiraContent = akiraHUD.querySelector('.overlay-content');

//             if (akiraPointer) tl.fromTo(akiraPointer, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 1.7);
//             if (akiraLine) tl.to(akiraLine, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 1.9);
//             if (akiraTextBox) tl.to(akiraTextBox, { visibility: 'visible', opacity: 1, y: 0, duration: 0.4 }, 2.1);
//             if (akiraTitle) tl.to(akiraTitle, { opacity: 1, duration: 0.3 }, 2.4);
//             if (akiraBar) tl.to(akiraBar, { width: '100%', duration: 0.4 }, 2.8);
//             if (akiraContent) tl.to(akiraContent, { opacity: 1, duration: 0.4 }, 3.2);
//         }

//         // PHASE 4 : TRANSITION SYNCHRO
//         tl.to(akiraHeroRef.current, { x: -1200, opacity: 0, duration: 2, ease: 'power2.inOut' }, 4.0);
//         tl.to(gisHeroRef.current, { x: 0, opacity: 1, duration: 2, ease: 'power2.out' }, 4.2);
//         tl.to(overlayAkiraRef.current?.element, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 4.6);

//         // PHASE 5 : ZOOM GIS
//         tl.to(gisProxy, {
//             z: gisInitialZ * 0.28,
//             y: gisInitialY + 1.48,
//             rotY: (-Math.PI / 2) + 0.5,
//             duration: 2,
//             onUpdate: () => {
//                 gisCamera.position.z = gisProxy.z;
//                 gisCamera.position.y = gisProxy.y;
//                 gisCamera.lookAt(0, gisInitialY + 1.78, -0.35);
//                 if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
//             }
//         }, 6.6);

//         // PHASE 6 : HUD GIS — idem, replay() au moment de l'apparition
//         const gisHUD = overlayGisRef.current?.element;
//         if (gisHUD) {
//             tl.to(gisHUD, { opacity: 1, pointerEvents: 'auto', duration: 0.1, onStart: () => overlayGisRef.current?.replay?.() }, 6.5);

//             const gisPointer = gisHUD.querySelector('.hud-pointer');
//             const gisLine = gisHUD.querySelector('.hud-line');
//             const gisTextBox = gisHUD.querySelector('.text-box-frame');
//             const gisTitle = gisHUD.querySelector('.overlay-title');
//             const gisBar = gisHUD.querySelector('.overlay-bar');
//             const gisContent = gisHUD.querySelector('.overlay-content');

//             if (gisPointer) tl.fromTo(gisPointer, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 6.6);
//             if (gisLine) tl.to(gisLine, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 6.7);
//             if (gisTextBox) tl.to(gisTextBox, { visibility: 'visible', opacity: 1, y: 0, duration: 0.4 }, 7.5);
//             if (gisTitle) tl.to(gisTitle, { opacity: 1, duration: 0.3 }, 7.7);
//             if (gisBar) tl.to(gisBar, { width: '100%', duration: 0.4 }, 7.8);
//             if (gisContent) tl.to(gisContent, { opacity: 1, duration: 0.4 }, 7.9);
//         }

//         // PHASE 7 : SORTIE GIS
//         tl.to(overlayGisRef.current?.element, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 9.0);
//         tl.to(gisHeroRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 9.0);

//         // PHASE 8 : TRANSITION FLUIDE (contenu MangaArchive)
//         const backgroundTransition = document.querySelector('.hero-to-archive-transition');
//         if (backgroundTransition) {
//             gsap.set(backgroundTransition, {
//                 opacity: 0,
//                 y: 60,
//                 filter: 'blur(8px)'
//             });
//             tl.to(backgroundTransition, {
//                 opacity: 1,
//                 y: 0,
//                 filter: 'blur(0px)',
//                 duration: 1.6,
//                 ease: 'power2.inOut'
//             }, 9.5);
//         }

//         requestAnimationFrame(() => {
//             ScrollTrigger.refresh();
//             if (loaderRef.current) {
//                 gsap.to(loaderRef.current, {
//                     opacity: 0, duration: 0.8, delay: 0.2,
//                     onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = 'none'; }
//                 });
//             }
//         });
//     }, []);

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

//     const handleAkiraHUDReady = useCallback(() => {
//         readyCount.current += 1;
//         if (loadedCount >= 2 && readyCount.current >= 2) setTimeout(buildTimeline, 300);
//     }, [loadedCount, buildTimeline]);

//     const handleGisHUDReady = useCallback(() => {
//         readyCount.current += 1;
//         if (loadedCount >= 2 && readyCount.current >= 2) setTimeout(buildTimeline, 300);
//     }, [loadedCount, buildTimeline]);

//     // Fallback si HUD onReady tardent
//     useEffect(() => {
//         if (loadedCount >= 2) {
//             const t = setTimeout(buildTimeline, 600);
//             return () => clearTimeout(t);
//         }
//     }, [loadedCount, buildTimeline]);

//     const loadPercent = Math.min(loadedCount * 50, 100);

//     return (
//         <>
//             {/* Overlay de transition — vide, GPU opacity uniquement */}
//             <div
//                 ref={transitionRef}
//                 style={{
//                     position: 'fixed', inset: 0, zIndex: 50,
//                     background: '#000', opacity: 0,
//                     pointerEvents: 'none', willChange: 'opacity',
//                 }}
//             />

//             {/* HUD Akira */}
//             <ImmersionOverlay
//                 ref={overlayAkiraRef}
//                 side="left"
//                 title={t('hero.akiraTitle')}
//                 content={t('hero.akiraContent')}
//                 onReady={handleAkiraHUDReady}
//             />

//             {/* HUD Ghost in the Shell */}
//             <ImmersionOverlay
//                 ref={overlayGisRef}
//                 side="right"
//                 title={t('hero.gisTitle')}
//                 content={t('hero.gisContent')}
//                 onReady={handleGisHUDReady}
//             />

//             {/* Loader */}
//             <div ref={loaderRef} style={{
//                 position: 'fixed', inset: 0, zIndex: 999, background: '#0a0a0a',
//                 display: 'flex', flexDirection: 'column', alignItems: 'center',
//                 justifyContent: 'center', gap: '2rem'
//             }}>
//                 <p style={{ fontFamily: 'var(--ff-family-main)', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
//                     {t('hero.loading')}
//                 </p>
//                 <div style={{ width: 'clamp(200px, 40vw, 400px)', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
//                     <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'linear-gradient(to right, #00d4ff, #ff00ff)', transition: 'width 0.4s ease' }} />
//                 </div>
//                 <p style={{ color: '#fff', opacity: 0.4 }}>{loadPercent}%</p>
//             </div>

//             {/* Hero section */}
//             <div className="hero-section" ref={heroRef} style={{ position: 'relative', overflow: 'visible' }}>
//                 <div className="characters-infos">
//                     <div className="akira" ref={akiraHeroRef}>
//                         <Akira3D onReady={handleAkiraReady} />
//                     </div>

//                     <div className="container-hero">
//                         {/* <div className="container-slogan" ref={sloganRef}>
//                             <div className="triangle" />
//                             <h1 className="slogan">{title1}</h1>
//                             <h1 className="slogan">{title2}</h1>
//                             <div className="under-slogan"><h2>{subtitle}</h2></div>
//                         </div> */}

//                         <img src="/img/grand_logo_white.svg" ref={sloganRef} alt="Logo de l'exposition - Au delà de l'humain" />

//                         <div ref={scrollDownRef} className="scroll-down">
//                             <h3>{t('hero.scroll')}</h3>
//                             <div className="arrow"><span className="arrow-down" /></div>
//                         </div>
//                     </div>

//                     <div className="gis" ref={gisHeroRef}>
//                         <GIS3D onReady={handleGisReady} />
//                     </div>
//                 </div>

//                 <div className="footer-hero-container" ref={footerHeroRef}>
//                     <p>{t('hero.quote')}</p>
//                     <div className="buttons-hero" ref={buttonsRef} style={{ position: 'relative', zIndex: 20 }}>
//                         <a href="#" className="cursor-target">{t('hero.teaser')} <ArrowUpRight /></a>
//                         <a href="#" className="cursor-target">{t('hero.tickets')} <ArrowUpRight /></a>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }


import { useRef, useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Akira3D from './Akira3D';
import GIS3D from './GIS3D';
import ImmersionOverlay from './ImmersionOverlay';
import { ArrowUpRight } from '@boxicons/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ title1, title2, subtitle }) {
    const { t } = useTranslation();
    const heroRef = useRef(null);
    const sloganRef = useRef(null);
    const akiraHeroRef = useRef(null);
    const gisHeroRef = useRef(null);
    const buttonsRef = useRef(null);
    const footerHeroRef = useRef(null);
    const overlayAkiraRef = useRef(null);
    const overlayGisRef = useRef(null);
    const loaderRef = useRef(null);
    const scrollDownRef = useRef(null);
    const transitionRef = useRef(null);

    const akiraCam = useRef({ camera: null, initialZ: null });
    const gisCam = useRef({ camera: null, initialZ: null });
    const akiraModel = useRef(null);
    const gisModel = useRef(null);

    const built = useRef(false);
    const readyCount = useRef(0);

    const [loadedCount, setLoadedCount] = useState(0);

    const floatingAnimRef = useRef(null);

    useEffect(() => {
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    }, []);

    // Animation flottante du texte "Scroll pour en savoir plus"
    useEffect(() => {
        // Petit délai pour s'assurer que le DOM est prêt
        const timeoutId = setTimeout(() => {
            if (scrollDownRef.current) {
                // Tuer toute animation existante
                gsap.killTweensOf(scrollDownRef.current);

                // Créer la nouvelle animation flottante
                floatingAnimRef.current = gsap.to(scrollDownRef.current, {
                    y: 10,
                    duration: 0.8,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }
        }, 200);

        return () => {
            clearTimeout(timeoutId);
            if (floatingAnimRef.current) {
                floatingAnimRef.current.kill();
                floatingAnimRef.current = null;
            }
        };
    }, []);

    const buildTimeline = useCallback(() => {
        if (built.current) return;
        built.current = true;

        ScrollTrigger.getAll().forEach(st => st.kill());

        const akiraCamera = akiraCam.current.camera;
        const gisCamera = gisCam.current.camera;
        const akiraInitialZ = akiraCam.current.initialZ;
        const gisInitialZ = gisCam.current.initialZ;

        if (!akiraCamera || !gisCamera) return;

        window.dispatchEvent(new Event('resize'));

        const akiraInitialY = akiraCamera.position.y;
        const gisInitialY = gisCamera.position.y;
        const akiraProxy = { z: akiraInitialZ, y: akiraInitialY, rotY: 0 };
        const gisProxy = { z: gisInitialZ, y: gisInitialY, rotY: 0 };

        // Filtrer les éléments null avant de les animer
        const elementsToAnimate = [sloganRef.current, buttonsRef.current, scrollDownRef.current, footerHeroRef.current].filter(Boolean);
        if (elementsToAnimate.length > 0) {
            gsap.set(elementsToAnimate, { opacity: 1, y: 0, visibility: 'visible' });
        }
        gsap.set(akiraHeroRef.current, { x: 0, opacity: 1, visibility: 'visible', scale: 1 });
        gsap.set(gisHeroRef.current, { x: 0, y: -30, opacity: 1, visibility: 'visible', scale: 1 });
        const overlayElements = [overlayAkiraRef.current?.element, overlayGisRef.current?.element].filter(Boolean);
        if (overlayElements.length > 0) gsap.set(overlayElements, { opacity: 0, pointerEvents: 'none' });
        gsap.set(transitionRef.current, { opacity: 0, pointerEvents: 'none' });

        // Relancer l'animation flottante du scrollDown
        if (scrollDownRef.current && !floatingAnimRef.current?.isActive()) {
            gsap.killTweensOf(scrollDownRef.current);
            floatingAnimRef.current = gsap.to(scrollDownRef.current, {
                y: 10,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: '+=600%',
                scrub: 2,
                pin: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // Pause l'animation flottante quand on commence à scroller vers le bas
                    if (self.progress > 0.01) {
                        if (floatingAnimRef.current && !floatingAnimRef.current.paused()) {
                            floatingAnimRef.current.pause();
                        }
                    } else {
                        // Relancer l'animation quand on revient vers le top
                        if (floatingAnimRef.current && floatingAnimRef.current.paused()) {
                            floatingAnimRef.current.play();
                        }
                    }
                }
            }
        });

        // PHASE 1 : DÉPART
        tl.to(scrollDownRef.current, {
            opacity: 0, y: -50, duration: 1,
        }, 0);
        const elementsToHide = [sloganRef.current, buttonsRef.current, footerHeroRef.current].filter(Boolean);
        if (elementsToHide.length > 0) {
            tl.to(elementsToHide, { opacity: 0, y: -50, duration: 1 }, 0);
        }
        tl.to(gisHeroRef.current,
            { x: 1200, opacity: 0, duration: 1.5, ease: 'power2.inOut' }, 0);

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

        // PHASE 3 : HUD AKIRA — replay() déclenche DecryptedText au moment de l'apparition
        const akiraHUD = overlayAkiraRef.current?.element;
        if (akiraHUD) {
            tl.to(akiraHUD, { opacity: 1, pointerEvents: 'auto', duration: 0.1, onStart: () => overlayAkiraRef.current?.replay?.() }, 1.5);

            const akiraPointer = akiraHUD.querySelector('.hud-pointer');
            const akiraLine = akiraHUD.querySelector('.hud-line');
            const akiraTextBox = akiraHUD.querySelector('.text-box-frame');
            const akiraTitle = akiraHUD.querySelector('.overlay-title');
            const akiraBar = akiraHUD.querySelector('.overlay-bar');
            const akiraContent = akiraHUD.querySelector('.overlay-content');

            if (akiraPointer) tl.fromTo(akiraPointer, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 1.7);
            if (akiraLine) tl.to(akiraLine, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 1.9);
            if (akiraTextBox) tl.to(akiraTextBox, { visibility: 'visible', opacity: 1, y: 0, duration: 0.4 }, 2.1);
            if (akiraTitle) tl.to(akiraTitle, { opacity: 1, duration: 0.3 }, 2.4);
            if (akiraBar) tl.to(akiraBar, { width: '100%', duration: 0.4 }, 2.8);
            if (akiraContent) tl.to(akiraContent, { opacity: 1, duration: 0.4 }, 3.2);
        }

        // PHASE 4 : TRANSITION SYNCHRO
        tl.to(akiraHeroRef.current, { x: -1200, opacity: 0, duration: 2, ease: 'power2.inOut' }, 4.0);
        tl.to(gisHeroRef.current, { x: 0, opacity: 1, duration: 2, ease: 'power2.out' }, 4.2);
        tl.to(overlayAkiraRef.current?.element, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 4.6);

        // PHASE 5 : ZOOM GIS
        tl.to(gisProxy, {
            // z: gisInitialZ * 0.63,
            // y: gisInitialY + 2.60,

            z: gisInitialZ * 0.80,
            y: gisInitialY + 1.8,

            rotY: (-Math.PI / 2) + 0.9,
            duration: 2,
            onUpdate: () => {
                gisCamera.position.z = gisProxy.z;
                gisCamera.position.y = gisProxy.y;
                // gisCamera.lookAt(0, gisInitialY + 2.90, -0.35);
                gisCamera.lookAt(0, gisInitialY + 1.8, -0.35);
                if (gisModel.current) gisModel.current.rotation.y = gisProxy.rotY;
            }
        }, 6.6);

        // PHASE 6 : HUD GIS — idem, replay() au moment de l'apparition
        const gisHUD = overlayGisRef.current?.element;
        if (gisHUD) {
            tl.to(gisHUD, { opacity: 1, pointerEvents: 'auto', duration: 0.1, onStart: () => overlayGisRef.current?.replay?.() }, 6.5);

            const gisPointer = gisHUD.querySelector('.hud-pointer');
            const gisLine = gisHUD.querySelector('.hud-line');
            const gisTextBox = gisHUD.querySelector('.text-box-frame');
            const gisTitle = gisHUD.querySelector('.overlay-title');
            const gisBar = gisHUD.querySelector('.overlay-bar');
            const gisContent = gisHUD.querySelector('.overlay-content');

            if (gisPointer) tl.fromTo(gisPointer, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 6.6);
            if (gisLine) tl.to(gisLine, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 6.7);
            if (gisTextBox) tl.to(gisTextBox, { visibility: 'visible', opacity: 1, y: 0, duration: 0.4 }, 7.5);
            if (gisTitle) tl.to(gisTitle, { opacity: 1, duration: 0.3 }, 7.7);
            if (gisBar) tl.to(gisBar, { width: '100%', duration: 0.4 }, 7.8);
            if (gisContent) tl.to(gisContent, { opacity: 1, duration: 0.4 }, 7.9);
        }

        // PHASE 7 : SORTIE GIS
        tl.to(overlayGisRef.current?.element, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 9.0);
        tl.to(gisHeroRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 9.0);

        // PHASE 8 : TRANSITION FLUIDE (contenu MangaArchive)
        const backgroundTransition = document.querySelector('.hero-to-archive-transition');
        if (backgroundTransition) {
            gsap.set(backgroundTransition, {
                opacity: 0,
                y: 60,
                filter: 'blur(8px)'
            });
            tl.to(backgroundTransition, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.6,
                ease: 'power2.inOut'
            }, 9.5);
        }

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            if (loaderRef.current) {
                gsap.to(loaderRef.current, {
                    opacity: 0, duration: 0.8, delay: 0.2,
                    onComplete: () => { if (loaderRef.current) loaderRef.current.style.display = 'none'; }
                });
            }
        });
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

    const handleAkiraHUDReady = useCallback(() => {
        readyCount.current += 1;
        if (loadedCount >= 2 && readyCount.current >= 2) setTimeout(buildTimeline, 300);
    }, [loadedCount, buildTimeline]);

    const handleGisHUDReady = useCallback(() => {
        readyCount.current += 1;
        if (loadedCount >= 2 && readyCount.current >= 2) setTimeout(buildTimeline, 300);
    }, [loadedCount, buildTimeline]);

    // Fallback si HUD onReady tardent
    useEffect(() => {
        if (loadedCount >= 2) {
            const t = setTimeout(buildTimeline, 600);
            return () => clearTimeout(t);
        }
    }, [loadedCount, buildTimeline]);

    const loadPercent = Math.min(loadedCount * 50, 100);

    return (
        <>
            {/* Overlay de transition — vide, GPU opacity uniquement */}
            <div
                ref={transitionRef}
                style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    background: '#000', opacity: 0,
                    pointerEvents: 'none', willChange: 'opacity',
                }}
            />

            {/* HUD Akira */}
            <ImmersionOverlay
                ref={overlayAkiraRef}
                side="left"
                title={t('hero.akiraTitle')}
                content={t('hero.akiraContent')}
                onReady={handleAkiraHUDReady}
            />

            {/* HUD Ghost in the Shell */}
            <ImmersionOverlay
                ref={overlayGisRef}
                side="right"
                title={t('hero.gisTitle')}
                content={t('hero.gisContent')}
                onReady={handleGisHUDReady}
            />

            {/* Loader */}
            <div ref={loaderRef} style={{
                position: 'fixed', inset: 0, zIndex: 999, background: '#0a0a0a',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '2rem'
            }}>
                <p style={{ fontFamily: 'var(--ff-family-main)', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', opacity: 0.6 }}>
                    {t('hero.loading')}
                </p>
                <div style={{ width: 'clamp(200px, 40vw, 400px)', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPercent}%`, background: 'linear-gradient(to right, #00d4ff, #ff00ff)', transition: 'width 0.4s ease' }} />
                </div>
                <p style={{ color: '#fff', opacity: 0.4 }}>{loadPercent}%</p>
            </div>

            {/* Hero section */}
            <div className="hero-section" ref={heroRef} style={{ position: 'relative', overflow: 'visible' }}>
                <div className="characters-infos">
                    <div className="akira" ref={akiraHeroRef}>
                        <Akira3D onReady={handleAkiraReady} />
                    </div>

                    <div className="container-hero">
                        {/* <div className="container-slogan" ref={sloganRef}>
                            <div className="triangle" />
                            <h1 className="slogan">{title1}</h1>
                            <h1 className="slogan">{title2}</h1>
                            <div className="under-slogan"><h2>{subtitle}</h2></div>
                        </div> */}

                        <img src="/img/grand_logo_white.svg" ref={sloganRef} alt="Logo de l'exposition - Au delà de l'humain" />

                        <div ref={scrollDownRef} className="scroll-down">
                            <h3>{t('hero.scroll')}</h3>
                            <div className="arrow"><span className="arrow-down" /></div>
                        </div>
                    </div>

                    <div className="gis" ref={gisHeroRef}>
                        <GIS3D onReady={handleGisReady} />
                    </div>
                </div>

                <div className="footer-hero-container" ref={footerHeroRef}>
                    <p>{t('hero.quote')}</p>
                    <div className="buttons-hero" ref={buttonsRef} style={{ position: 'relative', zIndex: 20 }}>
                        <a href="#" className="cursor-target">{t('hero.teaser')} <ArrowUpRight /></a>
                        <a href="#" className="cursor-target">{t('hero.tickets')} <ArrowUpRight /></a>
                    </div>
                </div>
            </div>
        </>
    );
}
