import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // styles de base de la librairie
import '../styles/calendrier.css';         // nos overrides CSS par-dessus

// Composant wrapper autour de react-calendar
// On l'isole dans son propre fichier pour pouvoir changer de librairie
// de calendrier un jour sans toucher au reste du code
//
// Props :
//   date    → date actuellement sélectionnée (string ou objet Date)
//   setDate → fonction appelée quand l'utilisateur clique sur une date
const Calendrier = ({ date, setDate }) => {
  // On bloque toutes les dates avant aujourd'hui
  // react-calendar grise automatiquement les jours non sélectionnables
  const today = new Date();

  return (
    <div className="form-reservation__calendar">
      <Calendar
        // Si aucune date n'est encore choisie, on affiche le mois en cours
        value={date ? new Date(date) : today}
        onChange={setDate}
        locale="fr-FR"
        minDate={today}
      />
    </div>
  );
};

export default Calendrier;