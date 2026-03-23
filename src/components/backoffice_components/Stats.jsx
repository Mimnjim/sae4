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

  const MAX_CHART_COLUMNS = 24; // seuil avant d'afficher une liste de secours

  const renderDayChartOrList = () => {
    if (dayLabels.length === 0) return <p className="muted">Aucune réservation enregistrée.</p>;
    if (dayLabels.length > MAX_CHART_COLUMNS) {
      // fallback: render a readable list instead of an overly wide chart
      return (
        <div>
          <h4>Réservations par jour (liste)</h4>
          <ul className="stats-list">
            {dayLabels.map((d, i) => (
              <li key={d}><span className="stats-list-date">{d}</span> <span className="stats-list-count">{dayData[i]}</span></li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <>
        <h4>Réservations par jour</h4>
        <ChartBar id="chart-days" labels={dayLabels} data={dayData} title="Par jour" />
      </>
    );
  };

  return (
    <div className="stats-panel">
      <h3>Statistiques</h3>
      <div className="stat-summary">
        <div className="stat-item">
          <h4>Total</h4>
          <p>{reservations.length} réservations</p>
        </div>
        <div className="stat-item">
          <h4>Jours recensés</h4>
          <p>{dayLabels.length}</p>
        </div>
        <div className="stat-item">
          <h4>Créneaux</h4>
          <p>{slotLabels.length}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="chart-area">
          {renderDayChartOrList()}
        </div>
        <div className="chart-area">
          <h4>Réservations par créneau</h4>
          <ChartPie id="chart-slots" labels={slotLabels} data={slotData} title="Par créneau" />
        </div>
      </div>
    </div>
  );
};

export default Stats;
