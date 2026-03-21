import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/manga-archive.css';

// ── Contenu éditorial complet ────────────────────────────────────
// Structure de chaque entrée :
//   hook      → accroche immersive (niveau 2)
//   resonance → en quoi ça résonne aujourd'hui (lien manga → réel)
//   expo      → ce qu'on voit dans l'expo (planches, installations)
//   specs     → fiche technique (niveau 3)

const entries = [
    // ── AKIRA ──────────────────────────────────────────────────
    {
        id:        'akira-01',
        universe:  'Akira',
        tagClass:  'ma-tag--akira',
        hookClass: 'ma-hook--akira',
        resClass:  'ma-resonance--akira',
        title:     'Akira',
        subtitle:  'Katsuhiro Otomo — 1982',
        reverse:   false,
        image:     '/img/Akira1.jpg',
        hook:      "Neo-Tokyo brûle encore. Sous les néons effondrés et le béton fracturé, quelque chose s'éveille — quelque chose que personne ne peut plus arrêter. Vous êtes là, dans la rue, le sol tremble.",
        resonance: "En 1982, Otomo décrivait une mégalopole fracturée par les inégalités, les expériences militaires secrètes et la jeunesse abandonnée. Quarante ans plus tard, les villes ont explosé, les technologies ont dépassé nos lois, et personne ne contrôle plus Tetsuo.",
        expo:      "Salle 01 — Planches originales des tomes 1 & 2, storyboards du film 1988, maquette de Neo-Tokyo à l'échelle 1:500.",
        specs: [
            { label: 'Auteur',     value: 'Katsuhiro Otomo' },
            { label: 'Éditeur',    value: 'Young Magazine / Kōdansha' },
            { label: 'Parution',   value: '1982 → 1990' },
            { label: 'Volumes',    value: '6 tomes — 2 182 pages' },
            { label: 'Genre',      value: 'Cyberpunk / Post-apocalyptique' },
            { label: 'Adaptation', value: 'Film animé, Otomo, 1988' },
        ],
    },
    {
        id:        'akira-02',
        universe:  'Akira',
        tagClass:  'ma-tag--akira',
        hookClass: 'ma-hook--akira',
        resClass:  'ma-resonance--akira',
        title:     'Tetsuo',
        subtitle:  "L'Éveil — Arc II",
        reverse:   true,
        image:     '/img/Akira2.jpg',
        hook:      "La douleur est devenue puissance. La puissance, folie. Chaque cellule de son corps hurle et se transforme. Il n'y a plus de retour possible. Vous ne pouvez pas détourner les yeux.",
        resonance: "Tetsuo incarne la peur universelle de l'augmentation incontrôlée — ce que devient un être humain quand la technologie le dépasse. Aujourd'hui, cette question n'est plus de la fiction : implants neuraux, CRISPR, interfaces cerveau-machine. Qui décide des limites ?",
        expo:      "Salle 02 — Séquence de transformation de Tetsuo en planches grand format, extraits du film projetés en boucle, dispositif sonore immersif.",
        specs: [
            { label: 'Arc',        value: 'Mutation & Puissance' },
            { label: 'Tomes',      value: 'Vol. 2 — 3' },
            { label: 'Personnage', value: 'Tetsuo Shima' },
            { label: 'Thème',      value: 'Augmentation, perte de contrôle' },
            { label: 'Technique',  value: '2 000 calques par planche' },
            { label: 'Format',     value: 'Noir & blanc, grand format' },
        ],
    },

    // ── GHOST IN THE SHELL ─────────────────────────────────────
    {
        id:        'gis-01',
        universe:  'Ghost in the Shell',
        tagClass:  'ma-tag--gis',
        hookClass: 'ma-hook--gis',
        resClass:  'ma-resonance--gis',
        title:     'Ghost in the Shell',
        subtitle:  'Masamune Shirow — 1989',
        reverse:   false,
        image:     '/img/GIS1.jpg',
        hook:      "Son corps est une machine. Ses souvenirs, peut-être des mensonges. Pourtant quelque chose résiste — quelque chose qui refuse d'être réduit à du code. La Major vous regarde. Voit-elle une âme, ou un miroir ?",
        resonance: "En 1989, Shirow posait la question de l'identité à l'ère des corps augmentés. En 2025, des millions de personnes portent des prothèses connectées, des IA génèrent des souvenirs, et les deepfakes effacent la frontière entre réel et simulé. Le ghost est parmi nous.",
        expo:      "Salle 03 — Planches originales colorisées de Shirow, installation miroir interactif (reconnaissance faciale altérée), extraits du film Oshii 1995.",
        specs: [
            { label: 'Auteur',     value: 'Masamune Shirow' },
            { label: 'Éditeur',    value: 'Kōdansha / Young Magazine' },
            { label: 'Parution',   value: '1989 → 1997' },
            { label: 'Volumes',    value: '3 tomes + Man-Machine Interface' },
            { label: 'Genre',      value: 'Cyberpunk / Philosophique' },
            { label: 'Adaptation', value: 'Film, Mamoru Oshii, 1995' },
        ],
    },
    {
        id:        'gis-02',
        universe:  'Ghost in the Shell',
        tagClass:  'ma-tag--gis',
        hookClass: 'ma-hook--gis',
        resClass:  'ma-resonance--gis',
        title:     'Motoko Kusanagi',
        subtitle:  'Major — Section 9',
        reverse:   true,
        image:     '/img/GIS2.webp',
        hook:      "Elle plonge depuis un toit, invisible une fraction de seconde — puis disparaît. Quelque part dans le réseau, son ghost continue de chercher ce qu'elle est vraiment.",
        resonance: "Motoko est le personnage le plus contemporain de la fiction. Elle n'est ni humaine ni machine — elle est le entre-deux dans lequel nous vivons tous. Dans un monde où nos données nous précèdent, où nos comportements sont prédits, qui possède encore son propre récit ?",
        expo:      "Salle 04 — Planches de la Section 9, dispositif de réalité augmentée pour se glisser dans la peau du Major, annotations manuscrites originales de Shirow.",
        specs: [
            { label: 'Arc',        value: 'Identité & Conscience augmentée' },
            { label: 'Tomes',      value: 'Vol. 1' },
            { label: 'Personnage', value: 'Major Motoko Kusanagi' },
            { label: 'Thème',      value: 'Humanité, âme, données' },
            { label: 'Technique',  value: 'Encre + lavis, semi-réaliste' },
            { label: 'Format',     value: "Couleurs, annotations d'auteur" },
        ],
    },
];

