import { useState } from 'react';
import ButtonValidation from './ButtonValidation';

// Composant formulaire d'inscription
function RegisterForm({ onSuccess }) {
  // États pour stocker les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [loading, setLoading] = useState(false);

  // Fonction appelée au clic sur le bouton
  function handleSubmit() {
    setLoading(true);
    
    // Appel API pour créer un compte (chemin relatif pour utiliser le proxy Vite)
    fetch('/sae4_api/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname })
    })
    .then(res => res.json())
    .then(data => {
      console.log('Inscription réussie:', data);
      setLoading(false);
      onSuccess(); // Redirection vers login
    })
    .catch(err => {
      console.error('Erreur inscription:', err);
      setLoading(false);
      alert("Erreur lors de l'inscription. Vérifiez le serveur API.");
    });
  }

  return (
    <div>
      <div>
        <label>Prénom:</label>
        <input 
          type="text" 
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>

      <div>
        <label>Nom:</label>
        <input 
          type="text" 
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>

      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Mot de passe:</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <ButtonValidation 
        text={loading ? "Inscription en cours..." : "S'inscrire"}
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );
}

export default RegisterForm;
