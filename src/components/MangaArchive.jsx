// // import React, { useEffect, useRef } from 'react';
// // import gsap from 'gsap';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // import '../styles/global.css';

// // gsap.registerPlugin(ScrollTrigger);

// // const entries = [
// //     {
// //         id:          'akira-01',
// //         universe:    'Akira',
// //         accentColor: '#00d4ff',
// //         title:       'Akira',
// //         subtitle:    'Katsuhiro Otomo — 1982',
// //         reverse:     false,
// //         image:       '/img/Akira1.jpg',
// //         specs: [
// //             { label: 'Auteur',   value: 'Katsuhiro Otomo' },
// //             { label: 'Éditeur',  value: 'Young Magazine / Kōdansha' },
// //             { label: 'Parution', value: '1982 → 1990' },
// //             { label: 'Volumes',  value: '6 tomes — 2 182 pages' },
// //             { label: 'Genre',    value: 'Cyberpunk / Post-apocalyptique' },
// //             { label: 'Univers',  value: 'Neo-Tokyo, 2019' },
// //         ],
// //     },
// //     {
// //         id:          'gis-01',
// //         universe:    'Ghost in the Shell',
// //         accentColor: '#ff00aa',
// //         title:       'Ghost in the Shell',
// //         subtitle:    'Masamune Shirow — 1989',
// //         reverse:     true,
// //         image:       '/img/GIS1.jpg',
// //         specs: [
// //             { label: 'Auteur',   value: 'Masamune Shirow' },
// //             { label: 'Éditeur',  value: 'Kōdansha / Young Magazine' },
// //             { label: 'Parution', value: '1989 → 1997' },
// //             { label: 'Volumes',  value: '3 tomes + Man-Machine Interface' },
// //             { label: 'Genre',    value: 'Cyberpunk / Science-fiction' },
// //             { label: 'Univers',  value: 'Japon, 2029 — Section 9' },
// //         ],
// //     },
// //     {
// //         id:          'akira-02',
// //         universe:    'Akira',
// //         accentColor: '#00d4ff',
// //         title:       'Tetsuo',
// //         subtitle:    "L'Éveil — Arc II",
// //         reverse:     false,
// //         image:       '/img/Akira2.jpg',
// //         specs: [
// //             { label: 'Arc',        value: 'Mutation & Puissance' },
// //             { label: 'Tomes',      value: 'Vol. 2 — 3' },
// //             { label: 'Personnage', value: 'Tetsuo Shima' },
// //             { label: 'Thème',      value: 'Corruption du corps, identité' },
// //             { label: 'Technique',  value: '2 000 calques par planche' },
// //             { label: 'Adaptation', value: 'Film animé 1988 (Otomo)' },
// //         ],
// //     },
// //     {
// //         id:          'gis-02',
// //         universe:    'Ghost in the Shell',
// //         accentColor: '#ff00aa',
// //         title:       'Motoko Kusanagi',
// //         subtitle:    'Major — Section 9',
// //         reverse:     true,
// //         image:       '/img/GIS2.webp',
// //         specs: [
// //             { label: 'Arc',        value: 'Identité & Conscience augmentée' },
// //             { label: 'Tomes',      value: 'Vol. 1' },
// //             { label: 'Personnage', value: 'Major Motoko Kusanagi' },
// //             { label: 'Thème',      value: 'Humanité, âme, cyborg' },
// //             { label: 'Technique',  value: 'Encre + lavis, semi-réaliste' },
// //             { label: 'Adaptation', value: 'Film Mamoru Oshii 1995' },
// //         ],
// //     },
// // ];

// // export default function MangaArchive() {
// //     const sectionRef = useRef(null);
// //     const cardRefs   = useRef([]);
// //     const sepRefs    = useRef([]);

// //     useEffect(() => {
// //         // Délai pour laisser Hero finir son init + ScrollTrigger.refresh()
// //         const timer = setTimeout(() => {

// //             ScrollTrigger.refresh();

