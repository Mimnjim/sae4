import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendrier.css';

// Wrapper react-calendar — isolé pour faciliter un éventuel changement de librairie
const Calendrier = ({ date, setDate }) => {
  const { t, i18n } = useTranslation();
  const today = new Date();

  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const weekdays = t('calendar.weekdays', { returnObjects: true }) || ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Short labels to display in the navigation to avoid long duplicated text
  const prevShort = t('calendar.prev_short') || '‹';
  const nextShort = t('calendar.next_short') || '›';
  const prev2Short = t('calendar.prev2_short') || '«';
  const next2Short = t('calendar.next2_short') || '»';

  return (
    <div className="form-reservation__calendar">
      <Calendar
        value={date ? new Date(date) : today}
        onChange={setDate}
        locale={locale}
        minDate={today}
        prevLabel={prevShort}
        nextLabel={nextShort}
        prev2Label={prev2Short}
        next2Label={next2Short}
        formatShortWeekday={(localeArg, dateArg) => weekdays[dateArg.getDay()]}
      />
    </div>
  );
};

export default Calendrier;