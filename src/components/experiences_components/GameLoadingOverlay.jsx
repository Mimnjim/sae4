import '../../styles/components/experiences_components/game-loading-overlay.css';

export default function GameLoadingOverlay() {
  return (
    <div className="game-loading-overlay">
      <div className="game-loading-content">
        <div className="spinner" />
        <h3>Chargement du jeu...</h3>
        <p className="loading-tip">Cela peut prendre quelques secondes</p>
      </div>
    </div>
  );
}