// //             const ctx = gsap.context(() => {

// //                 cardRefs.current.forEach((card, i) => {
// //                     if (!card) return;
// //                     const isReverse = entries[i].reverse;
// //                     const imgSide   = card.querySelector('[data-img]');
// //                     const textSide  = card.querySelector('[data-text]');
// //                     const rows      = card.querySelectorAll('[data-row]');

// //                     // fromTo : on part de valeurs décalées → valeurs finales visibles
// //                     // Le contenu EST visible par défaut (pas de gsap.set opacity:0)
// //                     // ScrollTrigger déclenche l'animation d'entrée seulement

// //                     const tl = gsap.timeline({
// //                         scrollTrigger: {
// //                             trigger:       card,
// //                             start:         'top 90%',   // démarre tôt pour être sûr
// //                             once:          true,         // joue une seule fois, pas de reverse
// //                         },
// //                     });

// //                     tl.fromTo(imgSide,
// //                         { opacity: 0, x: isReverse ? 60 : -60 },
// //                         { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
// //                         0
// //                     );

// //                     tl.fromTo(textSide,
// //                         { opacity: 0, x: isReverse ? -50 : 50 },
// //                         { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
// //                         0.2
// //                     );

// //                     if (rows.length) {
// //                         tl.fromTo(rows,
// //                             { opacity: 0, y: 12 },
// //                             { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: 'power2.out' },
// //                             0.5
// //                         );
// //                     }
// //                 });

// //                 sepRefs.current.forEach(sep => {
// //                     if (!sep) return;
// //                     gsap.fromTo(sep,
// //                         { opacity: 0 },
// //                         {
// //                             opacity: 1, duration: 0.6,
// //                             scrollTrigger: { trigger: sep, start: 'top 92%', once: true },
// //                         }
// //                     );
// //                 });

// //             }, sectionRef);

// //             return () => ctx.revert();

// //         }, 800); // attend que Hero soit complètement initialisé

// //         return () => clearTimeout(timer);
// //     }, []);

