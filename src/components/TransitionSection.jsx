import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import '../styles/transition-section.css';

// ─── Séquence d'animation ────────────────────────────────────────
// Durée totale : ~3.2s
// 1. Beam de scan traverse l'écran (0s → 0.6s)
// 2. Coins de ciblage apparaissent (0.3s)
// 3. Data line se tape (0.4s → 1.2s)
// 4. Grand titre se révèle par clip-path (0.8s → 1.8s)
// 5. Rule + subtitle (1.6s)
// 6. Blocs d'info (2.0s)
// 7. Compteur + scroll hint (2.4s)

export default function TransitionSection() {
    const { t } = useTranslation();
    const sectionRef   = useRef(null);
    const beamRef      = useRef(null);
    const cornersRef   = useRef([]);
    const dataLineRef  = useRef(null);
    const titleRef     = useRef(null);
    const subtitleRef  = useRef(null);
    const ruleRef      = useRef(null);
    const infosRef     = useRef(null);
    const counterRef   = useRef(null);
    const scrollRef    = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // IntersectionObserver — joue une seule fois à l'entrée
        const obs = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            playSequence();
        }, { threshold: 0.3 });

        obs.observe(section);
        return () => obs.disconnect();
    }, []);

    function playSequence() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Beam de scan
        tl.set(beamRef.current, { opacity: 1, top: '-2px' })
          .to(beamRef.current, {
              top: '102%',
              duration: 0.65,
              ease: 'none',
          })
          .to(beamRef.current, { opacity: 0, duration: 0.1 });

        // 2. Coins de ciblage
        tl.to(cornersRef.current, {
            opacity: 1,
            duration: 0.3,
            stagger: 0.06,
        }, 0.2);

        // 3. Data line — effet machine à écrire via width
        tl.to(dataLineRef.current, {
            opacity: 1,
            duration: 0.1,
        }, 0.35)
          .to(dataLineRef.current, {
              width: 'auto',
              duration: 0.8,
              ease: 'steps(24)',
          }, 0.4);

        // 4. Grand titre — révèle de gauche à droite via clip-path
        tl.to(titleRef.current, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            ease: 'power4.inOut',
        }, 0.75);

        // 4b. Glitch léger sur le titre (flash rapide)
        tl.to(titleRef.current, { x: -4, duration: 0.04, ease: 'none' }, 1.1)
          .to(titleRef.current, { x: 3,  duration: 0.04, ease: 'none' }, 1.14)
          .to(titleRef.current, { x: 0,  duration: 0.04, ease: 'none' }, 1.18);

        // 5. Rule + subtitle
        tl.to(ruleRef.current, {
            width: '180px',
            duration: 0.5,
            ease: 'power2.out',
        }, 1.55)
          .to(subtitleRef.current, {
              opacity: 1,
              duration: 0.5,
          }, 1.65);

        // 6. Blocs d'info
        tl.to(infosRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.55,
        }, 2.0);

        // 7. Compteur + scroll hint
        tl.to([counterRef.current, scrollRef.current], {
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
        }, 2.35);
    }

    return (
        <section ref={sectionRef} className="ts-section">

            {/* Scanlines CRT */}
            <div className="ts-scanlines" />

            {/* Beam de scan */}
            <div ref={beamRef} className="ts-beam" />

            {/* Coins de ciblage */}
            {['tl', 'tr', 'bl', 'br'].map((pos, i) => (
                <div
                    key={pos}
                    ref={el => cornersRef.current[i] = el}
                    className={`ts-corner ts-corner--${pos}`}
                />
            ))}

            {/* Contenu central */}
            <div className="ts-content">

                {/* Data line */}
                <div ref={dataLineRef} className="ts-data-line">
                    SYS://EXPOSITION.INIT — AKIRA × GHOST_IN_THE_SHELL — PARIS_2025
                </div>

                {/* Grand titre */}
                <h2 ref={titleRef} className="ts-title">
                    {t('transition.title')}
                </h2>

                {/* Séparateur */}
                <div ref={ruleRef} className="ts-rule" />

                {/* Sous-titre */}
                <p ref={subtitleRef} className="ts-subtitle">
                    {t('transition.subtitle')}
                </p>

                {/* Blocs d'info */}
                <div ref={infosRef} className="ts-infos">
                    <div className="ts-info-block">
                        <span className="ts-info-label">{t('transition.location')}</span>
                        <span className="ts-info-value">{t('transition.locationValue')}</span>
                    </div>
                    <div className="ts-info-sep" />
                    <div className="ts-info-block">
                        <span className="ts-info-label">{t('transition.dates')}</span>
                        <span className="ts-info-value">{t('transition.datesValue')}</span>
                    </div>
                    <div className="ts-info-sep" />
                    <div className="ts-info-block">
                        <span className="ts-info-label">{t('transition.works')}</span>
                        <span className="ts-info-value">{t('transition.worksValue')}</span>
                    </div>
                </div>

            </div>

            {/* Compteur bas-droite */}
            <div ref={counterRef} className="ts-counter">
                SYS_02 / EXPOSITION_DATA
            </div>

            {/* Scroll hint */}
            {/* <div ref={scrollRef} className="ts-scroll-hint">
                <span className="ts-scroll-label">Explorer</span>
                <div className="ts-scroll-line" />
            </div> */}

        </section>
    );
}
