import { Link } from 'react-router-dom';

export default function RegisterSent() {
  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '2rem auto' }}>
      <h2>Inscription réussie</h2>
      <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.</p>
      <p><Link to="/login">Aller à la page de connexion</Link></p>
    </div>
  );
}
