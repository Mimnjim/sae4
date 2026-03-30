/**
 * Utility pour jouer des sons dans le jeu depuis l'iframe
 * Communique avec le contexte du son parent via postMessage
 */

let userInteractedWithGame = false;

// Détecter l'interaction utilisateur dans l'iframe du jeu
if (typeof window !== 'undefined') {
  const detectInteraction = () => {
    userInteractedWithGame = true;
    window.removeEventListener('click', detectInteraction);
    window.removeEventListener('keydown', detectInteraction);
    window.removeEventListener('touchstart', detectInteraction);
  };
  
  window.addEventListener('click', detectInteraction);
  window.addEventListener('keydown', detectInteraction);
  window.addEventListener('touchstart', detectInteraction);
}

export function initGameSounds() {
  // Écouter les messages du jeu pour les sons
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'play_sound') {
      const { soundName } = event.data;
      
      // Ne jouer que si l'utilisateur a interagi
      if (userInteractedWithGame) {
        const audioPath = `/sounds/${soundName}.mp3`;
        const audio = new Audio(audioPath);
        audio.volume = 0.5;
        audio.play().catch(err => {
          // Silencer les erreurs d'autoplay, c'est une contrainte navigateur
          if (err.name !== 'NotAllowedError') {
            console.log('Erreur son jeu:', err);
          }
        });
      }
    }
  });
}

export function playGameSound(soundName) {
  // Envoyer un message au parent pour jouer le son
  window.parent.postMessage({
    type: 'play_game_sound',
    soundName: soundName
  }, '*');
}
