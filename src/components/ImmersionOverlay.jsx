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

