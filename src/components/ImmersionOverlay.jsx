import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import DecryptedText from '../animations/DecryptedText';
import '../styles/immersion-overlay.css';

const ImmersionOverlay = forwardRef(({ side = 'left', title, content, onReady }, ref) => {
    const titleRef   = useRef(null);
    const contentRef = useRef(null);
    const rootRef    = useRef(null);

    // Expose element et replay() via ref
    useImperativeHandle(ref, () => {
        const node = rootRef.current;
        if (!node) return { element: null, replay: () => {} };
        return {
            element: node,
            replay: () => {
                titleRef.current?.replay?.();
                contentRef.current?.replay?.();
            }
        };
    }, []);

    useEffect(() => {
        onReady?.();
    }, [onReady]);

    const isLeft   = side === 'left';
    const hudClass = `io-hud ${isLeft ? 'io-hud--left' : 'io-hud--right'}`;

    return (
        <div ref={rootRef} className="io-root">
            <div className={hudClass}>
                <div className="text-box-frame">

                    <h2 className="overlay-title">
                        <DecryptedText
                            ref={titleRef}
                            text={title}
                            speed={5}
                            charsPerFrame={3}
                            maxIterations={12}
                            sequential={true}
                            animateOn="never"
                            characters="アシネツ!?"
                            className="revealed"
                            parentClassName="all-letters"
                            encryptedClassName="encrypted"
                        />
                    </h2>

                    <div className="overlay-bar" />

                    <p className="overlay-content">
                        <DecryptedText
                            ref={contentRef}
                            text={content}
                            speed={30}
                            charsPerFrame={10}
                            maxIterations={12}
                            sequential={true}
                            animateOn="never"
                            characters="アシネツ!?"
                            className="revealed"
                            parentClassName="all-letters"
                            encryptedClassName="encrypted"
                        />
                    </p>
                </div>

                <div className="io-svg-wrapper">
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
