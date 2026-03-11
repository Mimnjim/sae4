import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ButtonValidation from './ButtonValidation';

const FormReservation = () => {
  // Récupérer les données passées depuis le calendrier
  const location = useLocation();
  const reservationData = location.state;

  // Chaque champ du formulaire a sa propre variable
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Pré-remplir les champs date et time si des données viennent du calendrier
  useEffect(() => {
    if (reservationData) {
      // Formater la date pour l'input HTML (format YYYY-MM-DD obligatoire)
      if (reservationData.date) {
        const selectedDate = new Date(reservationData.date);
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        setDate(year + '-' + month + '-' + day);
      }
      
      // Extraire l'heure de début du créneau (ex: "10:00 - 11:00" devient "10:00")
      if (reservationData.slot) {
        const startTime = reservationData.slot.split(' - ')[0];
        setTime(startTime);
      }
    }
  }, []);

  // Fonction appelée quand on clique sur le bouton
  const handleSubmit = () => {
    console.log('Nom:', name);
    console.log('Email:', email);
    console.log('Téléphone:', phone);
    console.log('Date:', date);
    console.log('Heure:', time);
  };

  // Vérifier si tous les champs sont remplis
  let formIsComplete = false;
  if (name !== '' && email !== '' && phone !== '' && date !== '' && time !== '') {
    formIsComplete = true;
  }

  return (
    <div className="form-reservation-container">
      <h2>Réservez votre rendez-vous</h2>
      <div className="reservation-form">
        
        <label>
          Nom:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => { setName(e.target.value); }} 
          />
        </label>

        <label>
          Email:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); }} 
          />
        </label>

        <label>
          Téléphone:
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => { setPhone(e.target.value); }} 
          />
        </label>

        <label>
          Date:
          <input 
            type="date" 
            value={date} 
            onChange={(e) => { setDate(e.target.value); }} 
          />
        </label>

        <label>
          Heure:
          <input 
            type="time" 
            value={time} 
            onChange={(e) => { setTime(e.target.value); }} 
          />
        </label>

        <ButtonValidation 
          text="Confirmer ma réservation"
          navigateTo="/confirmation"
          onClick={handleSubmit}
          disabled={!formIsComplete}
        />
      </div>
    </div>
  );
};

export default FormReservation;