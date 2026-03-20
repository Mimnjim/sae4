import { forwardRef } from 'react';

// // /**
// //  * Overlay plein écran affiché pendant l'immersion.
// //  * Rendu invisible (opacity:0, pointerEvents:none) par défaut.
// //  * GSAP le fait apparaître au scroll.
// //  *
// //  * Props :
// //  *   - side : 'left' | 'right' — côté où se place le modèle 3D
// //  *   - title, content : texte de la section
// //  *   - color : couleur d'accent ('cyan' | 'magenta')
// //  *   - children : le composant 3D (Akira3D ou GIS3D)
// //  */
// // const ImmersionOverlay = forwardRef(({
// //     side = 'left',
// //     title,
// //     content,
// //     color = 'cyan',
// //     children,
// // }, ref) => {
// //     const isLeft = side === 'left';
// //     // const accent = color === 'cyan' ? '#00d4ff' : '#ff00ff';

// //     return (
// //         <div
// //             ref={ref}
// //             style={{
// //                 position: 'fixed',
// //                 inset: 0,
// //                 zIndex: 100,
// //                 display: 'flex',
// //                 flexDirection: isLeft ? 'row' : 'row-reverse',
// //                 opacity: 0,
// //                 pointerEvents: 'none',
// //                 color: '#fff',
// //                 // background: 'var(--color-grey, #c7c7c7)',
// //                 height: '100vh',
// //             }}
// //         >
// //             {/* ── Colonne modèle 3D (50%) ── */}
// //             <div style={{
// //                 width: '50%',
// //                 height: '100%',
// //                 position: 'relative',
// //                 overflow: 'hidden',
// //             }}>
// //                 {children}

// //                 {/* Liseré d'accent sur le bord intérieur */}
// //                 <div style={{
// //                     position: 'absolute',
// //                     top: 0,
// //                     [isLeft ? 'right' : 'left']: 0,
// //                     width: '2px',
// //                     height: '100%',
// //                     // background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
// //                     background: `linear-gradient(to bottom, transparent, #fff, transparent)`,
// //                     opacity: 0.6,
// //                 }} />
// //             </div>

// //             {/* ── Colonne contenu (50%) ── */}
// //             <div style={{
// //                 width: '50%',
// //                 height: '100%',
// //                 display: 'flex',
// //                 flexDirection: 'column',
// //                 justifyContent: 'center',
// //                 padding: '0 5rem',
// //                 position: 'relative',
// //                 color: '#fff',
// //             }}>
// //                 {/* Titre */}
// //                 <h2
// //                     className="overlay-title"
// //                     style={{
// //                         fontFamily: 'var(--ff-family-main)',
// //                         fontSize: 'clamp(3rem, 5vw, 5rem)',
// //                         fontWeight: 900,
// //                         textTransform: 'uppercase',
// //                         letterSpacing: '-1px',
// //                         margin: '0 0 1.5rem',
// //                         color: '#fff',
// //                         opacity: 0,
// //                         transform: 'translateY(30px)',
// //                     }}
// //                 >
// //                     {title}
// //                 </h2>

// //                 {/* Trait décoratif */}
// //                 <div style={{
// //                     width: '60px',
// //                     height: '3px',
// //                     background: '#fff',
// //                     marginBottom: '2rem',
// //                     opacity: 0,
// //                 }}
// //                     className="overlay-bar"
// //                 />

// //                 {/* Contenu */}
// //                 <p
// //                     className="overlay-content"
// //                     style={{
// //                         fontFamily: 'var(--ff-family-main)',
// //                         fontSize: '1.1rem',
// //                         fontWeight: 300,
// //                         lineHeight: 1.8,
// //                         letterSpacing: '1px',
// //                         margin: 0,
// //                         maxWidth: '480px',
// //                         opacity: 0,
// //                         transform: 'translateY(20px)',
// //                         color: '#fff'
// //                     }}
// //                 >
// //                     {content}
// //                 </p>
// //             </div>
// //         </div>
// //     );
// // });

