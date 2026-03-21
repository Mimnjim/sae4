import '../styles/Conditions.css';

// On sort le contenu du JSX et on le met dans des tableaux de données.
// Avantage : pour ajouter ou modifier une condition, tu touches uniquement
// ces tableaux — pas besoin de fouiller dans le HTML.

const FREE_CONDITIONS = [
  {
    title: 'Jeunes de moins de 26 ans',
    description:
      "Sur présentation d'un titre d'identité ou autre justificatif nominatif en cours de validité avec photographie et la date de naissance.",
  },
  {
    title: 'Visiteurs handicapés et un accompagnateur',
    description:
      "Sur présentation d'un titre d'identité ou autre justificatif nominatif en cours de validité avec photographie et la date de naissance.",
  },
  {
    title: 'Enseignants',
    description:
      "Sur présentation du Pass Éducation en cours de validité délivré par le ministère de l'Éducation nationale et tamponné par l'établissement avec photographie. Le « e-pass » n'est pas accepté au regard des indications du ministère de l'Éducation nationale.",
  },
  {
    title: 'Personnel du musée',
    description: 'Sur présentation du badge professionnel nominatif avec photographie.',
  },
];

const REDUCED_CONDITIONS = [
  {
    title: 'Étudiants',
    description: "Sur présentation d'une carte étudiante avec photographie.",
  },
  {
    title: 'Séniors de plus de 60 ans',
    description:
      "Sur présentation d'un titre d'identité ou autre justificatif nominatif en cours de validité avec photographie et la date de naissance.",
  },
];

// Petit composant interne qui affiche une liste de conditions dans un <details>
// On le réutilise pour les deux sections (gratuité + tarif réduit)
const ConditionGroup = ({ title, conditions }) => (
  <details>
    <summary>{title}</summary>
    <div className="cond-list">
      {conditions.map((condition) => (
        // On utilise le titre comme clé car il est unique dans chaque groupe
        <div key={condition.title} className="cond-item">
          <strong>{condition.title}</strong>
          <p>{condition.description}</p>
        </div>
      ))}
    </div>
  </details>
);

const Conditions = () => {
  return (
    <section className="conditions">
      <ConditionGroup title="Conditions de gratuité" conditions={FREE_CONDITIONS} />
      <ConditionGroup title="Tarif réduit"           conditions={REDUCED_CONDITIONS} />
    </section>
  );
};

export default Conditions;