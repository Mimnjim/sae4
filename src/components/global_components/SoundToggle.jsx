import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSoundContext } from '../../sound/SoundContext';
import '../../styles/components/global_components/sound-toggle.css';

gsap.registerPlugin(ScrollTrigger);

export default function SoundToggle() {
    const { soundEnabled, toggleSound, playSound } = useSoundContext();
    const { pathname } = useLocation();
    const buttonRef = useRef(null);
    const isHomePage = pathname === '/';

    useEffect(() => {
        if (!buttonRef.current) return;

        if (isHomePage) {
            // Sur la Home, initialiser immédiatement à 6rem/6rem
            buttonRef.current.classList.add('sound-toggle-home');
            gsap.set(buttonRef.current, { bottom: '6rem', left: '3rem' });
            
            let hasAnimated = false;
            
            const handleScroll = () => {
                const scrollY = window.scrollY;
                const threshold = window.innerHeight; // 100vh = une hauteur d'écran
                
                if (scrollY >= threshold && !hasAnimated) {
                    // Le scroll a dépassé 100vh, animer vers 3rem
                    hasAnimated = true;
                    gsap.to(buttonRef.current, {
                        bottom: '3rem',
                        left: '3rem',
                        duration: 0.6,
                        ease: 'power2.inOut',
                    });
                } else if (scrollY < threshold && hasAnimated) {
                    // Retour avant 100vh, animer vers 6rem
                    hasAnimated = false;
                    gsap.to(buttonRef.current, {
                        bottom: '6rem',
                        left: '3rem',
                        duration: 0.6,
                        ease: 'power2.inOut',
                    });
                }
            };

            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
                buttonRef.current?.classList.remove('sound-toggle-home');
            };
        } else {
            // Sur les autres pages, positions fixes à 3rem/3rem
            buttonRef.current.classList.remove('sound-toggle-home');
            gsap.set(buttonRef.current, { bottom: '3rem', left: '3rem' });
            
            return () => {
                // Nettoyage
            };
        }
    }, [isHomePage]);

    return (
        <button 
            ref={buttonRef}
            onClick={() => { toggleSound(); playSound('click'); }} 
            className="sound-toggle-fixed cursor-target"
            aria-label={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
            title={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
        >
            <img 
                src={soundEnabled ? '/icons/Son.svg' : '/icons/Muet.svg'} 
                alt={soundEnabled ? 'Son activé' : 'Son désactivé'} 
            />
        </button>
    );
}
