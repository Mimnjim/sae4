import { useSoundContext } from '../../sound/SoundContext';
import '../../styles/components/global_components/sound-toggle.css';

export default function SoundToggle() {
    const { soundEnabled, toggleSound, playSound } = useSoundContext();

    return (
        <button 
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
