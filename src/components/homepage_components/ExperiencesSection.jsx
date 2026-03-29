import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../../styles/components/homepage_components/experiences-section.css';

export default function ExperienceSection() {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const panelRef   = useRef(null);
    const reserveRef = useRef(null);
    const bgRef      = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                // Animation d'entrée
                // Tuer les animations précédentes pour éviter les conflits
                gsap.killTweensOf([bgRef.current, panelRef.current, reserveRef.current]);
                
                // Image de fond : apparaît en fade + scale
                gsap.fromTo(bgRef.current,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
                );

                // Panneau droit : glisse depuis la droite
                gsap.fromTo(panelRef.current,
                    { x: 60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
                );

                // Réservation : apparition avec délai
                gsap.fromTo(reserveRef.current,
                    { opacity: 0, x: -60, y: 40 },
                    { x: 0, y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
                );
            } else {
                // Animation de sortie
                gsap.killTweensOf([bgRef.current, panelRef.current, reserveRef.current]);
                
                // Image de fond : disparaît en fade + scale
                gsap.to(bgRef.current,
                    { opacity: 0, y: -40, duration: 0.8, ease: 'power2.in' }
                );

                // Panneau droit : glisse vers la droite
                gsap.to(panelRef.current,
                    { x: 60, opacity: 0, duration: 0.8, ease: 'power3.in' }
                );

                // Réservation : disparition
                gsap.to(reserveRef.current,
                    { opacity: 0, x: -60, y: 40, duration: 0.6, ease: 'power3.in' }
                );
            }
        }, { threshold: 0.25 });

        obs.observe(section);

        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="exp-section">

            {/* ── Image de fond ── */}
            <div ref={bgRef} className="exp-bg">
                <img
                    src="/img/Jeu_experiences.png"
                    alt="Aperçu de l'expérience immersive"
                    loading="lazy"
                />

                <div className="exp-bg-vignette" />
            </div>

            {/* ── Triangle réservation — bas gauche ── */}
            <div ref={reserveRef} className="exp-reservation">
                <div className="exp-reservation-inner">
                    <h3 className="exp-reservation-title">
                        {t('experiences.reserveVisit')}
                    </h3>
                    <Link to="/form-reservation" className="exp-reservation-link cursor-target">
                        {t('experiences.tickets_link')} <img src="/icons/FlecheDiagonale.svg" alt="" className='arrow-link' />
                    </Link>
                </div>
            </div>

            {/* ── Panneau texte — droite ── */}
            <div ref={panelRef} className="exp-panel">

                <span className="exp-eyebrow">
                    {t('experiences.eyebrow')}
                </span>

                <h2 className="exp-title">
                    {t('experiences.enterUniverse')}
                </h2>

                <span className="exp-rule" />

                <p className="exp-description">
                    {t('experiences.description')}
                </p>

                <div className="exp-promo">
                    <span className="exp-promo-star">★</span>
                    <p>{t('experiences.promoText')}</p>
                </div>

                <a href="/experiences" className="exp-cta cursor-target">
                    {t('experiences.playNow')}
                </a>

            </div>

        </section>
    );
}
