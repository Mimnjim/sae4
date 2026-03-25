// // VERSION 1

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import gsap from 'gsap';
// import '../styles/manga-archive.css';

// const entries = [
//     {
//         id:        'akira-01',
//         universe:  'Akira',
//         tagClass:  'ma-tag--akira',
//         thumbClass:'akira-active',
//         title:     'Akira',
//         subtitle:  'Katsuhiro Otomo — 1982',
//         image:     '/img/Akira1.jpg',
//         hook:      "Neo-Tokyo brûle. Sous le béton fracturé, quelque chose s'éveille que personne ne peut plus arrêter.",
//         question:  "Quand les technologies dépassent nos lois, qui contrôle encore Tetsuo ?",
//         expo:      "Planches originales tomes 1 & 2 · Storyboards film 1988 · Maquette Neo-Tokyo 1:500",
//     },
//     {
//         id:        'akira-02',
//         universe:  'Akira',
//         tagClass:  'ma-tag--akira',
//         thumbClass:'akira-active',
//         title:     'Tetsuo',
//         subtitle:  "L'Éveil — Arc II",
//         image:     '/img/Akira2.jpg',
//         hook:      "La douleur est devenue puissance. La puissance, folie. Il n'y a plus de retour possible.",
//         question:  "Implants neuraux, CRISPR, interfaces cerveau-machine — qui décide des limites ?",
//         expo:      "Séquence transformation grand format · Projection film · Dispositif sonore immersif",
//     },
//     {
//         id:        'gis-01',
//         universe:  'Ghost in the Shell',
//         tagClass:  'ma-tag--gis',
//         thumbClass:'gis-active',
//         title:     'Ghost in the Shell',
//         subtitle:  'Masamune Shirow — 1989',
//         image:     '/img/GIS1.jpg',
//         hook:      "Son corps est une machine. Ses souvenirs, peut-être des mensonges. La Major vous regarde.",
//         question:  "Les IA génèrent des souvenirs, les deepfakes effacent le réel — le ghost est parmi nous.",
//         expo:      "Planches colorisées originales · Installation miroir interactif · Film Oshii 1995",
//     },
//     {
//         id:        'gis-02',
//         universe:  'Ghost in the Shell',
//         tagClass:  'ma-tag--gis',
//         thumbClass:'gis-active',
//         title:     'Motoko Kusanagi',
//         subtitle:  'Major — Section 9',
//         image:     '/img/GIS2.webp',
//         hook:      "Elle plonge depuis un toit, invisible une fraction de seconde — puis disparaît dans le réseau.",
//         question:  "Dans un monde où nos données nous précèdent, qui possède encore son propre récit ?",
//         expo:      "Planches Section 9 · Réalité augmentée · Annotations manuscrites originales de Shirow",
//     },
// ];

// // ── Anime le contenu central au changement de carte ────────────
// function animateContent(contentEl) {
//     if (!contentEl) return;
//     gsap.fromTo(
//         contentEl.children,
//         { y: 18, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' }
//     );
// }

// export default function MangaArchive() {
//     const [active, setActive]   = useState(0);
//     const contentRef            = useRef(null);
//     const headerRef             = useRef(null);
//     const viewerRef             = useRef(null);
//     const bgImgRefs             = useRef([]);

//     const selectCard = useCallback((i) => {
//         if (i === active) return;
//         setActive(i);
//         // Anime le contenu central
//         setTimeout(() => animateContent(contentRef.current), 20);
//     }, [active]);

//     // Première animation au montage (IntersectionObserver)
//     useEffect(() => {
//         const obs = new IntersectionObserver(([entry]) => {
//             if (!entry.isIntersecting) return;

//             gsap.fromTo(headerRef.current,
//                 { y: 30, opacity: 0 },
//                 { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
//             );

//             setTimeout(() => {
//                 animateContent(contentRef.current);
//             }, 300);

//             obs.disconnect();
//         }, { threshold: 0.1 });

//         if (viewerRef.current) obs.observe(viewerRef.current);
//         return () => obs.disconnect();
//     }, []);

//     const entry = entries[active];

//     return (
//         <section className="ma-section">

//             {/* ── Header ── */}
//             <header ref={headerRef} className="ma-header">
//                 <span className="ma-eyebrow">Grand Palais Éphémère · Paris · 2025</span>
//                 <h2>Les Œuvres<br />Présentées</h2>
//                 <span className="ma-header-rule" />
//             </header>

//             {/* ── Viewer ── */}
//             <div ref={viewerRef} className="ma-viewer">

//                 {/* Fond plein écran — image de la carte active */}
//                 <div className="ma-bg">
//                     {entries.map((e, i) => (
//                         <img
//                             key={e.id}
//                             ref={el => bgImgRefs.current[i] = el}
//                             src={e.image}
//                             alt=""
//                             aria-hidden="true"
//                             style={{
//                                 opacity: i === active ? 1 : 0,
//                                 transition: 'opacity 0.6s ease',
//                             }}
//                         />
//                     ))}
//                     <div className="ma-bg-overlay" />
//                 </div>

//                 {/* ── 4 miniatures dans les coins ── */}
//                 {entries.map((e, i) => (
//                     <div
//                         key={e.id}
//                         className={`ma-thumb ${i === active ? `is-active ${e.thumbClass}` : ''}`}
//                         onClick={() => selectCard(i)}
//                         role="button"
//                         tabIndex={0}
//                         onKeyDown={(ev) => ev.key === 'Enter' && selectCard(i)}
//                         aria-label={`Sélectionner ${e.title}`}
//                         aria-pressed={i === active}
//                     >
//                         <img src={e.image} alt={e.title} loading="lazy" />

