import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Grainient from './Grainient';
import { ArrowUpRight } from '@boxicons/react';
import '../styles/manga-archive.css';

const images = [
    { src: '/img/Akira1.jpg', alt: 'Akira — Katsuhiro Otomo', pos: 'tl' },
    { src: '/img/GIS1.jpg', alt: 'Ghost in the Shell — Shirow', pos: 'tr' },
    { src: '/img/Akira2.jpg', alt: 'Tetsuo — Arc II', pos: 'bl' },
    { src: '/img/GIS2.webp', alt: 'Motoko Kusanagi — Major Section 9', pos: 'br' },
];

export default function MangaArchive() {
    const { t } = useTranslation();

    return (
        <section className="ma-section">
            {/* Overlay de lisibilité */}
            <div className="ma-overlay" />

            {/* Grille 2×2 — images dans les coins */}
            <div className="ma-grid">
                {images.map(({ src, alt, pos }) => (
                    <div key={pos} className={`ma-img-wrap ma-img-wrap--${pos}`}>
                        <img src={src} alt={alt} className="ma-img" loading="lazy" />
                    </div>
                ))}

                {/* Contenu central */}
                <div className="ma-center">

                    <p className="ma-eyebrow">{t('manga.eyebrow')}</p>

                    <h2 className="ma-title">{t('manga.mainTitle')}</h2>

                    <p className="ma-hook">
                        {t('manga.hook')}
                    </p>

                    <p className="ma-pitch">
                        {t('manga.pitch')}
                    </p>

                    <Link to="/form-reservation" className="exp-reservation-link cursor-target">
                        {t('experiences.tickets_link')} <ArrowUpRight />
                    </Link>

                    {/* <a href="#tickets" className="ma-cta">
                        Réserver sa place
                        <span className="ma-cta-arrow"><ArrowUpRight /></span>
                    </a> */}

                </div>
            </div>

        </section>
    );
}
