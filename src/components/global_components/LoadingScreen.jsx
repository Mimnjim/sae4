import { useEffect, useState } from 'react';
import './loading-screen.css';

export default function LoadingScreen({ onComplete, minDuration = 1500 }) {
  const [isShowing, setIsShowing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animation de progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 30;
        return Math.min(newProgress, 90); // Max 90% avant completion
      });
    }, 300);

    // Timer pour min duration
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsShowing(false);
        if (onComplete) onComplete();
      }, 300);
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDuration, onComplete]);

  if (!isShowing) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">⚡</div>
        <h2>Chargement...</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
