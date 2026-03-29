import React, { createContext, useState, useEffect, useRef } from 'react';

export const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });

  const soundsRef = useRef({
    click: new Audio('/sounds/click.mp3'),
    hover: new Audio('/sounds/hover.mp3'),
    achievement: new Audio('/sounds/achievement.mp3'),
    gameMusicLoop: new Audio('/sounds/musique_jeu.mp3'),
  });

  // Initialiser les sons
  useEffect(() => {
    soundsRef.current.gameMusicLoop.loop = true;
    soundsRef.current.gameMusicLoop.volume = soundEnabled ? 0.2 : 0;
    soundsRef.current.click.volume = soundEnabled ? 0.4 : 0;
    soundsRef.current.hover.volume = soundEnabled ? 0.4 : 0;
    soundsRef.current.achievement.volume = soundEnabled ? 0.6 : 0;
  }, [soundEnabled]);

  // Sauvegarder la préférence
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled);
    soundsRef.current.gameMusicLoop.volume = soundEnabled ? 0.2 : 0;
    soundsRef.current.click.volume = soundEnabled ? 0.4 : 0;
    soundsRef.current.hover.volume = soundEnabled ? 0.4 : 0;
    soundsRef.current.achievement.volume = soundEnabled ? 0.6 : 0;
  }, [soundEnabled]);

  const playSound = (soundName) => {
    if (!soundEnabled) return;
    const audio = soundsRef.current[soundName];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.LOG('Erreur son:', err));
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const stopGameMusic = () => {
    soundsRef.current.gameMusicLoop.pause();
    soundsRef.current.gameMusicLoop.currentTime = 0;
  };

  const playGameMusic = () => {
    if (soundEnabled) {
      soundsRef.current.gameMusicLoop.play().catch(err => console.log('Erreur musique:', err));
    }
  };

  return (
    <SoundContext.Provider value={{
      soundEnabled,
      playSound,
      toggleSound,
      playGameMusic,
      stopGameMusic,
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = React.useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within SoundProvider');
  }
  return context;
}
