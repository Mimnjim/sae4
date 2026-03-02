import React from 'react';
import { Link } from 'react-router-dom';

export default function Experiences() {
  return (
    <div className="experiences-page" style={{ padding: '100px', color: '#00ffff' }}>
      <h1>ARCHIVES SYNAPTIQUES</h1>
      <p>Sélectionnez un niveau d'immersion :</p>
      <div className="levels-menu">
        <Link to="/game/1"><button>NIVEAU 01 : NEO-TOKYO RUN</button></Link>
        <Link to="/game/2"><button>NIVEAU 02 : GHOST HACK</button></Link>
        <Link to="/game/3"><button>NIVEAU 03 : AU-DELÀ DE L'HUMAIN</button></Link>
      </div>
    </div>
  );
}