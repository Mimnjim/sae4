import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Section({ id, title, content, imgSrc, reverse }) {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const img = imgRef.current;

        // Section démarre invisible
        gsap.set(section, { opacity: 0 });
        gsap.set(content, { opacity: 0, x: reverse ? 60 : -60 });
        gsap.set(img, { opacity: 0, x: reverse ? -60 : 60 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });

        // Fade in de la section entière
        tl.to(section, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
        });

        // Texte et image glissent vers leur position
        tl.to(content, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
        }, '-=0.3');

        tl.to(img, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
        }, '-=0.5');

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <section
            id={id}
            className={`section${reverse ? ' reverse' : ''}`}
            ref={sectionRef}
        >
            <div className="content" ref={contentRef}>
                <h2>{title}</h2>
                <p>{content}</p>
            </div>
            <img src={imgSrc} alt={title} ref={imgRef} />
        </section>
    );
}
