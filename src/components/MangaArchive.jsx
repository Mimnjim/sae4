// // import React, { useEffect, useRef } from 'react';
// // import gsap from 'gsap';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // import '../styles/mangaArchive.css';

// // gsap.registerPlugin(ScrollTrigger);

// // export default function MangaArchive() {
// //     const triggerRef = useRef(null);
// //     const particlesRef = useRef([]);

// //     const covers = [
// //         { 
// //             url: '/img/Akira1.jpg', 
// //             title: 'Neo-Tokyo Archive',
// //             year: 2024,
// //             pages: 180
// //         },
// //         { 
// //             url: '/img/GIS1.jpg', 
// //             title: 'Neuro-Link Sketch',
// //             year: 2023,
// //             pages: 156
// //         },
// //         { 
// //             url: '/img/Akira2.jpg', 
// //             title: 'The Awakening',
// //             year: 2024,
// //             pages: 192
// //         },
// //         { 
// //             url: '/img/GIS2.webp', 
// //             title: 'Ghost Concept',
// //             year: 2023,
// //             pages: 168
// //         },
// //     ];

// //     const generateID = () => Math.random().toString(16).slice(2, 10).toUpperCase();

// //     useEffect(() => {
// //         const items = gsap.utils.toArray('.manga-card');
        
// //         console.log('🎬 Cartes trouvées:', items.length);
        
// //         if (items.length === 0) return;

// //         // Créer la timeline SANS ScrollTrigger d'abord - juste pour voir
// //         const tl = gsap.timeline({
// //             scrollTrigger: {
// //                 trigger: triggerRef.current,
// //                 start: "top top",
// //                 end: "+=2000%",  // 20X plus de scroll
// //                 pin: true,
// //                 pinSpacing: true,
// //                 scrub: 1,
// //                 markers: true,
// //             }
// //         });

// //         // Animer TOUTES les cartes pour qu'elles passent à tour de rôle
// //         items.forEach((item, i) => {
// //             // Chaque carte arrive de loin et passe devant
// //             tl.fromTo(
// //                 item,
// //                 {
// //                     z: -3000,
// //                     opacity: 0,
// //                     rotationY: (i % 2 === 0 ? 1 : -1) * 45,
// //                 },
// //                 {
// //                     z: 500,
// //                     opacity: 1,
// //                     rotationY: 0,
// //                     duration: 3,
// //                     ease: "power1.inOut"
// //                 },
// //                 i * 1  // Espacer les apparitions
// //             )
// //             .to(
// //                 item,
// //                 {
// //                     z: 3000,
// //                     opacity: 0,
// //                     duration: 2,
// //                     ease: "power2.in"
// //                 },
// //                 "+=0.5"  // Après disparition
// //             );
// //         });

// //         return () => {
// //             ScrollTrigger.getAll().forEach(trigger => trigger.kill());
// //         };
// //     }, []);

// //     useEffect(() => {
// //         const createParticles = () => {
// //             const chars = ['◆', '▪', '⬥', '●', '█', '□', '▫', '⬜'];
            
// //             for (let i = 0; i < 8; i++) {
// //                 const particle = document.createElement('div');
// //                 particle.className = 'particle';
// //                 particle.textContent = chars[Math.floor(Math.random() * chars.length)];
// //                 particle.style.left = Math.random() * window.innerWidth + 'px';
// //                 particle.style.top = Math.random() * window.innerHeight + 'px';
                
// //                 document.body.appendChild(particle);
// //                 particlesRef.current.push(particle);

// //                 gsap.to(particle, {
// //                     duration: Math.random() * 8 + 8,
// //                     y: Math.random() * 200 - 100,
// //                     opacity: 0,
// //                     repeat: -1,
// //                     yoyo: true,
// //                     ease: "sine.inOut"
// //                 });
// //             }
// //         };

// //         createParticles();

// //         return () => {
// //             particlesRef.current.forEach(p => p.remove());
// //             particlesRef.current = [];
// //         };
// //     }, []);

