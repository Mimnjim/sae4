import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/components/book_components/calendrier.css';

// Wrapper react-calendar — isolé pour faciliter un éventuel changement de librairie
const Calendrier = ({ date, setDate }) => {
  const today = new Date();

  return (
    <div className="form-reservation__calendar">
      <Calendar
        value={date ? new Date(date) : today}
        onChange={setDate}
        locale="fr-FR"
        minDate={today}
      />
    </div>
  );
};

export default Calendrier;