// //     // ─── Styles ────────────────────────────────────────────────
// //     const S = {
// //         section: {
// //             width: '100%',
// //             background: '#060606',
// //             position: 'relative',
// //         },
// //         centerLine: {
// //             position: 'absolute', top: 0, left: '50%',
// //             transform: 'translateX(-50%)',
// //             width: 1, height: '100%',
// //             background: 'linear-gradient(to bottom, transparent, rgba(186,18,27,0.18) 8%, rgba(186,18,27,0.18) 92%, transparent)',
// //             pointerEvents: 'none', zIndex: 0,
// //         },
// //         header: {
// //             textAlign: 'center',
// //             padding: 'clamp(80px,12vh,140px) 20px clamp(60px,8vh,100px)',
// //             position: 'relative', zIndex: 2,
// //         },
// //         eyebrow: {
// //             display: 'block',
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: 'clamp(0.5rem,1vw,0.65rem)',
// //             letterSpacing: 10, textTransform: 'uppercase',
// //             color: 'rgba(186,18,27,0.85)', marginBottom: 14,
// //         },
// //         h2: {
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: 'clamp(1.6rem,4vw,3rem)',
// //             fontWeight: 900, letterSpacing: 6,
// //             textTransform: 'uppercase', color: '#fff',
// //             margin: '0 0 20px', lineHeight: 1.1,
// //         },
// //         headerRule: {
// //             display: 'block', width: 50, height: 1,
// //             background: 'linear-gradient(90deg, transparent, #ba121b, transparent)',
// //             margin: '0 auto',
// //         },
// //         card: (reverse) => ({
// //             display: 'grid',
// //             gridTemplateColumns: '1fr 1fr',
// //             minHeight: '80vh',
// //             position: 'relative', zIndex: 2,
// //             // PAS d'opacity:0 ici — visible par défaut
// //         }),
// //         imgSide: {
// //             position: 'relative',
// //             overflow: 'hidden',
// //             minHeight: '60vh',
// //         },
// //         img: {
// //             position: 'absolute', inset: 0,
// //             width: '100%', height: '100%',
// //             objectFit: 'cover', objectPosition: 'center top',
// //             display: 'block',
// //             filter: 'grayscale(0.3) brightness(0.7) contrast(1.1)',
// //         },
// //         imgOverlay: (reverse) => ({
// //             position: 'absolute', inset: 0,
// //             background: reverse
// //                 ? 'linear-gradient(to left, transparent 55%, #060606 100%)'
// //                 : 'linear-gradient(to right, transparent 55%, #060606 100%)',
// //             zIndex: 1,
// //         }),
// //         scanBar: {
// //             position: 'absolute', left: 0, width: '100%', height: 2,
// //             background: 'linear-gradient(90deg, transparent, rgba(186,18,27,0.9) 50%, transparent)',
// //             boxShadow: '0 0 12px rgba(186,18,27,0.6)',
// //             zIndex: 2, animation: 'imgScanAnim 5s linear infinite', opacity: 0.6,
// //         },
// //         textSide: (reverse) => ({
// //             display: 'flex', flexDirection: 'column', justifyContent: 'center',
// //             padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,64px)',
// //             background: '#060606',
// //             position: 'relative',
// //             // En mode reverse, le text-side est la 2e colonne (côté gauche visuellement)
// //             order: reverse ? -1 : 0,
// //         }),
// //         tag: (color) => ({
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: '0.62rem', letterSpacing: 8,
// //             textTransform: 'uppercase', color,
// //             marginBottom: 18,
// //             display: 'flex', alignItems: 'center', gap: 12,
// //         }),
// //         tagLine: (color) => ({
// //             display: 'block', width: 28, height: 1,
// //             background: color, flexShrink: 0,
// //         }),
// //         title: {
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: 'clamp(2rem,4.5vw,3.8rem)',
// //             fontWeight: 900, letterSpacing: 4,
// //             textTransform: 'uppercase', color: '#fff',
// //             margin: '0 0 6px', lineHeight: 0.95,
// //         },
// //         subtitle: {
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: '0.68rem', letterSpacing: 5,
// //             textTransform: 'uppercase',
// //             color: 'rgba(255,255,255,0.3)',
// //             margin: '0 0 28px',
// //         },
// //         divider: {
// //             width: 40, height: 1,
// //             background: 'rgba(255,255,255,0.12)',
// //             marginBottom: 26,
// //         },
// //         specs: { display: 'flex', flexDirection: 'column', gap: 13 },
// //         specRow: { display: 'flex', alignItems: 'baseline', gap: 16 },
// //         specLabel: {
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: '0.58rem', letterSpacing: 4,
// //             textTransform: 'uppercase',
// //             color: 'rgba(186,18,27,0.85)',
// //             minWidth: 90, flexShrink: 0,
// //         },
// //         specValue: {
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: '0.78rem', letterSpacing: 1,
// //             color: 'rgba(255,255,255,0.72)', lineHeight: 1.5,
// //         },
// //         bigNumber: {
// //             position: 'absolute', bottom: 30, right: 30,
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: 'clamp(4rem,9vw,7rem)', fontWeight: 900,
// //             color: 'rgba(255,255,255,0.03)', lineHeight: 1,
// //             pointerEvents: 'none', userSelect: 'none', letterSpacing: -4,
// //         },
// //         separator: {
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             padding: '36px 5%', position: 'relative', zIndex: 2,
// //         },
// //         sepLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' },
// //         sepDot: {
// //             width: 4, height: 4, borderRadius: '50%',
// //             background: 'rgba(186,18,27,0.7)',
// //             boxShadow: '0 0 8px rgba(186,18,27,0.5)',
// //             margin: '0 20px',
// //         },
// //         footer: {
// //             textAlign: 'center',
// //             padding: 'clamp(60px,8vh,100px) 20px',
// //             position: 'relative', zIndex: 2,
// //         },
// //         footerText: {
// //             fontFamily: '"Courier New", monospace',
// //             fontSize: '0.6rem', letterSpacing: 6,
// //             textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
// //         },
// //     };

