// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Oups ! 😅</h1>
      <h2>Erreur 404 : Cette page n'existe pas.</h2>
      <p>Tu t'es sûrement perdu en chemin.</p>
      
      {/* Un lien pour ramener l'utilisateur à l'accueil */}
      <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Retourner à la page d'accueil
      </Link>
    </div>
  );
}

export default NotFound;