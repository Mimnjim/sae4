import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendrier.css';

const Calendrier = () => {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    // Générer les créneaux horaires pour la date sélectionnée
    const slots = generateTimeSlots(selectedDate);
    setTimeSlots(slots);
  };

  const generateTimeSlots = (selectedDate) => {
    const slots = [];
    const startHour = 10; // Heure de début
    const endHour = 18; // Heure de fin

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00 - ${hour + 1}:00`);
    }
    return slots;
  };

  return (
    <div className="calendrier-container">
      <h2>Sélectionnez une date pour votre rendez-vous</h2>
      <Calendar onChange={handleDateChange} value={date} />
      <h3>Créneaux horaires disponibles pour le {date.toLocaleDateString()}:</h3>
      <ul>
        {timeSlots.map((slot, index) => (
          <li key={index}>{slot}</li>
        ))}
      </ul>
    </div>
  );
};

export default Calendrier;