// //     return (
// //         <section ref={sectionRef} style={S.section}>

// //             <style>{`
// //                 @keyframes imgScanAnim {
// //                     from { top: 0; }
// //                     to   { top: 100%; }
// //                 }
// //                 @media (max-width: 768px) {
// //                     .ma-card { grid-template-columns: 1fr !important; }
// //                     .ma-img  { min-height: 55vw !important; }
// //                     .ma-text { order: 0 !important; }
// //                 }
// //             `}</style>

// //             <div style={S.centerLine} />

// //             {/* ── Header ── */}
// //             <header style={S.header}>
// //                 <span style={S.eyebrow}>Exposition Fictive · 2025</span>
// //                 <h2 style={S.h2}>Les Œuvres<br />de l'Exposition</h2>
// //                 <span style={S.headerRule} />
// //             </header>

// //             {/* ── Cartes ── */}
// //             {entries.map((entry, i) => (
// //                 <React.Fragment key={entry.id}>

// //                     <article
// //                         ref={el => cardRefs.current[i] = el}
// //                         className="ma-card"
// //                         style={S.card(entry.reverse)}
// //                     >
// //                         {/* Image */}
// //                         <div data-img="" className="ma-img" style={S.imgSide}>
// //                             <img src={entry.image} alt={entry.title} loading="lazy" style={S.img} />
// //                             <div style={S.imgOverlay(entry.reverse)} />
// //                             <div style={S.scanBar} />
// //                         </div>

// //                         {/* Texte */}
// //                         <div data-text="" className="ma-text" style={S.textSide(entry.reverse)}>

// //                             <div style={S.tag(entry.accentColor)}>
// //                                 <span style={S.tagLine(entry.accentColor)} />
// //                                 {entry.universe}
// //                             </div>

// //                             <h3 style={S.title}>{entry.title}</h3>
// //                             <p  style={S.subtitle}>{entry.subtitle}</p>
// //                             <div style={S.divider} />

// //                             <div style={S.specs}>
// //                                 {entry.specs.map((spec, j) => (
// //                                     <div data-row="" style={S.specRow} key={j}>
// //                                         <span style={S.specLabel}>{spec.label}</span>
// //                                         <span style={S.specValue}>{spec.value}</span>
// //                                     </div>
// //                                 ))}
// //                             </div>

// //                             <span style={S.bigNumber}>{String(i + 1).padStart(2, '0')}</span>
// //                         </div>
// //                     </article>

// //                     {i < entries.length - 1 && (
// //                         <div ref={el => sepRefs.current[i] = el} style={S.separator}>
// //                             <div style={S.sepLine} />
// //                             <div style={S.sepDot} />
// //                             <div style={S.sepLine} />
// //                         </div>
// //                     )}

// //                 </React.Fragment>
// //             ))}

// //             {/* ── Footer ── */}
// //             <footer style={S.footer}>
// //                 <p style={S.footerText}>Fin des archives — {entries.length} œuvres référencées</p>
// //             </footer>

// //         </section>
// //     );
// // }


// import React, { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../styles/mangaArchive.css';

// gsap.registerPlugin(ScrollTrigger);

