import '../styles/Timeline.css';

// Affiche une barre verticale avec un point par niveau
// Props :
//   count → nombre de niveaux (= nombre de points à afficher)
export default function Timeline({ count }) {
  return (
    <div className="timeline">

      {/* Barre verticale continue */}
      <div className="timeline-line" />

      {/* Un point par niveau, espacés régulièrement en hauteur */}
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="timeline-dot"
          style={{ top: `${10 + index * 30}%` }}
        />
      ))}

    </div>
  );
}