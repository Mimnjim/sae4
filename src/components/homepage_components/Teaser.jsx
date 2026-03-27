import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function Teaser() {
    const containerRef = useRef(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                // Animation d'entrée : Zoom in progressif
                gsap.killTweensOf([iframeRef.current]);
                
                gsap.fromTo(iframeRef.current,
                    { opacity: 0, scale: 0.7 },
                    { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
                );
            } else {
                // Animation de sortie : Zoom out
                gsap.killTweensOf([iframeRef.current]);
                
                gsap.to(iframeRef.current,
                    { opacity: 0, scale: 0.7, duration: 0.7, ease: 'power3.in' }
                );
            }
        }, { threshold: 0.2 });

        obs.observe(container);

        return () => obs.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="teaser-container">
            {/* <h2>Teaser de l'exposition "Au-delà de l'Humain"</h2>
            <p>Plongez dans l'univers captivant de "Au-delà de l'Humain" à travers notre teaser exclusif. Découvrez un aperçu visuel de l'exposition, mettant en lumière les œuvres emblématiques, les artistes talentueux et les expériences immersives qui vous attendent. Préparez-vous à être transporté dans un voyage fascinant à travers l'histoire et la culture du manga.</p>
             */}
            {/* <iframe width="560" height="450" src="https://www.youtube.com/embed/nA8KmHC2Z-g?si=68O4dkyt-aSfozPl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}

            <iframe 
                ref={iframeRef}
                width="560" 
                height="450" 
                src="https://www.youtube.com/embed/vvnNpjH93NU?si=tlTV_S-C6TzC-znF" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
            />

        </div>
    )
}