// const entries = [
//     {
//         id:       'akira-01',
//         universe: 'Akira',
//         tagClass: 'ma-tag--akira',
//         title:    'Akira',
//         subtitle: 'Katsuhiro Otomo — 1982',
//         reverse:  false,
//         image:    '/img/Akira1.jpg',
//         specs: [
//             { label: 'Auteur',   value: 'Katsuhiro Otomo' },
//             { label: 'Éditeur',  value: 'Young Magazine / Kōdansha' },
//             { label: 'Parution', value: '1982 → 1990' },
//             { label: 'Volumes',  value: '6 tomes — 2 182 pages' },
//             { label: 'Genre',    value: 'Cyberpunk / Post-apocalyptique' },
//             { label: 'Univers',  value: 'Neo-Tokyo, 2019' },
//         ],
//     },
//     {
//         id:       'gis-01',
//         universe: 'Ghost in the Shell',
//         tagClass: 'ma-tag--gis',
//         title:    'Ghost in the Shell',
//         subtitle: 'Masamune Shirow — 1989',
//         reverse:  true,
//         image:    '/img/GIS1.jpg',
//         specs: [
//             { label: 'Auteur',   value: 'Masamune Shirow' },
//             { label: 'Éditeur',  value: 'Kōdansha / Young Magazine' },
//             { label: 'Parution', value: '1989 → 1997' },
//             { label: 'Volumes',  value: '3 tomes + Man-Machine Interface' },
//             { label: 'Genre',    value: 'Cyberpunk / Science-fiction' },
//             { label: 'Univers',  value: 'Japon, 2029 — Section 9' },
//         ],
//     },
//     {
//         id:       'akira-02',
//         universe: 'Akira',
//         tagClass: 'ma-tag--akira',
//         title:    'Tetsuo',
//         subtitle: "L'Éveil — Arc II",
//         reverse:  false,
//         image:    '/img/Akira2.jpg',
//         specs: [
//             { label: 'Arc',        value: 'Mutation & Puissance' },
//             { label: 'Tomes',      value: 'Vol. 2 — 3' },
//             { label: 'Personnage', value: 'Tetsuo Shima' },
//             { label: 'Thème',      value: 'Corruption du corps, identité' },
//             { label: 'Technique',  value: '2 000 calques par planche' },
//             { label: 'Adaptation', value: 'Film animé 1988 (Otomo)' },
//         ],
//     },
//     {
//         id:       'gis-02',
//         universe: 'Ghost in the Shell',
//         tagClass: 'ma-tag--gis',
//         title:    'Motoko Kusanagi',
//         subtitle: 'Major — Section 9',
//         reverse:  true,
//         image:    '/img/GIS2.webp',
//         specs: [
//             { label: 'Arc',        value: 'Identité & Conscience augmentée' },
//             { label: 'Tomes',      value: 'Vol. 1' },
//             { label: 'Personnage', value: 'Major Motoko Kusanagi' },
//             { label: 'Thème',      value: 'Humanité, âme, cyborg' },
//             { label: 'Technique',  value: 'Encre + lavis, semi-réaliste' },
//             { label: 'Adaptation', value: 'Film Mamoru Oshii 1995' },
//         ],
//     },
// ];

// export default function MangaArchive() {
//     const sectionRef = useRef(null);
//     const cardRefs   = useRef([]);
//     const sepRefs    = useRef([]);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             ScrollTrigger.refresh();

//             const ctx = gsap.context(() => {

//                 cardRefs.current.forEach((card, i) => {
//                     if (!card) return;
//                     const isReverse = entries[i].reverse;
//                     const imgSide   = card.querySelector('[data-img]');
//                     const textSide  = card.querySelector('[data-text]');
//                     const rows      = card.querySelectorAll('[data-row]');

//                     const tl = gsap.timeline({
//                         scrollTrigger: {
//                             trigger: card,
//                             start:   'top 90%',
//                             once:    true,
//                         },
//                     });

//                     tl.fromTo(imgSide,
//                         { opacity: 0, x: isReverse ? 60 : -60 },
//                         { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
//                         0
//                     );

//                     tl.fromTo(textSide,
//                         { opacity: 0, x: isReverse ? -50 : 50 },
//                         { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
//                         0.2
//                     );

//                     if (rows.length) {
//                         tl.fromTo(rows,
//                             { opacity: 0, y: 12 },
//                             { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: 'power2.out' },
//                             0.5
//                         );
//                     }
//                 });

