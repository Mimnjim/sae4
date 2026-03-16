import { useState } from 'react';
import ButtonValidation from './ButtonValidation';

// Composant formulaire de connexion
function LoginForm({ onSuccess, setUser }) {
  // États pour stocker email, password et état de chargement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Fonction appelée au clic sur le bouton
  function handleSubmit() {
    setLoading(true);
    
    // Appel API pour se connecter
    fetch('http://localhost:8888/sae4/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      console.log('Connexion réussie:', data);
      // Stocker le token et les infos user dans localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Mettre à jour l'état global
      setUser(data.user);
      setLoading(false);
      onSuccess(); // Redirection
    });
  }

  return (
    <div>
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
        text={loading ? "Connexion..." : "Se connecter"}
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );
}

export default LoginForm;
