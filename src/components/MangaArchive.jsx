// // // // import React, { useEffect, useRef } from 'react';
// // // // import gsap from 'gsap';
// // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // // // import '../styles/mangaArchive.css';

// // // // gsap.registerPlugin(ScrollTrigger);

// // // // export default function MangaArchive() {
// // // //     const triggerRef = useRef(null);
// // // //     const particlesRef = useRef([]);

// // // //     const covers = [
// // // //         { 
// // // //             url: '/img/Akira1.jpg', 
// // // //             title: 'Neo-Tokyo Archive',
// // // //             year: 2024,
// // // //             pages: 180
// // // //         },
// // // //         { 
// // // //             url: '/img/GIS1.jpg', 
// // // //             title: 'Neuro-Link Sketch',
// // // //             year: 2023,
// // // //             pages: 156
// // // //         },
// // // //         { 
// // // //             url: '/img/Akira2.jpg', 
// // // //             title: 'The Awakening',
// // // //             year: 2024,
// // // //             pages: 192
// // // //         },
// // // //         { 
// // // //             url: '/img/GIS2.webp', 
// // // //             title: 'Ghost Concept',
// // // //             year: 2023,
// // // //             pages: 168
// // // //         },
// // // //     ];

// // // //     const generateID = () => Math.random().toString(16).slice(2, 10).toUpperCase();

// // // //     useEffect(() => {
// // // //         const items = gsap.utils.toArray('.manga-card');
        
// // // //         console.log('🎬 Cartes trouvées:', items.length);
        
// // // //         if (items.length === 0) return;

// // // //         // Créer la timeline SANS ScrollTrigger d'abord - juste pour voir
// // // //         const tl = gsap.timeline({
// // // //             scrollTrigger: {
// // // //                 trigger: triggerRef.current,
// // // //                 start: "top top",
// // // //                 end: "+=2000%",  // 20X plus de scroll
// // // //                 pin: true,
// // // //                 pinSpacing: true,
// // // //                 scrub: 1,
// // // //                 markers: true,
// // // //             }
// // // //         });

// // // //         // Animer TOUTES les cartes pour qu'elles passent à tour de rôle
// // // //         items.forEach((item, i) => {
// // // //             // Chaque carte arrive de loin et passe devant
// // // //             tl.fromTo(
// // // //                 item,
// // // //                 {
// // // //                     z: -3000,
// // // //                     opacity: 0,
// // // //                     rotationY: (i % 2 === 0 ? 1 : -1) * 45,
// // // //                 },
// // // //                 {
// // // //                     z: 500,
// // // //                     opacity: 1,
// // // //                     rotationY: 0,
// // // //                     duration: 3,
// // // //                     ease: "power1.inOut"
// // // //                 },
// // // //                 i * 1  // Espacer les apparitions
// // // //             )
// // // //             .to(
// // // //                 item,
// // // //                 {
// // // //                     z: 3000,
// // // //                     opacity: 0,
// // // //                     duration: 2,
// // // //                     ease: "power2.in"
// // // //                 },
// // // //                 "+=0.5"  // Après disparition
// // // //             );
// // // //         });

// // // //         return () => {
// // // //             ScrollTrigger.getAll().forEach(trigger => trigger.kill());
// // // //         };
// // // //     }, []);

// // // //     useEffect(() => {
// // // //         const createParticles = () => {
// // // //             const chars = ['◆', '▪', '⬥', '●', '█', '□', '▫', '⬜'];
            
// // // //             for (let i = 0; i < 8; i++) {
// // // //                 const particle = document.createElement('div');
// // // //                 particle.className = 'particle';
// // // //                 particle.textContent = chars[Math.floor(Math.random() * chars.length)];
// // // //                 particle.style.left = Math.random() * window.innerWidth + 'px';
// // // //                 particle.style.top = Math.random() * window.innerHeight + 'px';
                
// // // //                 document.body.appendChild(particle);
// // // //                 particlesRef.current.push(particle);

