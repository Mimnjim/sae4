import '../styles/Conditions.css';

const FREE_CONDITIONS = [
  {
    title: 'Jeunes de moins de 26 ans',
    description: "Sur présentation d'un titre d'identité ou autre justificatif nominatif en cours de validité avec photographie et la date de naissance.",
  },
  {
    title: 'Visiteurs handicapés et un accompagnateur',
    description: "Sur présentation d'un titre d'identité ou autre justificatif nominatif en cours de validité avec photographie et la date de naissance.",
  },
  {
    title: 'Enseignants',
    description: "Sur présentation du Pass Éducation en cours de validité délivré par le ministère de l'Éducation nationale et tamponné par l'établissement avec photographie. Le « e-pass » n'est pas accepté.",
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
    description: "Sur présentation d'un titre d'identité ou autre justificatif nominatif en cours de validité avec photographie et la date de naissance.",
  },
];

// Groupe de conditions dans un <details> réutilisable
const ConditionGroup = ({ title, conditions }) => (
  <details>
    <summary>{title}</summary>
    <div className="cond-list">
      {conditions.map((condition) => (
        <div key={condition.title} className="cond-item">
          <strong>{condition.title}</strong>
          <p>{condition.description}</p>
        </div>
      ))}
    </div>
  </details>
);

const Conditions = () => (
  <section className="conditions">
    {/* R234 : titre de section pour la hiérarchie */}
    <h2 className="conditions__title">Conditions tarifaires</h2>
    <ConditionGroup title="Conditions de gratuité" conditions={FREE_CONDITIONS} />
    <ConditionGroup title="Tarif réduit" conditions={REDUCED_CONDITIONS} />
  </section>
);

export default Conditions;