// // ImmersionOverlay.displayName = 'ImmersionOverlay';
// // export default ImmersionOverlay;

// import { forwardRef } from 'react';

// const ImmersionOverlay = forwardRef(({
//     side = 'left',
//     title,
//     content,
// }, ref) => {
//     const isLeft = side === 'left';

//     return (
//         <div
//             ref={ref}
//             style={{
//                 position: 'fixed',
//                 inset: 0,
//                 zIndex: 100,
//                 display: 'flex',
//                 flexDirection: isLeft ? 'row' : 'row-reverse',
//                 opacity: 0, // Géré par GSAP
//                 pointerEvents: 'none',
//                 color: '#fff',
//                 height: '100vh',
//             }}
//         >
//             {/* Colonne 3D : Zone de départ de la flèche */}
//             <div style={{ width: '50%', height: '100%', position: 'relative' }}>
//                 <div style={{
//                     position: 'absolute',
//                     top: '50%',
//                     [isLeft ? 'right' : 'left']: '0',
//                     width: '100%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: isLeft ? 'flex-end' : 'flex-start',
//                     transform: 'translateY(-50%)'
//                 }}>
//                     {/* Le Trait (HUD LINE) */}
//                     <div className="hud-line" style={{
//                         width: '0%', // Animé de 0 à 100%
//                         height: '1px',
//                         background: 'rgba(255,255,255,0.8)',
//                         boxShadow: '0 0 8px rgba(255,255,255,0.5)'
//                     }} />
                    
//                     {/* La Flèche / Pointeur (HUD POINTER) */}
//                     <div className="hud-pointer" style={{
//                         width: '8px',
//                         height: '8px',
//                         background: '#fff',
//                         transform: 'rotate(45deg)',
//                         flexShrink: 0,
//                         opacity: 0
//                     }} />
//                 </div>
//             </div>

//             {/* Colonne Contenu : Apparaît en fondu */}
//             <div className="overlay-column-text" style={{
//                 width: '50%',
//                 height: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 padding: '0 5rem',
//                 background: isLeft 
//                     ? 'linear-gradient(to right, rgba(255,255,255,0.03), transparent)' 
//                     : 'linear-gradient(to left, rgba(255,255,255,0.03), transparent)',
//                 borderLeft: isLeft ? '1px solid rgba(255,255,255,0.1)' : 'none',
//                 borderRight: !isLeft ? '1px solid rgba(255,255,255,0.1)' : 'none',
//             }}>
//                 <h2 className="overlay-title" style={{ 
//                     fontSize: 'clamp(2rem, 4vw, 4rem)', 
//                     textTransform: 'uppercase',
//                     margin: '0 0 1rem',
//                     opacity: 0 
//                 }}>
//                     {title}
//                 </h2>
                
//                 <div className="overlay-bar" style={{ 
//                     width: '0px', 
//                     height: '2px', 
//                     background: '#fff', 
//                     marginBottom: '1.5rem' 
//                 }} />
                
//                 <p className="overlay-content" style={{ 
//                     maxWidth: '450px', 
//                     lineHeight: '1.6',
//                     opacity: 0 
//                 }}>
//                     {content}
//                 </p>
//             </div>
//         </div>
//     );
// });

// ImmersionOverlay.displayName = 'ImmersionOverlay';
// export default ImmersionOverlay; // L'export qui manquait ou buggait


// import { forwardRef } from 'react';

// const ImmersionOverlay = forwardRef(({
//     side = 'left',
//     title,
//     content,
// }, ref) => {
//     const isLeft = side === 'left';

