import ButtonGame from '../components/ButtonGame';

const Experiences = () => {
  // Style de la page
  const pagePadding = '100px';
  const pageColor = '#00ffff';

  return (
    <div className="experiences-page" style={{ padding: pagePadding, color: pageColor }}>
      <h1>ARCHIVES SYNAPTIQUES</h1>
      <p>Sélectionnez un niveau d'immersion :</p>
      <div className="levels-menu">
        <ButtonGame text="NIVEAU 01 : NEO-TOKYO RUN" navigateTo="/game/1" />
        <ButtonGame text="NIVEAU 02 : GHOST HACK" navigateTo="/game/2" />
        <ButtonGame text="NIVEAU 03 : AU-DELÀ DE L'HUMAIN" navigateTo="/game/3" />
      </div>
    </div>
  );
};

export default Experiences;