import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendrier.css';
import ButtonValidation from './ButtonValidation';

const Calendrier = ({ onValidate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const OPENING_HOUR = 10;
  const CLOSING_HOUR = 18;

  useEffect(() => {
    const slots = generateTimeSlots();
    setAvailableTimeSlots(slots);
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
      slots.push(`${hour}:00 - ${hour + 1}:00`);
    }
    return slots;
  };

  const handleDateSelection = (newDate) => {
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
    const slots = generateTimeSlots();
    setAvailableTimeSlots(slots);
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleContinue = () => {
    if (onValidate) {
      onValidate({ date: selectedDate, slot: selectedTimeSlot });
    }
  };

  return (
    <div className="calendrier-container">
      <h2>Sélectionnez une date pour votre rendez-vous</h2>
      <Calendar onChange={handleDateSelection} value={selectedDate} />
      
      <h3>Créneaux horaires disponibles pour le {selectedDate.toLocaleDateString()}:</h3>
      <ul className="time-slots">
        {availableTimeSlots.map((timeSlot, index) => (
          <li 
            key={index} 
            className={selectedTimeSlot === timeSlot ? 'selected' : ''}
            onClick={() => handleTimeSlotClick(timeSlot)}
          >
            {timeSlot}
          </li>
        ))}
      </ul>
      
      {selectedTimeSlot && (
        <ButtonValidation 
          text="Continuer vers le formulaire"
          navigateTo="/form-reservation"
          onClick={handleContinue}
          navigationData={{ date: selectedDate, slot: selectedTimeSlot }}
        />
      )}
    </div>
  );
};

export default Calendrier;