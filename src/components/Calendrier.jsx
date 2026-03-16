import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendrier.css';

const Calendrier = ({ date, setDate }) => {
  return (
    <div className="form-reservation__calendar">
      <Calendar
        value={date ? new Date(date) : new Date()}
        onChange={setDate}
        locale="fr-FR"
      />
    </div>
  );
};

export default Calendrier;
    