// // // //                 gsap.to(particle, {
// // // //                     duration: Math.random() * 8 + 8,
// // // //                     y: Math.random() * 200 - 100,
// // // //                     opacity: 0,
// // // //                     repeat: -1,
// // // //                     yoyo: true,
// // // //                     ease: "sine.inOut"
// // // //                 });
// // // //             }
// // // //         };

// // // //         createParticles();

// // // //         return () => {
// // // //             particlesRef.current.forEach(p => p.remove());
// // // //             particlesRef.current = [];
// // // //         };
// // // //     }, []);

// // // //     return (
// // // //         <div ref={triggerRef} className="archive-viewport">
// // // //             <div className="archive-container">
// // // //                 <div className="archive-intro">
// // // //                     <span className="scanner-line"></span>
// // // //                     <h2>LES ARCHIVES DE L'EXPOSITION</h2>
// // // //                     <p>MANUSCRITS & PLANCHES ORIGINALES</p>
// // // //                 </div>

// // // //                 <div className="manga-wall">
// // // //                     {covers.map((cover, i) => (
// // // //                         <div key={i} className="manga-card">
// // // //                             <div className="scanner-bar"></div>

// // // //                             <div className="card-frame">
// // // //                                 <img 
// // // //                                     src={cover.url} 
// // // //                                     alt={cover.title}
// // // //                                     loading="lazy"
// // // //                                 />
                                
// // // //                                 <div className="card-info">
// // // //                                     <div className="card-info-item">
// // // //                                         <span className="card-info-label">ARCHIVE_ID</span>
// // // //                                         <span className="card-info-value">{generateID()}</span>
// // // //                                     </div>
// // // //                                     <div className="card-info-item">
// // // //                                         <span className="card-info-label">TITLE</span>
// // // //                                         <span className="card-info-value">{cover.title.slice(0, 14)}</span>
// // // //                                     </div>
// // // //                                     <div className="card-info-item">
// // // //                                         <span className="card-info-label">YEAR</span>
// // // //                                         <span className="card-info-value">{cover.year}</span>
// // // //                                     </div>
// // // //                                     <div className="card-info-item">
// // // //                                         <span className="card-info-label">PAGES</span>
// // // //                                         <span className="card-info-value">{cover.pages}</span>
// // // //                                     </div>
// // // //                                 </div>
// // // //                             </div>
// // // //                         </div>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }



// // // VERSION : PLUTOT PAS MAL A GARDER - FAUT JUSTE QUE JE REGLE LE BUG DU SCROLLTRIGGER QUI NE VEUT PAS MONTRER / AFFICHER
// // import React, { useEffect, useRef } from 'react';
// // import gsap from 'gsap';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // gsap.registerPlugin(ScrollTrigger);

// // export default function MangaArchive() {
// //   const triggerRef = useRef(null);

// //   const covers = [
// //     { url: '/img/Akira1.jpg', title: 'Neo-Tokyo Archive' },
// //     { url: '/img/GIS1.jpg', title: 'Neuro-Link Sketch' },
// //     { url: '/img/Akira2.jpg', title: 'The Awakening' },
// //     { url: '/img/GIS2.webp', title: 'Ghost Concept' },
// //   ];

// //   useEffect(() => {
// //     // Le contexte GSAP permet de nettoyer proprement toutes les animations
// //     let ctx = gsap.context(() => {
// //       const items = gsap.utils.toArray('.manga-card');

// //       // 1. On cache tout et on centre avant de commencer
// //       gsap.set(items, { 
// //         opacity: 0, 
// //         z: -2000, 
// //         xPercent: -50, 
// //         yPercent: -50,
// //         x: 0, 
// //         y: 0 
// //       });

// //       const tl = gsap.timeline({
// //         scrollTrigger: {
// //           trigger: triggerRef.current,
// //           start: "top top",
// //           end: "+=500%", // On donne un peu plus de "place" au scroll
// //           pin: true,
// //           scrub: 1,
// //           markers: true, // À ENLEVER quand ça marchera
// //           invalidateOnRefresh: true, // Recalcule tout si tu redimensionnes/actualises
// //         }
// //       });

