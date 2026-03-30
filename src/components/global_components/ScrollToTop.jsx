import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Composant utilitaire qui scrolle automatiquement vers le haut
 * chaque fois que la route change ET gère le scroll activé sur les pages non-home
 */
const ScrollToTop = ({ entered }) => {
  const { pathname } = useLocation();
  const isHomePath = pathname === '/';

  useEffect(() => {
    // Scroll vers le haut instantanément
    window.scrollTo(0, 0);
    
    // Sur les pages autres que home: TOUJOURS activer le scroll
    if (!isHomePath) {
      // Utiliser cssText pour appliquer les styles avec !important
      document.documentElement.style.cssText = 'overflow: auto !important; overflow-y: auto !important; height: auto !important; position: static !important;';
      document.body.style.cssText = 'overflow: visible !important; overflow-y: auto !important; height: auto !important; position: static !important; overflow-x: hidden !important; min-height: auto !important;';
      
      console.log('✅ ScrollToTop: Page non-home - Scroll activé');
    }
  }, [pathname, isHomePath, entered]);

  return null; // Ce composant ne rend rien visuellement
};

export default ScrollToTop;
