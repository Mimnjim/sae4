import React from 'react';
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

                    <p className="ma-eyebrow">Grand Palais Éphémère · Paris · 2025</p>

                    <h2 className="ma-title">Au-delà de l’humain : <br /> une exposition immersive</h2>

                    <p className="ma-hook">
                        Cette exposition immersive vous plonge au cœur de cette dualité : entre la 
                        chair en mutation d'Akira et la conscience numérique de Ghost in the Shell.
                    </p>

                    <p className="ma-pitch">
                        À travers un parcours immersif, nous vous invitons à franchir la frontière du
                        réel pour explorer les limites de l'humain. Entre projections monumentales et
                        paysages sonores, vivez la collision entre le chaos organique et l'infini des données.
                        <br /><br />
                        Cette exposition immersive confronte deux trajectoires : la chair en mutation d'Akira et
                        la conscience numérique de Ghost in the Shell. À travers un parcours de projections et
                        de paysages sonores, nous interrogeons la finalité de nos outils et les limites de l'humain.
                        En plongeant au cœur de cette collision entre le chaos organique et l'infini des données, une
                        interrogation demeure : cherchons-nous à augmenter la vie ou à nous en affranchir ? Franchissez 
                        la frontière du réel, là où le progrès bascule.
                    </p>

                    {/* <a href="#tickets" className="ma-cta">
                        Réserver sa place
                        <span className="ma-cta-arrow"><ArrowUpRight /></span>
                    </a> */}

                </div>
            </div>

        </section>
    );
}