// //       items.forEach((item, i) => {
// //         const isLeft = i % 2 === 0;
// //         const xDist = isLeft ? -450 : 450;
// //         const yDist = (i % 2 === 0) ? -100 : 100;

// //         tl.fromTo(item, 
// //           { 
// //             z: -2000, 
// //             opacity: 0,
// //             x: 0, 
// //             y: 0 
// //           },
// //           { 
// //             z: 800, // Elles avancent vers nous
// //             opacity: 1,
// //             x: xDist,
// //             y: yDist,
// //             rotationY: isLeft ? 25 : -25,
// //             ease: "power1.inOut", // Plus fluide
// //           }, 
// //           i * 0.6 // Délai entre chaque carte
// //         );
// //       });
// //     }, triggerRef);

// //     // Force ScrollTrigger à recalculer les positions après un mini délai
// //     // pour être sûr que les autres composants (Hero, etc.) sont chargés.
// //     const refreshTimeout = setTimeout(() => {
// //         ScrollTrigger.refresh();
// //     }, 500);

// //     return () => {
// //       ctx.revert();
// //       clearTimeout(refreshTimeout);
// //     };
// //   }, []);

// //   return (
// //     <section ref={triggerRef} className="archive-viewport">
// //       <div className="archive-intro">
// //         <h2>LES ARCHIVES</h2>
// //         <p>MANUSCRITS ORIGINAUX</p>
// //       </div>
      
// //       <div className="manga-wall">
// //         {covers.map((src, i) => (
// //           console.log('📸 Rendu de:', src.title), // Debug pour vérifier que les données sont bien utilisées
// //           <div key={i} className="manga-card">
// //             <div className="scanner-bar"></div>
// //             <img 
// //               src={src.url} 
// //               alt={src.title} 
// //               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// //             />
// //             <div className="card-info">
// //               <span>FILE_{i}: {src.title}</span>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// import React, { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../styles/mangaarchive.css';

// gsap.registerPlugin(ScrollTrigger);

// // ─── Données éditoriales ────────────────────────────────────────
// const entries = [
//     {
//         id:       'akira-01',
//         universe: 'Akira',
//         tagClass: 'tag--akira',
//         title:    'Akira',
//         subtitle: 'Katsuhiro Otomo — 1982',
//         reverse:  false,
//         image:    '/img/Akira1.jpg',
//         specs: [
//             { label: 'Auteur',     value: 'Katsuhiro Otomo' },
//             { label: 'Éditeur JP', value: 'Young Magazine / Kōdansha' },
//             { label: 'Parution',   value: '1982 → 1990' },
//             { label: 'Volumes',    value: '6 tomes (2 182 pages)' },
//             { label: 'Genre',      value: 'Cyberpunk / Post-apocalyptique' },
//             { label: 'Univers',    value: 'Neo-Tokyo, 2019' },
//         ],
//     },
//     {
//         id:       'gis-01',
//         universe: 'Ghost in the Shell',
//         tagClass: 'tag--gis',
//         title:    'Ghost in\nthe Shell',
//         subtitle: 'Masamune Shirow — 1989',
//         reverse:  true,
//         image:    '/img/GIS1.jpg',
//         specs: [
//             { label: 'Auteur',     value: 'Masamune Shirow' },
//             { label: 'Éditeur JP', value: 'Kōdansha / Young Magazine' },
//             { label: 'Parution',   value: '1989 → 1997' },
//             { label: 'Volumes',    value: '3 tomes + Man-Machine Interface' },
//             { label: 'Genre',      value: 'Cyberpunk / Science-fiction' },
//             { label: 'Univers',    value: 'Japon, 2029 — Section 9' },
//         ],
//     },
//     {
//         id:       'akira-02',
//         universe: 'Akira',
//         tagClass: 'tag--akira',
//         title:    'Tetsuo',
//         subtitle: 'L\'Éveil — Arc II',
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
//         tagClass: 'tag--gis',
//         title:    'Motoko\nKusanagi',
//         subtitle: 'Major — Section 9',
//         reverse:  true,
//         image:    '/img/GIS2.webp',
//         specs: [
//             { label: 'Arc',        value: 'Identité & Conscience augmentée' },
//             { label: 'Tomes',      value: 'Vol. 1 — Ghost in the Shell' },
//             { label: 'Personnage', value: 'Major Motoko Kusanagi' },
//             { label: 'Thème',      value: 'Humanité, âme, cyborg' },
//             { label: 'Technique',  value: 'Encre + lavis, semi-réaliste' },
//             { label: 'Adaptation', value: 'Film Mamoru Oshii 1995' },
//         ],
//     },
// ];

