import '../../styles/components/global_components/Timeline.css';

// Barre verticale décorative avec un point par niveau
export default function Timeline({ count }) {
  return (
    <div className="timeline">
      <div className="timeline-line" />
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