/**
 * Utility pour jouer des sons dans le jeu depuis l'iframe
 * Communique avec le contexte du son parent via postMessage
 */

export function initGameSounds() {
  // Écouter les messages du jeu pour les sons
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'play_sound') {
      const { soundName } = event.data;
      
      // Créer et jouer le son localement
      const audioPath = `/sounds/${soundName}.mp3`;
      const audio = new Audio(audioPath);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Erreur son jeu:', err));
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
