import React from 'react';
import ChartBar from './ChartBar.jsx';
import ChartPie from './ChartPie.jsx';

const Stats = ({ reservations = [] }) => {
  if (!reservations) return <div>Chargement...</div>;

  // Comptage des réservations par jour et par créneau horaire
  const reservationsByDay  = {};
  const reservationsBySlot = {};

  reservations.forEach(reservation => {
    const day  = (reservation.reservation_date || '').split('T')[0] || 'inconnu';
    const slot = reservation.time_slot_label || reservation.time_slot_id || 'inconnu';

    reservationsByDay[day]   = (reservationsByDay[day]   || 0) + 1;
    reservationsBySlot[slot] = (reservationsBySlot[slot] || 0) + 1;
  });

  const dayLabels  = Object.keys(reservationsByDay).sort();
  const dayValues  = dayLabels.map(day => reservationsByDay[day]);
  const slotLabels = Object.keys(reservationsBySlot);
  const slotValues = slotLabels.map(slot => reservationsBySlot[slot]);

  // Au-delà de 24 colonnes, le graphique devient illisible — on affiche une liste
  const MAX_BAR_COLUMNS = 24;

  const renderDaySection = () => {
    if (dayLabels.length === 0) return <p className="muted">Aucune réservation enregistrée.</p>;

    if (dayLabels.length > MAX_BAR_COLUMNS) {
      return (
        <div>
          <h4>Réservations par jour (liste)</h4>
          <ul className="stats-list">
            {dayLabels.map((day, index) => (
              <li key={day}>
                <span className="stats-list-date">{day}</span>
                <span className="stats-list-count">{dayValues[index]}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <>
        <h4>Réservations par jour</h4>
        <ChartBar id="chart-days" labels={dayLabels} data={dayValues} title="Par jour" />
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
          {renderDaySection()}
        </div>
        <div className="chart-area">
          <h4>Réservations par créneau</h4>
          <ChartPie id="chart-slots" labels={slotLabels} data={slotValues} title="Par créneau" />
        </div>
      </div>
    </div>
  );
};

export default Stats;