// // ─── Composant ──────────────────────────────────────────────────
// export default function MangaArchive() {
//     const sectionRef    = useRef(null);
//     const headerRef     = useRef(null);
//     const cardRefs      = useRef([]);
//     const separatorRefs = useRef([]);
//     const footerRef     = useRef(null);

//     useEffect(() => {
//         const ctx = gsap.context(() => {

//             // ── 1. En-tête ──────────────────────────────────────
//             gsap.from(headerRef.current, {
//                 // opacity:    0,
//                 y:          50,
//                 duration:   1,
//                 ease:       'power3.out',
//                 scrollTrigger: {
//                     trigger:  headerRef.current,
//                     start:    'top 80%',
//                     end:      'bottom 60%',
//                     toggleActions: 'play none none reverse',
//                 },
//             });

//             // ── 2. Cartes — révélation progressive ──────────────
//             cardRefs.current.forEach((card, i) => {
//                 if (!card) return;

//                 const isReverse  = entries[i].reverse;
//                 const imgSide    = card.querySelector('.archive-card__image-side');
//                 const imgEl      = card.querySelector('img');
//                 const tag        = card.querySelector('.archive-card__tag');
//                 const title      = card.querySelector('.archive-card__title');
//                 const subtitle   = card.querySelector('.archive-card__subtitle');
//                 const divider    = card.querySelector('.archive-card__divider');
//                 const specs      = card.querySelector('.archive-card__specs');

//                 // Direction d'entrée selon alternance
//                 const xImage = isReverse ? 60  : -60;
//                 const xText  = isReverse ? -60 :  60;

//                 const tl = gsap.timeline({
//                     scrollTrigger: {
//                         trigger:       card,
//                         start:         'top 75%',
//                         end:           'bottom 30%',
//                         toggleActions: 'play none none reverse',
//                     },
//                 });

//                 // Carte entière
//                 tl.to(card, { opacity: 1, duration: 0.01 }, 0);

//                 // Image glisse depuis le côté
//                 tl.fromTo(imgSide,
//                     { x: xImage, opacity: 0 },
//                     { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
//                     0
//                 );

//                 // Parallax léger sur l'image elle-même
//                 if (imgEl) {
//                     gsap.fromTo(imgEl,
//                         { scale: 1.08 },
//                         {
//                             scale: 1,
//                             ease: 'none',
//                             scrollTrigger: {
//                                 trigger:  card,
//                                 start:    'top bottom',
//                                 end:      'bottom top',
//                                 scrub:    true,
//                             },
//                         }
//                     );
//                 }

//                 // Tag
//                 tl.to(tag,
//                     { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
//                     0.2
//                 );

//                 // Titre
//                 tl.to(title,
//                     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
//                     0.35
//                 );

//                 // Sous-titre
//                 tl.to(subtitle,
//                     { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
//                     0.5
//                 );

//                 // Divider
//                 tl.to(divider,
//                     { opacity: 1, duration: 0.4, ease: 'none' },
//                     0.6
//                 );

