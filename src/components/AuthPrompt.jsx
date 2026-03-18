import { useNavigate } from 'react-router-dom';

export default function AuthPrompt({ message }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>{message || 'Vous devez être connecté pour réserver'}</h3>
      <p style={{ marginBottom: '1rem', color: '#555' }}>Connectez-vous ou créez un compte pour poursuivre.</p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '0.6rem 1rem', borderRadius: 6, border: '1px solid #007bff', background: '#007bff', color: '#fff' }}
        >
          Se connecter
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{ padding: '0.6rem 1rem', borderRadius: 6, border: '1px solid #666', background: '#fff', color: '#333' }}
        >
          S'inscrire
        </button>
      </div>
    </div>
  );
}
