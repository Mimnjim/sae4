import ButtonGame from '../components/ButtonGame';

export default function Experiences() {
  return (
    <div className="experiences-page" style={{ padding: '100px', color: '#00ffff' }}>
      <h1>ARCHIVES SYNAPTIQUES</h1>
      <p>Sélectionnez un niveau d'immersion :</p>
      <div className="levels-menu">
        <ButtonGame text="NIVEAU 01 : NEO-TOKYO RUN" navigateTo="/game/1" />
        <ButtonGame text="NIVEAU 02 : GHOST HACK" navigateTo="/game/2" />
        <ButtonGame text="NIVEAU 03 : AU-DELÀ DE L'HUMAIN" navigateTo="/game/3" />
      </div>
    </div>
  );
}