//                 // Specs : chaque ligne en stagger
//                 if (specs) {
//                     const rows = specs.querySelectorAll('.spec-row');
//                     tl.to(specs,
//                         { opacity: 1, y: 0, duration: 0.01 },
//                         0.65
//                     );
//                     tl.fromTo(rows,
//                         { opacity: 0, x: xText * 0.4 },
//                         {
//                             opacity:  1,
//                             x:        0,
//                             duration: 0.4,
//                             stagger:  0.07,
//                             ease:     'power2.out',
//                         },
//                         0.65
//                     );
//                 }
//             });

//             // ── 3. Séparateurs ──────────────────────────────────
//             separatorRefs.current.forEach(sep => {
//                 if (!sep) return;
//                 gsap.to(sep, {
//                     opacity: 1,
//                     duration: 0.8,
//                     ease: 'none',
//                     scrollTrigger: {
//                         trigger: sep,
//                         start:   'top 85%',
//                         toggleActions: 'play none none reverse',
//                     },
//                 });
//             });

//             // ── 4. Footer ────────────────────────────────────────
//             if (footerRef.current) {
//                 gsap.to(footerRef.current, {
//                     opacity: 1,
//                     duration: 1,
//                     ease: 'power2.out',
//                     scrollTrigger: {
//                         trigger: footerRef.current,
//                         start:   'top 85%',
//                         toggleActions: 'play none none reverse',
//                     },
//                 });
//             }

//         }, sectionRef); // ← contexte GSAP scoped à la section

//         return () => ctx.revert(); // nettoyage propre sans toucher Hero
//     }, []);

//     return (
//         <section ref={sectionRef} className="manga-archive">

//             {/* ── En-tête ── */}
//             <header ref={headerRef} className="archive-section-header">
//                 <span className="eyebrow">Exposition Fictive · 2025</span>
//                 <h2>Les Œuvres<br />de l'Exposition</h2>
//                 <span className="header-line" />
//             </header>

//             {/* ── Cartes alternées ── */}
//             {entries.map((entry, i) => (
//                 <React.Fragment key={entry.id}>

//                     <article
//                         ref={el => cardRefs.current[i] = el}
//                         className={`archive-card${entry.reverse ? ' reverse' : ''}`}
//                     >
//                         {/* Côté image */}
//                         <div className="archive-card__image-side">
//                             <img src={entry.image} alt={entry.title.replace('\n', ' ')} loading="lazy" />
//                             <div className="img-scan" />
//                         </div>

//                         {/* Côté texte */}
//                         <div className="archive-card__text-side">

//                             <span className={`archive-card__tag ${entry.tagClass}`}>
//                                 {entry.universe}
//                             </span>

//                             <h3 className="archive-card__title" style={{ whiteSpace: 'pre-line' }}>
//                                 {entry.title}
//                             </h3>

//                             <p className="archive-card__subtitle">
//                                 {entry.subtitle}
//                             </p>

//                             <div className="archive-card__divider" />

//                             <div className="archive-card__specs">
//                                 {entry.specs.map((spec, j) => (
//                                     <div className="spec-row" key={j}>
//                                         <span className="spec-label">{spec.label}</span>
//                                         <span className="spec-value">{spec.value}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Numéro décoratif */}
//                             <span className="archive-card__number">
//                                 {String(i + 1).padStart(2, '0')}
//                             </span>

//                         </div>
//                     </article>

//                     {/* Séparateur entre cartes (pas après la dernière) */}
//                     {i < entries.length - 1 && (
//                         <div
//                             ref={el => separatorRefs.current[i] = el}
//                             className="archive-separator"
//                         >
//                             <div className="sep-dot" />
//                         </div>
//                     )}

//                 </React.Fragment>
//             ))}

//             {/* ── Footer ── */}
//             <footer ref={footerRef} className="archive-footer">
//                 <p>Fin des archives — {entries.length} œuvres référencées</p>
//             </footer>

//         </section>
//     );
// }


import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/global.css';

gsap.registerPlugin(ScrollTrigger);

