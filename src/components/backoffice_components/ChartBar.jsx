import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartBar = ({ id, labels = [], data = [], title = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: title || 'Valeurs',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor:     'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
    return () => chart.destroy();
  }, [labels.join(','), data.join(',')]);

  return (
    <div style={{ height: 300 }}>
      {/* R116 : texte alternatif pour les navigateurs sans canvas */}
      <canvas id={id} ref={canvasRef}>
        {title && <p>{title} : {labels.map((l, i) => `${l} (${data[i]})`).join(', ')}</p>}
      </canvas>
    </div>
  );
};

export default ChartBar;