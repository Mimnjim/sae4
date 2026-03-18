import React from 'react';

export default function Timeline({ count }) {
  return (
    <div className="timeline">
      <div className="timeline-line" />
      {Array.from({length: count}).map((_,i) => (
        <div key={i} className="timeline-dot" style={{ top: `${10 + i * 30}%` }} />
      ))}
    </div>
  );
}
