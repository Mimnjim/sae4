import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartPie = ({ id, labels = [], data = [], title = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: title || 'Parts',
          data,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }],
      },
      options: { responsive: true, maintainAspectRatio: false },
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

export default ChartPie;