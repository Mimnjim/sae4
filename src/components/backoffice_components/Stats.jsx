import React from 'react';
import { useTranslation } from 'react-i18next';
import ChartBar from './ChartBar.jsx';
import ChartPie from './ChartPie.jsx';

const Stats = ({ reservations = [] }) => {
  const { t } = useTranslation();
  if (!reservations) return <div>{t('profile.loading')}</div>;

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
    if (dayLabels.length === 0) return <p className="muted">{t('backoffice.noReservations')}</p>;

    if (dayLabels.length > MAX_BAR_COLUMNS) {
      return (
        <div>
          <h4>{t('backoffice.reservationsByDayList')}</h4>
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
        <h4>{t('backoffice.reservationsByDay')}</h4>
        <ChartBar id="chart-days" labels={dayLabels} data={dayValues} title={t('backoffice.byDay')} />
      </>
    );
  };

  return (
    <div className="stats-panel">
      <h3>{t('backoffice.statistics')}</h3>

      <div className="stat-summary">
        <div className="stat-item">
          <h4>{t('backoffice.total')}</h4>
          <p>{reservations.length} {t('backoffice.reservationsText')}</p>
        </div>
        <div className="stat-item">
          <h4>{t('backoffice.daysCount')}</h4>
          <p>{dayLabels.length}</p>
        </div>
        <div className="stat-item">
          <h4>{t('backoffice.timeSlots')}</h4>
          <p>{slotLabels.length}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="chart-area">
          {renderDaySection()}
        </div>
        <div className="chart-area">
          <h4>{t('backoffice.reservationsBySlot')}</h4>
          <ChartPie id="chart-slots" labels={slotLabels} data={slotValues} title={t('backoffice.bySlot')} />
        </div>
      </div>
    </div>
  );
};

export default Stats;