const entries = [
    {
        id:          'akira-01',
        universe:    'Akira',
        accentColor: '#00d4ff',
        title:       'Akira',
        subtitle:    'Katsuhiro Otomo — 1982',
        reverse:     false,
        image:       '/img/Akira1.jpg',
        specs: [
            { label: 'Auteur',   value: 'Katsuhiro Otomo' },
            { label: 'Éditeur',  value: 'Young Magazine / Kōdansha' },
            { label: 'Parution', value: '1982 → 1990' },
            { label: 'Volumes',  value: '6 tomes — 2 182 pages' },
            { label: 'Genre',    value: 'Cyberpunk / Post-apocalyptique' },
            { label: 'Univers',  value: 'Neo-Tokyo, 2019' },
        ],
    },
    {
        id:          'gis-01',
        universe:    'Ghost in the Shell',
        accentColor: '#ff00aa',
        title:       'Ghost in the Shell',
        subtitle:    'Masamune Shirow — 1989',
        reverse:     true,
        image:       '/img/GIS1.jpg',
        specs: [
            { label: 'Auteur',   value: 'Masamune Shirow' },
            { label: 'Éditeur',  value: 'Kōdansha / Young Magazine' },
            { label: 'Parution', value: '1989 → 1997' },
            { label: 'Volumes',  value: '3 tomes + Man-Machine Interface' },
            { label: 'Genre',    value: 'Cyberpunk / Science-fiction' },
            { label: 'Univers',  value: 'Japon, 2029 — Section 9' },
        ],
    },
    {
        id:          'akira-02',
        universe:    'Akira',
        accentColor: '#00d4ff',
        title:       'Tetsuo',
        subtitle:    "L'Éveil — Arc II",
        reverse:     false,
        image:       '/img/Akira2.jpg',
        specs: [
            { label: 'Arc',        value: 'Mutation & Puissance' },
            { label: 'Tomes',      value: 'Vol. 2 — 3' },
            { label: 'Personnage', value: 'Tetsuo Shima' },
            { label: 'Thème',      value: 'Corruption du corps, identité' },
            { label: 'Technique',  value: '2 000 calques par planche' },
            { label: 'Adaptation', value: 'Film animé 1988 (Otomo)' },
        ],
    },
    {
        id:          'gis-02',
        universe:    'Ghost in the Shell',
        accentColor: '#ff00aa',
        title:       'Motoko Kusanagi',
        subtitle:    'Major — Section 9',
        reverse:     true,
        image:       '/img/GIS2.webp',
        specs: [
            { label: 'Arc',        value: 'Identité & Conscience augmentée' },
            { label: 'Tomes',      value: 'Vol. 1' },
            { label: 'Personnage', value: 'Major Motoko Kusanagi' },
            { label: 'Thème',      value: 'Humanité, âme, cyborg' },
            { label: 'Technique',  value: 'Encre + lavis, semi-réaliste' },
            { label: 'Adaptation', value: 'Film Mamoru Oshii 1995' },
        ],
    },
];