//                 sepRefs.current.forEach(sep => {
//                     if (!sep) return;
//                     gsap.fromTo(sep,
//                         { opacity: 0 },
//                         {
//                             opacity: 1,
//                             duration: 0.6,
//                             scrollTrigger: { trigger: sep, start: 'top 92%', once: true },
//                         }
//                     );
//                 });

//             }, sectionRef);

//             return () => ctx.revert();
//         }, 800);

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <section ref={sectionRef} className="ma-section">

//             <div className="ma-center-line" />

//             {/* ── Header ── */}
//             <header className="ma-header">
//                 <span className="ma-eyebrow">Exposition Fictive · 2025</span>
//                 <h2>Les Œuvres<br />de l'Exposition</h2>
//                 <span className="ma-header-rule" />
//             </header>

//             {/* ── Cartes ── */}
//             {entries.map((entry, i) => (
//                 <React.Fragment key={entry.id}>

//                     <article
//                         ref={el => cardRefs.current[i] = el}
//                         className="ma-card"
//                     >
//                         {/* Image */}
//                         <div data-img="" className="ma-img">
//                             <img src={entry.image} alt={entry.title} loading="lazy" />
//                             <div className={`ma-img-overlay ma-img-overlay--${entry.reverse ? 'right' : 'left'}`} />
//                             <div className="ma-scan" />
//                         </div>

//                         {/* Texte */}
//                         <div
//                             data-text=""
//                             className={`ma-text${entry.reverse ? ' ma-text--reverse' : ''}`}
//                         >
//                             <div className={`ma-tag ${entry.tagClass}`}>
//                                 <span className="ma-tag-line" />
//                                 {entry.universe}
//                             </div>

//                             <h3 className="ma-title">{entry.title}</h3>
//                             <p  className="ma-subtitle">{entry.subtitle}</p>
//                             <div className="ma-divider" />

//                             <div className="ma-specs">
//                                 {entry.specs.map((spec, j) => (
//                                     <div data-row="" className="ma-spec-row" key={j}>
//                                         <span className="ma-spec-label">{spec.label}</span>
//                                         <span className="ma-spec-value">{spec.value}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             <span className="ma-big-number">
//                                 {String(i + 1).padStart(2, '0')}
//                             </span>
//                         </div>
//                     </article>

//                     {i < entries.length - 1 && (
//                         <div
//                             ref={el => sepRefs.current[i] = el}
//                             className="ma-separator"
//                         >
//                             <div className="ma-sep-line" />
//                             <div className="ma-sep-dot" />
//                             <div className="ma-sep-line" />
//                         </div>
//                     )}

//                 </React.Fragment>
//             ))}

//             {/* ── Footer ── */}
//             <footer className="ma-footer">
//                 <p>Fin des archives — {entries.length} œuvres référencées</p>
//             </footer>

//         </section>
//     );
// }



