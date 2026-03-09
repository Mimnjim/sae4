import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ButtonValidation from './ButtonValidation';

const FormReservation = () => {
  const location = useLocation();
  const bookingDataFromCalendar = location.state;
  
  const formatDateForInput = (date) => {
    if (!date) return '';
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const extractStartTime = (timeSlot) => {
    if (!timeSlot) return '';
    return timeSlot.split(' - ')[0];
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: bookingDataFromCalendar ? formatDateForInput(bookingDataFromCalendar.date) : '',
    time: bookingDataFromCalendar ? extractStartTime(bookingDataFromCalendar.slot) : '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Données de réservation:', formData);
  };

  const isFormComplete = formData.name && formData.email && formData.phone && formData.date && formData.time;
  const hasDateFromCalendar = !!bookingDataFromCalendar;

  return (
    <div className="form-reservation-container">
      <h2>Réservez votre rendez-vous</h2>
      <div className="reservation-form">
        <label>
          Nom:
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
        </label>
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
        </label>
        <label>
          Téléphone:
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleInputChange} 
            required 
          />
        </label>
        <label>
          Date:
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleInputChange} 
            disabled={hasDateFromCalendar}
            required 
          />
        </label>
        <label>
          Heure:
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleInputChange} 
            disabled={hasDateFromCalendar}
            required 
          />
        </label>
        <ButtonValidation 
          text="Confirmer ma réservation"
          navigateTo="/confirmation"
          onClick={handleSubmit}
          disabled={!isFormComplete}
        />
      </div>
    </div>
  );
};

export default FormReservation;