export default function MangaArchive() {
    const sectionRef = useRef(null);
    const cardRefs   = useRef([]);
    const sepRefs    = useRef([]);

    useEffect(() => {
        // Délai pour laisser Hero finir son init + ScrollTrigger.refresh()
        const timer = setTimeout(() => {

            ScrollTrigger.refresh();

            const ctx = gsap.context(() => {

                cardRefs.current.forEach((card, i) => {
                    if (!card) return;
                    const isReverse = entries[i].reverse;
                    const imgSide   = card.querySelector('[data-img]');
                    const textSide  = card.querySelector('[data-text]');
                    const rows      = card.querySelectorAll('[data-row]');

                    // fromTo : on part de valeurs décalées → valeurs finales visibles
                    // Le contenu EST visible par défaut (pas de gsap.set opacity:0)
                    // ScrollTrigger déclenche l'animation d'entrée seulement

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger:       card,
                            start:         'top 90%',   // démarre tôt pour être sûr
                            once:          true,         // joue une seule fois, pas de reverse
                        },
                    });

                    tl.fromTo(imgSide,
                        { opacity: 0, x: isReverse ? 60 : -60 },
                        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
                        0
                    );

                    tl.fromTo(textSide,
                        { opacity: 0, x: isReverse ? -50 : 50 },
                        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
                        0.2
                    );

                    if (rows.length) {
                        tl.fromTo(rows,
                            { opacity: 0, y: 12 },
                            { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: 'power2.out' },
                            0.5
                        );
                    }
                });

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

        }, 800); // attend que Hero soit complètement initialisé

        return () => clearTimeout(timer);
    }, []);

    // ─── Styles ────────────────────────────────────────────────
    const S = {
        section: {
            width: '100%',
            background: '#060606',
            position: 'relative',
        },
        centerLine: {
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: 1, height: '100%',
            background: 'linear-gradient(to bottom, transparent, rgba(186,18,27,0.18) 8%, rgba(186,18,27,0.18) 92%, transparent)',
            pointerEvents: 'none', zIndex: 0,
        },
        header: {
            textAlign: 'center',
            padding: 'clamp(80px,12vh,140px) 20px clamp(60px,8vh,100px)',
            position: 'relative', zIndex: 2,
        },
        eyebrow: {
            display: 'block',
            fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(0.5rem,1vw,0.65rem)',
            letterSpacing: 10, textTransform: 'uppercase',
            color: 'rgba(186,18,27,0.85)', marginBottom: 14,
        },
        h2: {
            fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(1.6rem,4vw,3rem)',
            fontWeight: 900, letterSpacing: 6,
            textTransform: 'uppercase', color: '#fff',
            margin: '0 0 20px', lineHeight: 1.1,
        },
        headerRule: {
            display: 'block', width: 50, height: 1,
            background: 'linear-gradient(90deg, transparent, #ba121b, transparent)',
            margin: '0 auto',
        },
        card: (reverse) => ({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '80vh',
            position: 'relative', zIndex: 2,
            // PAS d'opacity:0 ici — visible par défaut
        }),
        imgSide: {
            position: 'relative',
            overflow: 'hidden',
            minHeight: '60vh',
        },
        img: {
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            display: 'block',
            filter: 'grayscale(0.3) brightness(0.7) contrast(1.1)',
        },
        imgOverlay: (reverse) => ({
            position: 'absolute', inset: 0,
            background: reverse
                ? 'linear-gradient(to left, transparent 55%, #060606 100%)'
                : 'linear-gradient(to right, transparent 55%, #060606 100%)',
            zIndex: 1,
        }),
        scanBar: {
            position: 'absolute', left: 0, width: '100%', height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(186,18,27,0.9) 50%, transparent)',
            boxShadow: '0 0 12px rgba(186,18,27,0.6)',
            zIndex: 2, animation: 'imgScanAnim 5s linear infinite', opacity: 0.6,
        },
        textSide: (reverse) => ({
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,64px)',
            background: '#060606',
            position: 'relative',
            // En mode reverse, le text-side est la 2e colonne (côté gauche visuellement)
            order: reverse ? -1 : 0,
        }),
        tag: (color) => ({
            fontFamily: '"Courier New", monospace',
            fontSize: '0.62rem', letterSpacing: 8,
            textTransform: 'uppercase', color,
            marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 12,
        }),
        tagLine: (color) => ({
            display: 'block', width: 28, height: 1,
            background: color, flexShrink: 0,
        }),
        title: {
            fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(2rem,4.5vw,3.8rem)',
            fontWeight: 900, letterSpacing: 4,
            textTransform: 'uppercase', color: '#fff',
            margin: '0 0 6px', lineHeight: 0.95,
        },
        subtitle: {
            fontFamily: '"Courier New", monospace',
            fontSize: '0.68rem', letterSpacing: 5,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            margin: '0 0 28px',
        },
        divider: {
            width: 40, height: 1,
            background: 'rgba(255,255,255,0.12)',
            marginBottom: 26,
        },
        specs: { display: 'flex', flexDirection: 'column', gap: 13 },
        specRow: { display: 'flex', alignItems: 'baseline', gap: 16 },
        specLabel: {
            fontFamily: '"Courier New", monospace',
            fontSize: '0.58rem', letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'rgba(186,18,27,0.85)',
            minWidth: 90, flexShrink: 0,
        },
        specValue: {
            fontFamily: '"Courier New", monospace',
            fontSize: '0.78rem', letterSpacing: 1,
            color: 'rgba(255,255,255,0.72)', lineHeight: 1.5,
        },
        bigNumber: {
            position: 'absolute', bottom: 30, right: 30,
            fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(4rem,9vw,7rem)', fontWeight: 900,
            color: 'rgba(255,255,255,0.03)', lineHeight: 1,
            pointerEvents: 'none', userSelect: 'none', letterSpacing: -4,
        },
        separator: {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '36px 5%', position: 'relative', zIndex: 2,
        },
        sepLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' },
        sepDot: {
            width: 4, height: 4, borderRadius: '50%',
            background: 'rgba(186,18,27,0.7)',
            boxShadow: '0 0 8px rgba(186,18,27,0.5)',
            margin: '0 20px',
        },
        footer: {
            textAlign: 'center',
            padding: 'clamp(60px,8vh,100px) 20px',
            position: 'relative', zIndex: 2,
        },
        footerText: {
            fontFamily: '"Courier New", monospace',
            fontSize: '0.6rem', letterSpacing: 6,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
        },
    };

    return (
        <section ref={sectionRef} style={S.section}>

            <style>{`
                @keyframes imgScanAnim {
                    from { top: 0; }
                    to   { top: 100%; }
                }
                @media (max-width: 768px) {
                    .ma-card { grid-template-columns: 1fr !important; }
                    .ma-img  { min-height: 55vw !important; }
                    .ma-text { order: 0 !important; }
                }
            `}</style>

            <div style={S.centerLine} />

            {/* ── Header ── */}
            <header style={S.header}>
                <span style={S.eyebrow}>Exposition Fictive · 2025</span>
                <h2 style={S.h2}>Les Œuvres<br />de l'Exposition</h2>
                <span style={S.headerRule} />
            </header>

            {/* ── Cartes ── */}
            {entries.map((entry, i) => (
                <React.Fragment key={entry.id}>

                    <article
                        ref={el => cardRefs.current[i] = el}
                        className="ma-card"
                        style={S.card(entry.reverse)}
                    >
                        {/* Image */}
                        <div data-img="" className="ma-img" style={S.imgSide}>
                            <img src={entry.image} alt={entry.title} loading="lazy" style={S.img} />
                            <div style={S.imgOverlay(entry.reverse)} />
                            <div style={S.scanBar} />
                        </div>

                        {/* Texte */}
                        <div data-text="" className="ma-text" style={S.textSide(entry.reverse)}>

                            <div style={S.tag(entry.accentColor)}>
                                <span style={S.tagLine(entry.accentColor)} />
                                {entry.universe}
                            </div>

                            <h3 style={S.title}>{entry.title}</h3>
                            <p  style={S.subtitle}>{entry.subtitle}</p>
                            <div style={S.divider} />

                            <div style={S.specs}>
                                {entry.specs.map((spec, j) => (
                                    <div data-row="" style={S.specRow} key={j}>
                                        <span style={S.specLabel}>{spec.label}</span>
                                        <span style={S.specValue}>{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            <span style={S.bigNumber}>{String(i + 1).padStart(2, '0')}</span>
                        </div>
                    </article>

                    {i < entries.length - 1 && (
                        <div ref={el => sepRefs.current[i] = el} style={S.separator}>
                            <div style={S.sepLine} />
                            <div style={S.sepDot} />
                            <div style={S.sepLine} />
                        </div>
                    )}

                </React.Fragment>
            ))}

            {/* ── Footer ── */}
            <footer style={S.footer}>
                <p style={S.footerText}>Fin des archives — {entries.length} œuvres référencées</p>
            </footer>

        </section>
    );
}