//     return (
//         <div
//             ref={ref}
//             style={{
//                 position: 'fixed',
//                 inset: 0,
//                 zIndex: 100,
//                 display: 'flex',
//                 flexDirection: isLeft ? 'row' : 'row-reverse',
//                 opacity: 0, // Géré par GSAP
//                 pointerEvents: 'none',
//                 color: '#fff',
//                 height: '100vh',
//             }}
//         >
//             {/* Colonne 3D (Vide, sert d'ancrage pour le HUD) */}
//             <div style={{ width: '50%', height: '50%', position: 'relative' }}>
//                 {/* Section HUD pour Akira (side="left") */}
//                 <div className="hud-anchor" style={{
//                     position: 'absolute',
//                     bottom: '5%', // Positionne le losange en bas
//                     left: '30%',   // Positionne le losange à gauche
//                     display: 'flex',
//                     alignItems: 'center',
//                     width: '80%',  // Longueur max de la ligne
//                     zIndex: 10,
//                     // margin: 'auto',
//                     // transform: 'translateX(-50%)' // Centre l'ancre horizontalement
//                     }}>
                    
//                     {/* Le Losange (Point de départ) */}
//                     <div className="hud-pointer" style={{
//                         width: '10px',
//                         height: '10px',
//                         background: '#fff',
//                         transform: 'rotate(45deg)',
//                         flexShrink: 0,
//                         opacity: 0,
//                         boxShadow: '0 0 10px #fff'
//                     }} />

//                     {/* La Ligne (Se déploie vers la droite) */}
//                     <div className="hud-line" style={{
//                         width: '0%', 
//                         height: '1px',
//                         background: '#fff',
//                         boxShadow: '0 0 8px rgba(255,255,255,0.8)',
//                         // TRÈS IMPORTANT : définit le point de départ de l'expansion à gauche
//                         transformOrigin: 'left center' 
//                     }} />
//                 </div>
//             </div>

//             {/* Colonne Contenu : La boîte de données progressive */}
//             <div className="overlay-column-text" style={{
//                 width: '50%',
//                 height: '50%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 // alignItems: 'center',
//                 margin: 'auto',
//                 padding: '0 5rem',
//                 position: 'relative',
//                 background: isLeft 
//                     ? 'linear-gradient(to right, rgba(255,255,255,0.05), transparent)' 
//                     : 'linear-gradient(to left, rgba(255,255,255,0.05), transparent)',
//                 // Bordure d'accentuation qui va se déployer
//                 border: '1px solid rgba(255,255,255,1)',
//             }}>
//                 {/* Cadre de texte progressive (on l'anime de hauteur 0 à 100%) */}
//                 <div className="text-box-frame" style={{
//                     position: 'absolute',
//                     top: '50%', // Positionné au centre
//                     left: '5rem',
//                     right: '5rem',
//                     height: '0px', // Animé par GSAP
//                     transform: 'translateY(-50%)',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     background: 'rgba(255,255,255,0.02)',
//                     visibility: 'hidden' // Cache au départ
//                 }} />

//                 <div style={{ position: 'relative', zIndex: 2 }}>
//                     <h2 className="overlay-title" style={{ 
//                         fontFamily: 'var(--ff-family-main)', 
//                         fontSize: 'clamp(2rem, 4vw, 4rem)', 
//                         fontWeight: 900, textTransform: 'uppercase',
//                         margin: '0 0 1rem', opacity: 0 // Géré par GSAP
//                     }}>
//                         {title}
//                     </h2>
                    
//                     <div className="overlay-bar" style={{ 
//                         width: '0px', height: '2px', background: '#fff', marginBottom: '1.5rem' // Géré par GSAP
//                     }} />
                    
//                     <p className="overlay-content" style={{ 
//                         fontFamily: 'var(--ff-family-main)', 
//                         maxWidth: '450px', fontWeight: 300,
//                         lineHeight: '1.7', opacity: 0 // Géré par GSAP
//                     }}>
//                         {content}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// });

// ImmersionOverlay.displayName = 'ImmersionOverlay';
// export default ImmersionOverlay;

// const ImmersionOverlay = forwardRef(({ side = 'left', title, content }, ref) => {
//     const isLeft = side === 'left';

