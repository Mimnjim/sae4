import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendrier.css';
import ButtonValidation from './ButtonValidation';

const Calendrier = ({ onValidate }) => {
  // Variables d'état pour stocker les données
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const OPENING_HOUR = 10;
  const CLOSING_HOUR = 18;

  // Fonction pour générer les créneaux horaires
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
      const timeSlot = hour + ':00 - ' + (hour + 1) + ':00';
      slots.push(timeSlot);
    }
    return slots;
  };

  // Au chargement du composant, générer les créneaux
  useEffect(() => {
    const slots = generateTimeSlots();
    setAvailableTimeSlots(slots);
  }, []);

  // Quand on sélectionne une date
  const handleDateSelection = (newDate) => {
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
    const slots = generateTimeSlots();
    setAvailableTimeSlots(slots);
  };

  // Quand on clique sur un créneau horaire
  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Quand on clique sur continuer
  const handleContinue = () => {
    if (onValidate) {
      onValidate({ date: selectedDate, slot: selectedTimeSlot });
    }
  };

  // Afficher les créneaux horaires
  const timeSlotsList = [];
  for (let i = 0; i < availableTimeSlots.length; i++) {
    const timeSlot = availableTimeSlots[i];
    
    // Déterminer la classe CSS
    let className = '';
    if (selectedTimeSlot === timeSlot) {
      className = 'selected';
    }
    
    timeSlotsList.push(
      <li 
        key={i} 
        className={className}
        onClick={() => { handleTimeSlotClick(timeSlot); }}
      >
        {timeSlot}
      </li>
    );
  }

  // Afficher le bouton seulement si un créneau est sélectionné
  let buttonSection = null;
  if (selectedTimeSlot !== null) {
    buttonSection = (
      <ButtonValidation 
        text="Continuer vers le formulaire"
        navigateTo="/form-reservation"
        onClick={handleContinue}
        navigationData={{ date: selectedDate, slot: selectedTimeSlot }}
      />
    );
  }

  return (
    <div className="calendrier-container">
      <h2>Sélectionnez une date pour votre rendez-vous</h2>
      <Calendar onChange={handleDateSelection} value={selectedDate} />
      
      <h3>Créneaux horaires disponibles pour le {selectedDate.toLocaleDateString()}:</h3>
      <ul className="time-slots">
        {timeSlotsList}
      </ul>
      
      {buttonSection}
    </div>
  );
};

export default Calendrier;