import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/mangaArchive.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Contenu éditorial ──────────────────────────────────────────
const entries = [
    {
        id:       'akira-01',
        universe: 'Akira',
        tagClass: 'ma-tag--akira',
        hookClass:'ma-hook--akira',
        title:    'Akira',
        subtitle: 'Katsuhiro Otomo — 1982',
        reverse:  false,
        image:    '/img/Akira1.jpg',
        // Niveau 2 — accroche immersive
        hook: "Neo-Tokyo brûle encore. Sous les néons effondrés et le béton fracturé, quelque chose s'éveille — quelque chose que personne ne peut plus arrêter. Vous êtes là, dans la rue, le sol tremble, et Tetsuo crie.",
        // Niveau 3 — fiche technique
        specs: [
            { label: 'Auteur',   value: 'Katsuhiro Otomo' },
            { label: 'Éditeur',  value: 'Young Magazine / Kōdansha' },
            { label: 'Parution', value: '1982 → 1990' },
            { label: 'Volumes',  value: '6 tomes — 2 182 pages' },
            { label: 'Genre',    value: 'Cyberpunk / Post-apocalyptique' },
            { label: 'Adaptation', value: 'Film animé, Otomo, 1988' },
        ],
    },
    {
        id:       'gis-01',
        universe: 'Ghost in the Shell',
        tagClass: 'ma-tag--gis',
        hookClass:'ma-hook--gis',
        title:    'Ghost in the Shell',
        subtitle: 'Masamune Shirow — 1989',
        reverse:  true,
        image:    '/img/GIS1.jpg',
        hook: "Son corps est une machine. Ses souvenirs, peut-être des mensonges. Pourtant quelque chose résiste — quelque chose qui refuse d'être réduit à du code. La Major vous regarde. Est-ce qu'elle voit une âme, ou un miroir ?",
        specs: [
            { label: 'Auteur',   value: 'Masamune Shirow' },
            { label: 'Éditeur',  value: 'Kōdansha / Young Magazine' },
            { label: 'Parution', value: '1989 → 1997' },
            { label: 'Volumes',  value: '3 tomes + Man-Machine Interface' },
            { label: 'Genre',    value: 'Cyberpunk / Philosophique' },
            { label: 'Adaptation', value: 'Film, Mamoru Oshii, 1995' },
        ],
    },
    {
        id:       'akira-02',
        universe: 'Akira',
        tagClass: 'ma-tag--akira',
        hookClass:'ma-hook--akira',
        title:    'Tetsuo',
        subtitle: "L'Éveil — Arc II",
        reverse:  false,
        image:    '/img/Akira2.jpg',
        hook: "La douleur est devenue puissance. La puissance, folie. Il n'y a plus de retour possible — chaque cellule de son corps hurle et se transforme. Vous ressentez la chaleur. Vous ne pouvez pas détourner les yeux.",
        specs: [
            { label: 'Arc',        value: 'Mutation & Puissance' },
            { label: 'Tomes',      value: 'Vol. 2 — 3' },
            { label: 'Personnage', value: 'Tetsuo Shima' },
            { label: 'Thème',      value: 'Corruption du corps, identité' },
            { label: 'Technique',  value: '2 000 calques par planche' },
            { label: 'Format',     value: 'Noir & blanc, grand format' },
        ],
    },
    {
        id:       'gis-02',
        universe: 'Ghost in the Shell',
        tagClass: 'ma-tag--gis',
        hookClass:'ma-hook--gis',
        title:    'Motoko Kusanagi',
        subtitle: 'Major — Section 9',
        reverse:  true,
        image:    '/img/GIS2.webp',
        hook: "Elle plonge dans la ville depuis un toit, nue dans la pluie cybernétique, invisible une fraction de seconde — puis disparaît. Quelque part dans le réseau, son ghost continue de chercher ce qu'elle est vraiment.",
        specs: [
            { label: 'Arc',        value: 'Identité & Conscience augmentée' },
            { label: 'Tomes',      value: 'Vol. 1' },
            { label: 'Personnage', value: 'Major Motoko Kusanagi' },
            { label: 'Thème',      value: 'Humanité, âme, cyborg' },
            { label: 'Technique',  value: 'Encre + lavis, semi-réaliste' },
            { label: 'Format',     value: 'Couleurs, annotations d\'auteur' },
        ],
    },
];