// //     return (
// //         <div ref={triggerRef} className="archive-viewport">
// //             <div className="archive-container">
// //                 <div className="archive-intro">
// //                     <span className="scanner-line"></span>
// //                     <h2>LES ARCHIVES DE L'EXPOSITION</h2>
// //                     <p>MANUSCRITS & PLANCHES ORIGINALES</p>
// //                 </div>

// //                 <div className="manga-wall">
// //                     {covers.map((cover, i) => (
// //                         <div key={i} className="manga-card">
// //                             <div className="scanner-bar"></div>

// //                             <div className="card-frame">
// //                                 <img 
// //                                     src={cover.url} 
// //                                     alt={cover.title}
// //                                     loading="lazy"
// //                                 />
                                
// //                                 <div className="card-info">
// //                                     <div className="card-info-item">
// //                                         <span className="card-info-label">ARCHIVE_ID</span>
// //                                         <span className="card-info-value">{generateID()}</span>
// //                                     </div>
// //                                     <div className="card-info-item">
// //                                         <span className="card-info-label">TITLE</span>
// //                                         <span className="card-info-value">{cover.title.slice(0, 14)}</span>
// //                                     </div>
// //                                     <div className="card-info-item">
// //                                         <span className="card-info-label">YEAR</span>
// //                                         <span className="card-info-value">{cover.year}</span>
// //                                     </div>
// //                                     <div className="card-info-item">
// //                                         <span className="card-info-label">PAGES</span>
// //                                         <span className="card-info-value">{cover.pages}</span>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }



// VERSION : PLUTOT PAS MAL A GARDER - FAUT JUSTE QUE JE REGLE LE BUG DU SCROLLTRIGGER QUI NE VEUT PAS MONTRER / AFFICHER
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MangaArchive() {
  const triggerRef = useRef(null);

  const covers = [
    { url: '/img/Akira1.jpg', title: 'Neo-Tokyo Archive' },
    { url: '/img/GIS1.jpg', title: 'Neuro-Link Sketch' },
    { url: '/img/Akira2.jpg', title: 'The Awakening' },
    { url: '/img/GIS2.webp', title: 'Ghost Concept' },
  ];

  useEffect(() => {
    // Le contexte GSAP permet de nettoyer proprement toutes les animations
    let ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.manga-card');

      // 1. On cache tout et on centre avant de commencer
      gsap.set(items, { 
        opacity: 0, 
        z: -2000, 
        xPercent: -50, 
        yPercent: -50,
        x: 0, 
        y: 0 
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=500%", // On donne un peu plus de "place" au scroll
          pin: true,
          scrub: 1,
          markers: true, // À ENLEVER quand ça marchera
          invalidateOnRefresh: true, // Recalcule tout si tu redimensionnes/actualises
        }
      });

      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        const xDist = isLeft ? -450 : 450;
        const yDist = (i % 2 === 0) ? -100 : 100;

        tl.fromTo(item, 
          { 
            z: -2000, 
            opacity: 0,
            x: 0, 
            y: 0 
          },
          { 
            z: 800, // Elles avancent vers nous
            opacity: 1,
            x: xDist,
            y: yDist,
            rotationY: isLeft ? 25 : -25,
            ease: "power1.inOut", // Plus fluide
          }, 
          i * 0.6 // Délai entre chaque carte
        );
      });
    }, triggerRef);

    // Force ScrollTrigger à recalculer les positions après un mini délai
    // pour être sûr que les autres composants (Hero, etc.) sont chargés.
    const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimeout);
    };
  }, []);

  return (
    <section ref={triggerRef} className="archive-viewport">
      <div className="archive-intro">
        <h2>LES ARCHIVES</h2>
        <p>MANUSCRITS ORIGINAUX</p>
      </div>
      
      <div className="manga-wall">
        {covers.map((src, i) => (
          <div key={i} className="manga-card">
            <div className="scanner-bar"></div>
            <img 
              src={src.url} 
              alt={src.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="card-info">
              <span>FILE_{i}: {src.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}