// ── Anime une carte via IntersectionObserver ────────────────────
function animateCard(card) {
    const isReverse = card.querySelector('.ma-text--reverse') !== null;
    const imgSide   = card.querySelector('.ma-img');
    const tag       = card.querySelector('.ma-tag');
    const title     = card.querySelector('.ma-title');
    const hook      = card.querySelector('.ma-hook');
    const resonance = card.querySelector('.ma-resonance');
    const expo      = card.querySelector('.ma-expo');
    const rows      = card.querySelectorAll('.ma-spec-row');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(imgSide,
        { x: isReverse ? 60 : -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 },
        0
    );
    tl.fromTo(tag,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.3
    );
    tl.fromTo(title,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.45
    );
    tl.fromTo(hook,
        { y: 24, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9 },
        0.65
    );
    if (resonance) {
        tl.fromTo(resonance,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
            0.95
        );
    }
    if (expo) {
        tl.fromTo(expo,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            1.1
        );
    }
    if (rows.length) {
        tl.fromTo(rows,
            { x: isReverse ? -16 : 16, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35, stagger: 0.08 },
            1.2
        );
    }
}

export default function MangaArchive() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;

                    if (el.classList.contains('ma-card'))      animateCard(el);
                    if (el.classList.contains('ma-separator')) {
                        gsap.fromTo(el,
                            { scaleX: 0, opacity: 0 },
                            { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
                        );
                    }
                    if (el.classList.contains('ma-header')) {
                        gsap.fromTo(el,
                            { y: 40, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
                        );
                    }

                    observer.unobserve(el);
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
        );

        const header = section.querySelector('.ma-header');
        const cards  = section.querySelectorAll('.ma-card');
        const seps   = section.querySelectorAll('.ma-separator');

        if (header) observer.observe(header);
        cards.forEach(c => observer.observe(c));
        seps.forEach(s => observer.observe(s));

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="ma-section">

            <div className="ma-center-line" />

            {/* ── Header ── */}
            <header className="ma-header">
                <span className="ma-eyebrow">Grand Palais Éphémère · Paris · 2025</span>
                <h2>Les Œuvres<br />Présentées</h2>
                <span className="ma-header-rule" />
            </header>

            {/* ── Cartes ── */}
            {entries.map((entry, i) => (
                <React.Fragment key={entry.id}>

                    <article className="ma-card">

                        {/* Image */}
                        <div className="ma-img">
                            <img src={entry.image} alt={entry.title} loading="lazy" />
                            <div className={`ma-img-overlay ma-img-overlay--${entry.reverse ? 'right' : 'left'}`} />
                            <div className="ma-scan" />
                            <span className="ma-img-index">
                                Salle {String(i + 1).padStart(2, '0')} · Niveau 1
                            </span>
                        </div>

                        {/* Texte */}
                        <div className={`ma-text${entry.reverse ? ' ma-text--reverse' : ''}`}>

                            {/* Niveau 1 — Identité */}
                            <div className={`ma-tag ${entry.tagClass}`}>
                                <span className="ma-tag-line" />
                                {entry.universe}
                            </div>
                            <h3 className="ma-title">{entry.title}</h3>
                            <p className="ma-subtitle">{entry.subtitle}</p>

                            {/* Niveau 2 — Accroche immersive */}
                            <div className={`ma-hook ${entry.hookClass}`}>
                                <p className="ma-hook-text">{entry.hook}</p>
                            </div>

                            {/* Niveau 2b — Résonance contemporaine (lien manga → réel) */}
                            <div className={`ma-resonance ${entry.resClass}`}>
                                <span className="ma-resonance-label">Aujourd'hui</span>
                                <p className="ma-resonance-text">{entry.resonance}</p>
                            </div>

                            {/* Niveau 2c — Ce qu'on voit dans l'expo */}
                            <div className="ma-expo">
                                <span className="ma-expo-label">À l'exposition</span>
                                <p className="ma-expo-text">{entry.expo}</p>
                            </div>

                            {/* Niveau 3 — Fiche technique */}
                            <div className="ma-specs">
                                {entry.specs.map((spec, j) => (
                                    <div className="ma-spec-row" key={j}>
                                        <span className="ma-spec-label">{spec.label}</span>
                                        <span className="ma-spec-value">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            <span className="ma-big-number">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </article>

                    {i < entries.length - 1 && (
                        <div className="ma-separator">
                            <div className="ma-sep-line" />
                            <div className="ma-sep-dot" />
                            <div className="ma-sep-line" />
                        </div>
                    )}

                </React.Fragment>
            ))}

            {/* ── Footer ── */}
            <footer className="ma-footer">
                <p>Catalogue de l'exposition — {entries.length} œuvres au programme</p>
            </footer>

        </section>
    );
}