// ─── Composant ──────────────────────────────────────────────────
export default function MangaArchive() {
    const sectionRef = useRef(null);
    const cardRefs   = useRef([]);
    const sepRefs    = useRef([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();

            const ctx = gsap.context(() => {

                cardRefs.current.forEach((card, i) => {
                    if (!card) return;
                    const isReverse = entries[i].reverse;
                    const imgSide   = card.querySelector('[data-img]');
                    const tag       = card.querySelector('[data-tag]');
                    const title     = card.querySelector('[data-title]');
                    const hook      = card.querySelector('[data-hook]');
                    const specs     = card.querySelector('[data-specs]');
                    const rows      = card.querySelectorAll('[data-row]');

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: card,
                            start:   'top 88%',
                            once:    true,
                        },
                    });

                    // Image glisse depuis son côté
                    tl.fromTo(imgSide,
                        { opacity: 0, x: isReverse ? 70 : -70 },
                        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
                        0
                    );

                    // Tag
                    tl.fromTo(tag,
                        { opacity: 0, y: 16 },
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                        0.25
                    );

                    // Titre
                    tl.fromTo(title,
                        { opacity: 0, y: 28 },
                        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
                        0.35
                    );

                    // Accroche — légère montée
                    tl.fromTo(hook,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                        0.55
                    );

                    // Fiche technique — lignes en stagger
                    tl.fromTo(specs,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.01 },
                        0.85
                    );
                    if (rows.length) {
                        tl.fromTo(rows,
                            { opacity: 0, x: isReverse ? -14 : 14 },
                            { opacity: 1, x: 0, duration: 0.3, stagger: 0.07, ease: 'power2.out' },
                            0.85
                        );
                    }
                });

                // Séparateurs
                sepRefs.current.forEach(sep => {
                    if (!sep) return;
                    gsap.fromTo(sep,
                        { opacity: 0 },
                        {
                            opacity: 1, duration: 0.6,
                            scrollTrigger: { trigger: sep, start: 'top 92%', once: true },
                        }
                    );
                });

            }, sectionRef);

            return () => ctx.revert();
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section ref={sectionRef} className="ma-section">

            <div className="ma-center-line" />

            {/* ── Header ── */}
            <header className="ma-header">
                <span className="ma-eyebrow">Exposition Fictive · 2025</span>
                <h2>Les Œuvres<br />de l'Exposition</h2>
                <span className="ma-header-rule" />
            </header>

            {/* ── Cartes alternées ── */}
            {entries.map((entry, i) => (
                <React.Fragment key={entry.id}>

                    <article
                        ref={el => cardRefs.current[i] = el}
                        className="ma-card"
                    >
                        {/* ── IMAGE (Niveau 1 visuel) ── */}
                        <div data-img="" className="ma-img">
                            <img
                                src={entry.image}
                                alt={entry.title}
                                loading="lazy"
                            />
                            <div className={`ma-img-overlay ma-img-overlay--${entry.reverse ? 'right' : 'left'}`} />
                            <div className="ma-scan" />
                            <span className="ma-img-index">
                                Archive {String(i + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                            </span>
                        </div>

                        {/* ── TEXTE ── */}
                        <div className={`ma-text${entry.reverse ? ' ma-text--reverse' : ''}`}>

                            {/* Niveau 1 — Identité */}
                            <div data-tag="" className={`ma-tag ${entry.tagClass}`}>
                                <span className="ma-tag-line" />
                                {entry.universe}
                            </div>

                            <h3 data-title="" className="ma-title">{entry.title}</h3>
                            <p className="ma-subtitle">{entry.subtitle}</p>

                            {/* Niveau 2 — Accroche immersive */}
                            <div data-hook="" className={`ma-hook ${entry.hookClass}`}>
                                <p className="ma-hook-text">{entry.hook}</p>
                            </div>

                            {/* Niveau 3 — Fiche technique */}
                            <div data-specs="" className="ma-specs">
                                {entry.specs.map((spec, j) => (
                                    <div data-row="" className="ma-spec-row" key={j}>
                                        <span className="ma-spec-label">{spec.label}</span>
                                        <span className="ma-spec-value">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            <span className="ma-big-number">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </article>

                    {i < entries.length - 1 && (
                        <div
                            ref={el => sepRefs.current[i] = el}
                            className="ma-separator"
                        >
                            <div className="ma-sep-line" />
                            <div className="ma-sep-dot" />
                            <div className="ma-sep-line" />
                        </div>
                    )}

                </React.Fragment>
            ))}

            {/* ── Footer ── */}
            <footer className="ma-footer">
                <p>Fin des archives — {entries.length} œuvres référencées</p>
            </footer>

        </section>
    );
}