//                         {/* Label */}
//                         <div className="ma-thumb-label">
//                             {e.title}
//                             <span>{e.subtitle}</span>
//                         </div>

//                         {/* Point indicateur actif */}
//                         <div className={`ma-thumb-dot`} />
//                     </div>
//                 ))}

//                 {/* ── Zone centrale — contenu de la carte active ── */}
//                 <div className="ma-center">
//                     <div ref={contentRef} className="ma-center-content">

//                         {/* Tag */}
//                         <div className={`ma-tag ${entry.tagClass}`}>
//                             <span className="ma-tag-line" />
//                             {entry.universe}
//                             <span className="ma-tag-line" />
//                         </div>

//                         {/* Titres */}
//                         <div className="ma-titles">
//                             <h3 className="ma-title">{entry.title}</h3>
//                             <p className="ma-subtitle">{entry.subtitle}</p>
//                         </div>

//                         {/* Accroche */}
//                         <div className="ma-hook">
//                             <p>{entry.hook}</p>
//                         </div>

//                         {/* Question contemporaine */}
//                         <div className="ma-question">
//                             <span className="ma-question-label">Aujourd'hui</span>
//                             <p>{entry.question}</p>
//                         </div>

//                         {/* Info expo */}
//                         <div className="ma-expo-info">
//                             <span className="ma-expo-badge">Expo</span>
//                             <p>{entry.expo}</p>
//                         </div>

//                     </div>

//                     {/* Numéro déco */}
//                     <span className="ma-big-number">
//                         {String(active + 1).padStart(2, '0')}
//                     </span>
//                 </div>

//             </div>

//             {/* ── Footer ── */}
//             {/* <footer className="ma-footer">
//                 <p>Catalogue de l'exposition · {entries.length} œuvres au programme</p>
//             </footer> */}

//         </section>
//     );
// }


// VERSION 2 
import React from 'react';
import Grainient from './Grainient';
import { ArrowUpRight } from '@boxicons/react';
import '../styles/manga-archive2.css';

const images = [
    { src: '/img/Akira1.jpg',   alt: 'Akira — Katsuhiro Otomo',          pos: 'tl' },
    { src: '/img/GIS1.jpg',     alt: 'Ghost in the Shell — Shirow',       pos: 'tr' },
    { src: '/img/Akira2.jpg',   alt: 'Tetsuo — Arc II',                   pos: 'bl' },
    { src: '/img/GIS2.webp',    alt: 'Motoko Kusanagi — Major Section 9', pos: 'br' },
];

export default function MangaArchive() {
    return (
        <section className="ma-section">

            {/* Fond Grainient */}
            {/* <div className="ma-background">
                <Grainient
                    color1="#ba121b"
                    color2="#521414"
                    color3="#075a50"
                    timeSpeed={0.12}
                    colorBalance={0.27}
                    warpStrength={1}
                    warpFrequency={5}
                    warpSpeed={1}
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
                    saturation={1}
                    centerX={-0.08}
                    centerY={0.03}
                    zoom={0.65}
                />
            </div> */}

            {/* Overlay de lisibilité */}
            <div className="ma-overlay" />

            {/* Grille 2×2 — images dans les coins */}
            <div className="ma-grid">
                {images.map(({ src, alt, pos }) => (
                    <div key={pos} className={`ma-img-wrap ma-img-wrap--${pos}`}>
                        <img src={src} alt={alt} className="ma-img" loading="lazy" />
                    </div>
                ))}

                {/* Contenu central */}
                <div className="ma-center">

                    <p className="ma-eyebrow">Grand Palais Éphémère · Paris · 2025</p>

                    <h2 className="ma-title">Au-delà<br />de l'Humain</h2>

                    <p className="ma-hook">
                        Deux œuvres fondatrices. Deux prophéties. Une seule question
                        qui n'a jamais cessé de brûler depuis que ces planches ont été tracées.
                    </p>

                    <div className="ma-rule" />

                    <div className="ma-infos">
                        <div className="ma-info-block">
                            <span className="ma-info-label">Lieu</span>
                            <span className="ma-info-value">Grand Palais Éphémère, Paris</span>
                        </div>
                        <div className="ma-info-block">
                            <span className="ma-info-label">Dates</span>
                            <span className="ma-info-value">15 mars — 20 juillet 2025</span>
                        </div>
                        <div className="ma-info-block">
                            <span className="ma-info-label">Œuvres</span>
                            <span className="ma-info-value">Planches originales · Projections · Installations</span>
                        </div>
                        <div className="ma-info-block">
                            <span className="ma-info-label">Tarifs</span>
                            <span className="ma-info-value">14 € · Tarif réduit 9 €</span>
                        </div>
                    </div>

                    <p className="ma-pitch">
                        Otomo imaginait Neo-Tokyo en cendres. Shirow interrogeait l'âme dans une machine.
                        Quarante ans plus tard, leurs visions ne sont plus de la fiction —
                        elles sont notre quotidien. 
                        <br /><br />
                        Cette exposition vous plonge dans l'œuvre brute,
                        les planches originales, les storyboards inédits,
                        pour comprendre comment deux mangakas ont dessiné notre futur.
                    </p>

                    <a href="#tickets" className="ma-cta">
                        Réserver sa place
                        <span className="ma-cta-arrow"><ArrowUpRight /></span>
                    </a>

                </div>
            </div>

        </section>
    );
}
