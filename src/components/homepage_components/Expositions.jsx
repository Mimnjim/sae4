import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Grainient from '../../animations/Grainient';
import { ArrowUpRight, X } from '@boxicons/react';
import '../../styles/components/homepage_components/expositions.css';

const images = [
    { src: '/img/Planche1_Akira.jpg', alt: 'Akira — Arc III - Katsuhiro Otomo', pos: 'tl' },
    { src: '/img/Planche1_GITS.png', alt: 'Ghost in the Shell — Shirow', pos: 'tr' },
    { src: '/img/Planche2_Akira.jpg', alt: 'Tetsuo — Arc IV', pos: 'bl' },
    { src: '/img/Planche2_GITS.png', alt: 'Motoko Kusanagi — Major Section 9', pos: 'br' },
];

export default function Expositions() {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);

    // Empêcher le scroll quand la modal est ouverte
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            // Ne pas modifier le scroll au cleanup - AppContent gère ça
            // Une chaîne vide écrase les styles d'AppContent
        }
        
        return () => {
            // Ne pas réinitialiser le scroll ici - laisser AppContent gérer
        };
    }, [selectedImage]);

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    return (
        <>
            <section className="ma-section">
                {/* Overlay de lisibilité */}
                <div className="ma-overlay" />

                {/* Grille 2×2 — images dans les coins */}
                <div className="ma-grid">
                    {images.map(({ src, alt, pos }) => (
                        <div key={pos} className={`ma-img-wrap ma-img-wrap--${pos}`}>
                            <img 
                                src={src} 
                                alt={alt} 
                                className="ma-img" 
                                loading="lazy"
                                onClick={() => setSelectedImage({ src, alt })}
                                style={{ cursor: 'pointer' }}
                            />
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
                            {t('experiences.tickets_link')} <img src="/icons/FlecheDiagonale.svg" alt="" className='arrow-link' />
                        </Link>

                    </div>
                </div>

            </section>

            {/* Modal rendue hors du DOM avec portail */}
            {selectedImage && ReactDOM.createPortal(
                <div 
                    className="ma-modal-backdrop" 
                    onClick={handleBackdropClick}
                >
                    <div className="ma-modal-content">
                        <button 
                            className="ma-modal-close" 
                            onClick={handleCloseModal}
                            aria-label="Fermer"
                        >
                            <X size={32} />
                        </button>
                        <img 
                            src={selectedImage.src} 
                            alt={selectedImage.alt}
                            className="ma-modal-image"
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
