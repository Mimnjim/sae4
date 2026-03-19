import { forwardRef } from 'react';

/**
 * Overlay plein écran affiché pendant l'immersion.
 * Rendu invisible (opacity:0, pointerEvents:none) par défaut.
 * GSAP le fait apparaître au scroll.
 *
 * Props :
 *   - side : 'left' | 'right' — côté où se place le modèle 3D
 *   - title, content : texte de la section
 *   - color : couleur d'accent ('cyan' | 'magenta')
 *   - children : le composant 3D (Akira3D ou GIS3D)
 */
const ImmersionOverlay = forwardRef(({
    side = 'left',
    title,
    content,
    color = 'cyan',
    children,
}, ref) => {
    const isLeft = side === 'left';
    // const accent = color === 'cyan' ? '#00d4ff' : '#ff00ff';

    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                flexDirection: isLeft ? 'row' : 'row-reverse',
                opacity: 0,
                pointerEvents: 'none',
                // background: 'var(--color-grey, #c7c7c7)',
                height: '100vh',
            }}
        >
            {/* ── Colonne modèle 3D (50%) ── */}
            <div style={{
                width: '50%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {children}

                {/* Liseré d'accent sur le bord intérieur */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    [isLeft ? 'right' : 'left']: 0,
                    width: '2px',
                    height: '100%',
                    // background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
                    background: `linear-gradient(to bottom, transparent, #fff, transparent)`,
                    opacity: 0.6,
                }} />
            </div>

            {/* ── Colonne contenu (50%) ── */}
            <div style={{
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 5rem',
                position: 'relative',
            }}>
                {/* Titre */}
                <h2
                    className="overlay-title"
                    style={{
                        fontFamily: 'var(--ff-family-main)',
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '-1px',
                        margin: '0 0 1.5rem',
                        color: '#fff',
                        opacity: 0,
                        transform: 'translateY(30px)',
                    }}
                >
                    {title}
                </h2>

                {/* Trait décoratif */}
                <div style={{
                    width: '60px',
                    height: '3px',
                    background: '#fff',
                    marginBottom: '2rem',
                    opacity: 0,
                }}
                    className="overlay-bar"
                />

                {/* Contenu */}
                <p
                    className="overlay-content"
                    style={{
                        fontFamily: 'var(--ff-family-main)',
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        lineHeight: 1.8,
                        letterSpacing: '1px',
                        margin: 0,
                        maxWidth: '480px',
                        opacity: 0,
                        transform: 'translateY(20px)',
                    }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
});

ImmersionOverlay.displayName = 'ImmersionOverlay';
export default ImmersionOverlay;
