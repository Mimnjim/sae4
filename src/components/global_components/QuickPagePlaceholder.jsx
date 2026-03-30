import React, { useEffect, useState } from 'react';

/**
 * QuickPagePlaceholder
 * Affiche un placeholder très rapide pendant le chargement des ressources critiques
 * Donne une impression de "responsiveness" immédiate
 * IMPORTANT: zIndex est bas (5) pour NE PAS bloquer le GatewayScreen (zIndex: 1000)
 */
export default function QuickPagePlaceholder() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Attendre 5s pour laisser le GatewayScreen bien visible
    // Le GatewayScreen masquera le placeholder pendant ce temps (zIndex: 9999)
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        zIndex: 5, // BAS zIndex pour laisser le GatewayScreen (zIndex: 1000) aparaître au-dessus
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: fadeOut ? 'none' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255, 255, 255, 0.2)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
