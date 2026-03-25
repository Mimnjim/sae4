import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/experiences-section.css';
import { ArrowUpRight } from '@boxicons/react';

export default function ExperienceSection() {
    const sectionRef = useRef(null);
    const panelRef   = useRef(null);
    const reserveRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const obs = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;

            // Panneau droit : glisse depuis la droite
            gsap.fromTo(panelRef.current,
                { x: 60, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 }
            );

            // Triangle : glisse depuis le bas-gauche
            gsap.fromTo(reserveRef.current,
                { x: -80, y: 40, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.35 }
            );

            obs.disconnect();
        }, { threshold: 0.15 });

        obs.observe(section);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="exp-section">

            {/* ── Image de fond ── */}
            <div className="exp-bg">
                {/* <img
                    src="/img/Akira1.jpg"
                    alt="Aperçu de l'expérience immersive"
                    loading="lazy"
                /> */}

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
                    <span className="exp-reservation-label">Grand Palais · 2025</span>
                    <h3 className="exp-reservation-title">
                        Réservez<br />votre visite
                    </h3>
                    <p className="exp-reservation-sub">
                        Billets disponibles du 15 mars<br />au 30 juin 2025
                    </p>
                    <Link to="/form-reservation" className="exp-reservation-link cursor-target">
                        Voir les dates <ArrowUpRight />
                    </Link>
                </div>
            </div>

            {/* ── Panneau texte — droite ── */}
            <div ref={panelRef} className="exp-panel">

                <span className="exp-eyebrow">
                    Expérience Interactive
                </span>

                <h2 className="exp-title">
                    Entrez dans<br />l'univers
                </h2>

                <span className="exp-rule" />

                <p className="exp-description">
                    Plongez dans une expérience immersive unique conçue pour l'exposition.
                    Traversez Neo-Tokyo, infiltrez la Section 9 — et terminez votre mission
                    pour repartir avec un code exclusif sur la billetterie.
                </p>

                <div className="exp-promo">
                    <span className="exp-promo-star">★</span>
                    Code promo exclusif à débloquer en fin d'expérience
                </div>

                <a href="/experiences" className="exp-cta cursor-target">
                    Jouer maintenant
                    <span className="exp-cta-arrow"><ArrowUpRight /></span>
                </a>

            </div>

        </section>
    );
}
