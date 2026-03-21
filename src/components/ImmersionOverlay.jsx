// import { forwardRef } from 'react';

// // // /**
// // //  * Overlay plein écran affiché pendant l'immersion.
// // //  * Rendu invisible (opacity:0, pointerEvents:none) par défaut.
// // //  * GSAP le fait apparaître au scroll.
// // //  *
// // //  * Props :
// // //  *   - side : 'left' | 'right' — côté où se place le modèle 3D
// // //  *   - title, content : texte de la section
// // //  *   - color : couleur d'accent ('cyan' | 'magenta')
// // //  *   - children : le composant 3D (Akira3D ou GIS3D)
// // //  */

// const ImmersionOverlay = forwardRef(({ side = 'left', title, content }, ref) => {
//     const isLeft = side === 'left';

//     return (
//         <div ref={ref} style={{
//             position: 'fixed', inset: 0, zIndex: 100,
//             opacity: 0, pointerEvents: 'none', color: '#fff', height: '100vh',
//         }}>
//             {/* Conteneur HUD */}
//             <div className="hud-system" style={{
//                 position: 'absolute',
//                 bottom: '20%', 
//                 // Inversion de l'ancrage selon le côté
//                 [isLeft ? 'left' : 'right']: '20%',
//                 width: '600px',
//                 height: '300px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'flex-end',
//                 alignItems: isLeft ? 'flex-start' : 'flex-end'
//             }}>
                
//                 {/* L'ENCADRÉ */}
//                 <div className="text-box-frame" style={{
//                     width: '550px',
//                     padding: '2rem',
//                     background: 'rgba(255,255,255,0.05)',
//                     border: '1px solid #fff',
//                     backdropFilter: 'blur(5px)',
//                     marginBottom: '-2px',
//                     // Si à droite (GIS), on met une marge à droite pour pousser vers la gauche
//                     [isLeft ? 'marginLeft' : 'marginRight']: '450px', 
//                     opacity: 0,
//                     transform: 'translateY(20px)',
//                     visibility: 'hidden'
//                 }}>
//                     <h2 className="overlay-title" style={{ margin: 0, fontSize: '2rem', opacity: 0, textAlign: isLeft ? 'left' : 'right' }}>
//                         {title}
//                     </h2>
//                     <div className="overlay-bar" style={{ 
//                         width: 0, height: '2px', background: '#fff', margin: '0.8rem 0',
//                         alignSelf: isLeft ? 'flex-start' : 'flex-end' // Aligne la barre selon le côté
//                     }} />
//                     <p className="overlay-content" style={{ 
//                         opacity: 0, fontSize: '0.9rem', lineHeight: 1.6, 
//                         textAlign: isLeft ? 'left' : 'right' 
//                     }}>
//                         {content}
//                     </p>
//                 </div>

//                 {/* LE TRACÉ (SVG) */}
//                 <div style={{ position: 'relative', width: '300px', height: '150px' }}>
//                      {/* Losange */}
//                     <div className="hud-pointer" style={{
//                         position: 'absolute', bottom: '-5px', 
//                         [isLeft ? 'left' : 'right']: '-5px',
//                         width: '10px', height: '10px', background: '#fff', transform: 'rotate(45deg)', opacity: 0
//                     }} />

//                     <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
//                         <line 
//                             className="hud-line"
//                             // Inversion des coordonnées X pour GIS
//                             x1={isLeft ? "0" : "295"} y1="150" 
//                             x2={isLeft ? "450" : "-150"} y2="0" 
//                             stroke="white" strokeWidth="2"
//                             style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
//                         />
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     );
// });


// export default ImmersionOverlay;

import { forwardRef } from 'react';
import '../styles/immersion-overlay.css';

const ImmersionOverlay = forwardRef(({ side = 'left', title, content }, ref) => {
    const isLeft = side === 'left';
    const hudClass = `io-hud ${isLeft ? 'io-hud--left' : 'io-hud--right'}`;

    return (
        <div ref={ref} className="io-root">

            {/* Conteneur HUD */}
            <div className={hudClass}>

                {/* Encadré texte */}
                <div className="text-box-frame">
                    <h2 className="overlay-title">{title}</h2>
                    <div className="overlay-bar" />
                    <p className="overlay-content">{content}</p>
                </div>

                {/* Tracé SVG */}
                <div className="io-svg-wrapper">

                    {/* Losange — point d'ancrage */}
                    <div className="hud-pointer" />

                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                        <line
                            className="hud-line"
                            x1={isLeft ? '0'   : '295'}
                            y1="150"
                            x2={isLeft ? '450' : '-150'}
                            y2="0"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

            </div>
        </div>
    );
});

export default ImmersionOverlay;

