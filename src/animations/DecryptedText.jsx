import { useEffect, useState, useRef, useMemo, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'motion/react';

const styles = {
    wrapper: { display: 'inline-block', whiteSpace: 'pre-wrap' },
    charSpan: { 
        display: 'inline-block', 
        lineHeight: '1', 
        height: '1em',
        verticalAlign: 'middle',
        fontFeatureSettings: '"vert" 0',
        transition: 'opacity 0.05s ease, color 0.05s ease',
        overflow: 'hidden'
    },
    srOnly: {
        position: 'absolute', width: '1px', height: '1px',
        padding: 0, margin: '-1px', overflow: 'hidden',
        clip: 'rect(0,0,0,0)', border: 0
    }
};

const DecryptedText = forwardRef(function DecryptedText({
    text,
    speed = 15,
    charsPerFrame = 1,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    clickMode = 'once',
    ...props
}, ref) {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating]   = useState(false);
    const [revealedIndices, setRevealedIndices] = useState(new Set());
    const [hasAnimated, setHasAnimated]   = useState(false);
    const [isDecrypted, setIsDecrypted]   = useState(animateOn !== 'click');
    const [direction, setDirection]       = useState('forward');

    const containerRef = useRef(null);
    const orderRef     = useRef([]);
    const pointerRef   = useRef(0);
    const lastUpdateRef = useRef(0);
    const cachedCharsRef = useRef({});

    const availableChars = useMemo(() => {
        return useOriginalCharsOnly
            ? Array.from(new Set(text.split(''))).filter(c => c !== ' ')
            : characters.split('');
    }, [useOriginalCharsOnly, text, characters]);

    const shuffleText = useCallback((originalText, currentRevealed) => {
        return originalText.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (currentRevealed.has(i)) return originalText[i];
            // Cache pour éviter recalcul inutile
            if (!cachedCharsRef.current[i] || Math.random() > 0.8) {
                cachedCharsRef.current[i] = availableChars[Math.floor(Math.random() * availableChars.length)];
            }
            return cachedCharsRef.current[i];
        }).join('');
    }, [availableChars]);

    const computeOrder = useCallback(len => {
        const order = [];
        if (len <= 0) return order;
        if (revealDirection === 'start') { for (let i = 0; i < len; i++) order.push(i); return order; }
        if (revealDirection === 'end')   { for (let i = len - 1; i >= 0; i--) order.push(i); return order; }
        const middle = Math.floor(len / 2);
        let offset = 0;
        while (order.length < len) {
            if (offset % 2 === 0) { const idx = middle + offset / 2; if (idx >= 0 && idx < len) order.push(idx); }
            else                  { const idx = middle - Math.ceil(offset / 2); if (idx >= 0 && idx < len) order.push(idx); }
            offset++;
        }
        return order.slice(0, len);
    }, [revealDirection]);

    const fillAllIndices = useCallback(() => {
        const s = new Set();
        for (let i = 0; i < text.length; i++) s.add(i);
        return s;
    }, [text]);

    const removeRandomIndices = useCallback((set, count) => {
        const arr = Array.from(set);
        for (let i = 0; i < count && arr.length > 0; i++) arr.splice(Math.floor(Math.random() * arr.length), 1);
        return new Set(arr);
    }, []);

    const encryptInstantly = useCallback(() => {
        const emptySet = new Set();
        setRevealedIndices(emptySet);
        setDisplayText(shuffleText(text, emptySet));
        setIsDecrypted(false);
    }, [text, shuffleText]);

    const triggerDecrypt = useCallback(() => {
        if (sequential) {
            orderRef.current  = computeOrder(text.length);
            pointerRef.current = 0;
            setRevealedIndices(new Set());
        } else {
            setRevealedIndices(new Set());
        }
        setDirection('forward');
        setIsAnimating(true);
    }, [sequential, computeOrder, text.length]);

    const triggerReverse = useCallback(() => {
        if (sequential) {
            orderRef.current  = computeOrder(text.length).slice().reverse();
            pointerRef.current = 0;
            setRevealedIndices(fillAllIndices());
            setDisplayText(shuffleText(text, fillAllIndices()));
        } else {
            setRevealedIndices(fillAllIndices());
            setDisplayText(shuffleText(text, fillAllIndices()));
        }
        setDirection('reverse');
        setIsAnimating(true);
    }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);

    // ── replay() : repart de zéro ────────────────────────────────
    // Appelé depuis ImmersionOverlay.replay() → lui-même appelé
    // depuis Hero.jsx via GSAP onStart quand le HUD devient visible.
    const replay = useCallback(() => {
        setIsAnimating(false);
        setIsDecrypted(false);
        setRevealedIndices(new Set());
        setDisplayText(shuffleText(text, new Set()));
        setDirection('forward');
        setHasAnimated(false);
        // Lance après un micro-tick pour que le reset soit effectif
        setTimeout(() => {
            if (sequential) {
                orderRef.current   = computeOrder(text.length);
                pointerRef.current = 0;
            }
            setIsAnimating(true);
        }, 30);
    }, [text, shuffleText, sequential, computeOrder]);

    // Expose replay() via ref
    useImperativeHandle(ref, () => ({ replay }), [replay]);

    useEffect(() => {
        if (!isAnimating) return;
        let animationFrameId;
        let currentIteration = 0;

        const getNextIndex = revealedSet => {
            const len = text.length;
            if (revealDirection === 'start') return revealedSet.size;
            if (revealDirection === 'end')   return len - 1 - revealedSet.size;
            const middle    = Math.floor(len / 2);
            const offset    = Math.floor(revealedSet.size / 2);
            const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
            if (nextIndex >= 0 && nextIndex < len && !revealedSet.has(nextIndex)) return nextIndex;
            for (let i = 0; i < len; i++) if (!revealedSet.has(i)) return i;
            return 0;
        };

        const animate = (timestamp) => {
            if (timestamp - lastUpdateRef.current >= speed) {
                lastUpdateRef.current = timestamp;

                setRevealedIndices(prevRevealed => {
                    if (sequential) {
                        if (direction === 'forward') {
                            if (prevRevealed.size < text.length) {
                                const newRevealed  = new Set(prevRevealed);
                                // Révéler charsPerFrame caractères par frame
                                for (let i = 0; i < charsPerFrame && newRevealed.size < text.length; i++) {
                                    const nextIndex = getNextIndex(newRevealed);
                                    newRevealed.add(nextIndex);
                                }
                                setDisplayText(shuffleText(text, newRevealed));
                                return newRevealed;
                            } else {
                                setIsAnimating(false);
                                setIsDecrypted(true);
                                return prevRevealed;
                            }
                        }
                        if (direction === 'reverse') {
                            if (pointerRef.current < orderRef.current.length) {
                                const newRevealed = new Set(prevRevealed);
                                // Retirer charsPerFrame caractères par frame
                                for (let i = 0; i < charsPerFrame && pointerRef.current < orderRef.current.length; i++) {
                                    const idxToRemove = orderRef.current[pointerRef.current++];
                                    newRevealed.delete(idxToRemove);
                                }
                                setDisplayText(shuffleText(text, newRevealed));
                                if (newRevealed.size === 0) { setIsAnimating(false); setIsDecrypted(false); }
                                return newRevealed;
                            } else {
                                setIsAnimating(false); setIsDecrypted(false);
                                return prevRevealed;
                            }
                        }
                    } else {
                        if (direction === 'forward') {
                            setDisplayText(shuffleText(text, prevRevealed));
                            currentIteration++;
                            if (currentIteration >= maxIterations) {
                                setIsAnimating(false);
                                setDisplayText(text); setIsDecrypted(true);
                            }
                            return prevRevealed;
                        }
                        if (direction === 'reverse') {
                            let currentSet = prevRevealed.size === 0 ? fillAllIndices() : prevRevealed;
                            const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
                            const nextSet = removeRandomIndices(currentSet, removeCount);
                            setDisplayText(shuffleText(text, nextSet));
                            currentIteration++;
                            if (nextSet.size === 0 || currentIteration >= maxIterations) {
                                setIsAnimating(false); setIsDecrypted(false);
                                setDisplayText(shuffleText(text, new Set())); return new Set();
                            }
                            return nextSet;
                        }
                    }
                    return prevRevealed;
                });
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isAnimating, text, speed, charsPerFrame, maxIterations, sequential, revealDirection, shuffleText, direction, fillAllIndices, removeRandomIndices]);

    /* Click */
    const handleClick = () => {
        if (animateOn !== 'click') return;
        if (clickMode === 'once')   { if (isDecrypted) return; setDirection('forward'); triggerDecrypt(); }
        if (clickMode === 'toggle') { isDecrypted ? triggerReverse() : (setDirection('forward'), triggerDecrypt()); }
    };

    /* Hover */
    const triggerHoverDecrypt = useCallback(() => {
        if (isAnimating) return;
        setRevealedIndices(new Set()); setIsDecrypted(false); setDisplayText(text);
        setDirection('forward'); setIsAnimating(true);
    }, [isAnimating, text]);

    const resetToPlainText = useCallback(() => {
        setIsAnimating(false); setRevealedIndices(new Set());
        setDisplayText(text); setIsDecrypted(true); setDirection('forward');
    }, [text]);

    /* View */
    useEffect(() => {
        if (animateOn !== 'view' && animateOn !== 'inViewHover') return;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting && !hasAnimated) { triggerDecrypt(); setHasAnimated(true); }
            });
        }, { threshold: 0.1 });
        const cur = containerRef.current;
        if (cur) obs.observe(cur);
        return () => cur && obs.unobserve(cur);
    }, [animateOn, hasAnimated, triggerDecrypt]);

    useEffect(() => {
        if (animateOn === 'click') { encryptInstantly(); }
        else if (animateOn === 'always') { triggerDecrypt(); }
        else { setDisplayText(text); setIsDecrypted(true); }
        setRevealedIndices(new Set()); setDirection('forward');
    }, [animateOn, text, encryptInstantly]);

    const animateProps =
        animateOn === 'hover' || animateOn === 'inViewHover'
            ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlainText }
            : animateOn === 'click' ? { onClick: handleClick } : {};

    return (
        <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...animateProps} {...props}>
            <span style={styles.srOnly}>{displayText}</span>
            <span aria-hidden="true">
                {displayText.split('').map((char, index) => {
                    const done = revealedIndices.has(index) || (!isAnimating && isDecrypted);
                    return <span key={index} style={styles.charSpan} className={done ? className : encryptedClassName}>{char}</span>;
                })}
            </span>
        </motion.span>
    );
});

export default DecryptedText;
