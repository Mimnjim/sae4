import React, { useState, useEffect } from 'react';
import Stats from '../../components/backoffice_components/Stats.jsx';
import UsersTable from '../../components/backoffice_components/UsersTable.jsx';
import ReservationsTable from '../../components/backoffice_components/ReservationsTable.jsx';
import '../../styles/backoffice/backoffice.css';

const Backoffice = () => {
  const [tab, setTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);

  const token = localStorage.getItem('jwt') || localStorage.getItem('token');
  const headers = token ? { 'Authorization': 'Bearer ' + token, 'X-Authorization': 'Bearer ' + token } : {};

  // verify admin on mount
  useEffect(() => {
    if (!token) { setIsAdmin(false); return; }
    fetch('https://apimusee.tomdelavigne.fr/api/users.php', { headers })
      .then(r => r.json())
      .then(j => {
        if (j && j.success && j.user && j.user.role === 'admin') setIsAdmin(true);
        else setIsAdmin(false);
      })
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === 'stats' || tab === 'reservations') loadReservations();
    if (tab === 'users') loadUsers();
  }, [tab, isAdmin]);

  function loadUsers() {
    setLoading(true);
    fetch('https://apimusee.tomdelavigne.fr/api/users.php?all=1', { headers })
      .then(r => r.json())
      .then(j => setUsers(j.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  function loadReservations() {
    setLoading(true);
    fetch('https://apimusee.tomdelavigne.fr/api/reservations.php', { headers })
      .then(r => r.json())
      .then(j => {
        // API returns array or {success:true, reservations:[]}
        if (Array.isArray(j)) setReservations(j);
        else setReservations(j.reservations || j || []);
      })
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }

  function deleteUser(id) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    fetch('https://apimusee.tomdelavigne.fr/api/users.php?id=' + id, { method: 'DELETE', headers })
      .then(() => loadUsers());
  }

  function changeUserRole(id, role) {
    fetch('https://apimusee.tomdelavigne.fr/api/users.php?id=' + id, { method: 'PUT', headers: {...headers, 'Content-Type':'application/json'}, body: JSON.stringify({role}) })
      .then(() => loadUsers());
  }

  function deleteReservation(id) {
    if (!confirm('Supprimer cette réservation ?')) return;
    fetch('https://apimusee.tomdelavigne.fr/api/reservations.php?id=' + id, { method: 'DELETE', headers })
      .then(() => loadReservations());
  }

  if (!token) return <div style={{padding:20}}>Accès backoffice: connectez-vous en tant qu'admin via /login</div>;
  if (isAdmin === null) return <div style={{padding:20}}>Vérification des droits...</div>;
  if (isAdmin === false) return <div style={{padding:20}}>Vous n'êtes pas autorisé à accéder à cette page.</div>;

  return (
    <div className="backoffice">
      <div className="backoffice-header">
        <div className="backoffice-nav">
          <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>Stats</button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Utilisateurs</button>
          <button className={tab === 'reservations' ? 'active' : ''} onClick={() => setTab('reservations')}>Réservations</button>
        </div>
      </div>

      {loading && <div className="muted">Chargement...</div>}

      <div className="backoffice-body">
        {tab === 'stats' && <Stats reservations={reservations} />}
        {tab === 'users' && <UsersTable users={users} onDelete={deleteUser} onChangeRole={changeUserRole} />}
        {tab === 'reservations' && <ReservationsTable reservations={reservations} onDelete={deleteReservation} />}
      </div>
    </div>
  );
};

export default Backoffice;