//     return (
//         <div ref={ref} style={{
//             position: 'fixed', inset: 0, zIndex: 100,
//             display: 'flex', flexDirection: isLeft ? 'row' : 'row-reverse',
//             opacity: 0, pointerEvents: 'none', color: '#fff', height: '100vh',
//         }}>
//             {/* Colonne 3D */}
//             <div style={{ width: '50%', height: '100%', position: 'relative' }}>
//                 <div className="hud-anchor" style={{
//                     position: 'absolute',
//                     bottom: '15%', // Départ en bas
//                     [isLeft ? 'left' : 'right']: '25%', // Départ vers le perso
//                     width: '300px', height: '200px', // Zone de tracé
//                 }}>
//                     {/* Le Losange */}
//                     <div className="hud-pointer" style={{
//                         position: 'absolute', bottom: 0, [isLeft ? 'left' : 'right']: 0,
//                         width: '10px', height: '10px', background: '#fff',
//                         transform: 'rotate(45deg)', opacity: 0, zIndex: 2
//                     }} />

//                     {/* La Ligne montante en diagonale (SVG) */}
//                     <svg style={{ 
//                         position: 'absolute', 
//                         width: '100%', // On élargit pour être sûr d'atteindre la colonne de texte
//                         height: '100%', 
//                         overflow: 'visible',
//                         pointerEvents: 'none' 
//                     }}>
//                         <line 
//                             className="hud-line"
//                             // x1, y1 : Départ au niveau du losange
//                             x1={isLeft ? "5" : "-5"} y1="200" 
//                             // x2, y2 : Arrivée plus loin et plus haut
//                             x2={isLeft ? "800" : "-800"} y2="-50" 
//                             stroke="white" 
//                             strokeWidth="1.5"
//                             style={{ 
//                                 // On met 2000 pour être CERTAIN que la ligne est couverte d'un seul bloc
//                                 strokeDasharray: 2000, 
//                                 strokeDashoffset: 2000 
//                             }} 
//                         />
//                     </svg>
//                 </div>
//             </div>

//             {/* Colonne Contenu */}
//             <div className="overlay-column-text" style={{
//                 width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
//             }}>
//                 <div className="text-box-frame" style={{
//                     position: 'relative',
//                     padding: '3rem',
//                     border: '1px solid #fff',
//                     background: 'rgba(255,255,255,0.05)',
//                     clipPath: 'inset(100% 0 0 0)', // Pour l'apparition "créée par la flèche"
//                     opacity: 0
//                 }}>
//                     <h2 className="overlay-title" style={{ margin: 0, textTransform: 'uppercase', opacity: 0 }}>{title}</h2>
//                     <div className="overlay-bar" style={{ width: 0, height: '2px', background: '#fff', margin: '1rem 0' }} />
//                     <p className="overlay-content" style={{ opacity: 0, margin: 0 }}>{content}</p>
//                 </div>
//             </div>
//         </div>
//     );
// });



// POUR AKIRA C BON
// const ImmersionOverlay = forwardRef(({ side = 'left', title, content }, ref) => {
//     const isLeft = side === 'left';

//     return (
//         <div ref={ref} style={{
//             position: 'fixed', inset: 0, zIndex: 100,
//             opacity: 0, pointerEvents: 'none', color: '#fff', height: '100vh',
//         }}>
//             {/* L'Ancre HUD : Elle contient TOUT le système (Losange + Ligne + Box) */}
//             <div className="hud-system" style={{
//                 position: 'absolute',
//                 bottom: '20%', 
//                 [isLeft ? 'left' : 'right']: '20%',
//                 width: '600px', // Largeur totale du déploiement
//                 height: '300px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'flex-end',
//                 alignItems: isLeft ? 'flex-start' : 'flex-end'
//             }}>
                
