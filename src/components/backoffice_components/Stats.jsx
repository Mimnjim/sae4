import React from 'react';
import ChartBar from './ChartBar.jsx';
import ChartPie from './ChartPie.jsx';

const Stats = ({reservations = []}) => {
  if (!reservations) return <div>Chargement...</div>;

  // reservations per day
  const perDay = {};
  // reservations per time slot
  const perSlot = {};
  reservations.forEach(r => {
    const d = (r.reservation_date || '').split('T')[0] || r.reservation_date || 'inconnu';
    perDay[d] = (perDay[d] || 0) + 1;
    const slot = r.time_slot_label || r.time_slot_id || 'inconnu';
    perSlot[slot] = (perSlot[slot] || 0) + 1;
  });

  // prepare arrays sorted by date
  const dayLabels = Object.keys(perDay).sort();
  const dayData = dayLabels.map(d => perDay[d]);

  const slotLabels = Object.keys(perSlot);
  const slotData = slotLabels.map(s => perSlot[s]);

  return (
    <div>
      <h3>Statistiques</h3>
      <p>Total réservations: <strong>{reservations.length}</strong></p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div>
          <h4>Réservations par jour</h4>
          <ChartBar id="chart-days" labels={dayLabels} data={dayData} title="Par jour" />
        </div>
        <div>
          <h4>Réservations par créneau</h4>
          <ChartPie id="chart-slots" labels={slotLabels} data={slotData} title="Par créneau" />
        </div>
      </div>
    </div>
  );
};

export default Stats;
