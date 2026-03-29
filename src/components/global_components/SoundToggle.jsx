import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSoundContext } from '../../sound/SoundContext';
import '../../styles/components/global_components/sound-toggle.css';

gsap.registerPlugin(ScrollTrigger);

export default function SoundToggle({ entered = true }) {
    const { soundEnabled, toggleSound, playSound } = useSoundContext();
    const { pathname } = useLocation();
    const buttonRef = useRef(null);
    const isHomePage = pathname === '/';
    const isAtGateway = !entered;

    useEffect(() => {
        if (!buttonRef.current) return;

        if (isAtGateway) {
            // Au GatewayScreen, toujours à 3rem/3rem
            buttonRef.current.classList.remove('sound-toggle-home');
            gsap.set(buttonRef.current, { bottom: '3rem', left: '3rem' });
            return;
        }

        if (isHomePage) {
            // Sur la Home, initialiser à 6rem/3rem
            buttonRef.current.classList.add('sound-toggle-home');
            gsap.set(buttonRef.current, { bottom: '6rem', left: '3rem' });
            
            let currentPosition = '6rem';
            
            const handleScroll = () => {
                const scrollY = window.scrollY;
                const threshold = window.innerHeight; // 100vh = une hauteur d'écran
                
                if (scrollY >= threshold && currentPosition !== '3rem') {
                    // Après 100vh de scroll, animer vers 3rem
                    currentPosition = '3rem';
                    gsap.to(buttonRef.current, {
                        bottom: '3rem',
                        left: '3rem',
                        duration: 0.6,
                        ease: 'power2.inOut',
                    });
                } else if (scrollY < threshold && currentPosition !== '6rem') {
                    // Retour avant 100vh, animer vers 6rem
                    currentPosition = '6rem';
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
    }, [isHomePage, isAtGateway]);

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