//                 {/* L'ENCADRÉ : Placé pile en haut à droite (pour Akira) du tracé */}
//                 <div className="text-box-frame" style={{
//                     width: '550px',
//                     padding: '2rem',
//                     background: 'rgba(255,255,255,0.05)',
//                     border: '1px solid #fff',
//                     backdropFilter: 'blur(5px)',
//                     marginBottom: '2px', // Pour "coller" à la ligne
//                     [isLeft ? 'marginLeft' : 'marginRight']: '450px', // Décalage pour être au bout de la diagonale
//                     opacity: 0,
//                     transform: 'translateY(20px)', // Petit effet de montée au pop
//                     visibility: 'hidden'
//                 }}>
//                     <h2 className="overlay-title" style={{ margin: 0, fontSize: '2rem', opacity: 0 }}>{title}</h2>
//                     <div className="overlay-bar" style={{ width: 0, height: '2px', background: '#fff', margin: '0.8rem 0' }} />
//                     <p className="overlay-content" style={{ opacity: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{content}</p>
//                 </div>

//                 {/* LE TRACÉ (SVG) */}
//                 <div style={{ position: 'relative', width: '300px', height: '150px' }}>
//                      {/* Losange de départ */}
//                     <div className="hud-pointer" style={{
//                         position: 'absolute', bottom: '-5px', [isLeft ? 'left' : 'right']: '-5px',
//                         width: '10px', height: '10px', background: '#fff', transform: 'rotate(45deg)', opacity: 0
//                     }} />

//                     <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
//                         <line 
//                             className="hud-line"
//                             x1={isLeft ? "0" : "300"} y1="150" 
//                             x2={isLeft ? "450" : "50"} y2="0" 
//                             stroke="white" strokeWidth="2"
//                             style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
//                         />
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     );
// });

const ImmersionOverlay = forwardRef(({ side = 'left', title, content }, ref) => {
    const isLeft = side === 'left';

    return (
        <div ref={ref} style={{
            position: 'fixed', inset: 0, zIndex: 100,
            opacity: 0, pointerEvents: 'none', color: '#fff', height: '100vh',
        }}>
            {/* Conteneur HUD */}
            <div className="hud-system" style={{
                position: 'absolute',
                bottom: '20%', 
                // Inversion de l'ancrage selon le côté
                [isLeft ? 'left' : 'right']: '20%',
                width: '600px',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: isLeft ? 'flex-start' : 'flex-end'
            }}>
                
                {/* L'ENCADRÉ */}
                <div className="text-box-frame" style={{
                    width: '550px',
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid #fff',
                    backdropFilter: 'blur(5px)',
                    marginBottom: '-2px',
                    // Si à droite (GIS), on met une marge à droite pour pousser vers la gauche
                    [isLeft ? 'marginLeft' : 'marginRight']: '450px', 
                    opacity: 0,
                    transform: 'translateY(20px)',
                    visibility: 'hidden'
                }}>
                    <h2 className="overlay-title" style={{ margin: 0, fontSize: '2rem', opacity: 0, textAlign: isLeft ? 'left' : 'right' }}>
                        {title}
                    </h2>
                    <div className="overlay-bar" style={{ 
                        width: 0, height: '2px', background: '#fff', margin: '0.8rem 0',
                        alignSelf: isLeft ? 'flex-start' : 'flex-end' // Aligne la barre selon le côté
                    }} />
                    <p className="overlay-content" style={{ 
                        opacity: 0, fontSize: '0.9rem', lineHeight: 1.6, 
                        textAlign: isLeft ? 'left' : 'right' 
                    }}>
                        {content}
                    </p>
                </div>

                {/* LE TRACÉ (SVG) */}
                <div style={{ position: 'relative', width: '300px', height: '150px' }}>
                     {/* Losange */}
                    <div className="hud-pointer" style={{
                        position: 'absolute', bottom: '-5px', 
                        [isLeft ? 'left' : 'right']: '-5px',
                        width: '10px', height: '10px', background: '#fff', transform: 'rotate(45deg)', opacity: 0
                    }} />

                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                        <line 
                            className="hud-line"
                            // Inversion des coordonnées X pour GIS
                            x1={isLeft ? "0" : "295"} y1="150" 
                            x2={isLeft ? "450" : "-150"} y2="0" 
                            stroke="white" strokeWidth="2"
                            style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
});


export default ImmersionOverlay;
