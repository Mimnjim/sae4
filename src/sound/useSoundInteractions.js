import { useEffect } from 'react';
import { useSoundContext } from './SoundContext';

/**
 * Hook pour ajouter les sons aux interactions (clic, hover)
 * À utiliser dans les composants qui contiennent des liens
 */
export function useSoundInteractions() {
  const { playSound } = useSoundContext();

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target && (e.target.closest?.('a') || e.target.closest?.('button'))) {
        playSound('click');
      }
    };

    const handleHover = (e) => {
      if (e.target && (e.target.closest?.('a') || e.target.closest?.('button')) && e.type === 'mouseenter') {
        playSound('hover');
      }
    };

    // Événement de clic sur document
    document.addEventListener('click', handleClick, true);
    
    // Événements de hover sur liens et boutons
    document.addEventListener('mouseenter', handleHover, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseenter', handleHover, true);
    };
  }, [playSound]);
}

export default useSoundInteractions;
