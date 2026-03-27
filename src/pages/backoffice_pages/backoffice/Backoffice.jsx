import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Stats from '../../../components/backoffice_components/Stats.jsx';
import UsersTable from '../../../components/backoffice_components/UsersTable.jsx';
import ReservationsTable from '../../../components/backoffice_components/ReservationsTable.jsx';
import '../../../styles/backoffice/backoffice.css';

const Backoffice = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [token, setToken] = useState(null);

  // verify token and admin on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt') || localStorage.getItem('token');
    
    if (!storedToken) { 
      setIsAdmin(false); 
      setToken(null);
      return; 
    }
    
    setToken(storedToken);
    const headers = { 'Authorization': 'Bearer ' + storedToken, 'X-Authorization': 'Bearer ' + storedToken };
    
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
    if (!token) return;
    const headers = { 'Authorization': 'Bearer ' + token, 'X-Authorization': 'Bearer ' + token };
    setLoading(true);
    fetch('https://apimusee.tomdelavigne.fr/api/users.php?all=1', { headers })
      .then(r => r.json())
      .then(j => setUsers(j.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  function loadReservations() {
    if (!token) return;
    const headers = { 'Authorization': 'Bearer ' + token, 'X-Authorization': 'Bearer ' + token };
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
    if (!token) return;
    const headers = { 'Authorization': 'Bearer ' + token, 'X-Authorization': 'Bearer ' + token };
    if (!confirm(t('backoffice.confirmDeleteUser'))) return;
    fetch('https://apimusee.tomdelavigne.fr/api/users.php?id=' + id, { method: 'DELETE', headers })
      .then(() => loadUsers());
  }

  function changeUserRole(id, role) {
    if (!token) return;
    const headers = { 'Authorization': 'Bearer ' + token, 'X-Authorization': 'Bearer ' + token, 'Content-Type':'application/json' };
    fetch('https://apimusee.tomdelavigne.fr/api/users.php?id=' + id, { method: 'PUT', headers, body: JSON.stringify({role}) })
      .then(() => loadUsers());
  }

  function deleteReservation(id) {
    if (!token) return;
    const headers = { 'Authorization': 'Bearer ' + token, 'X-Authorization': 'Bearer ' + token };
    if (!confirm(t('backoffice.confirmDeleteReservation'))) return;
    fetch('https://apimusee.tomdelavigne.fr/api/reservations.php?id=' + id, { method: 'DELETE', headers })
      .then(() => loadReservations());
  }

  if (!token) {
    return (
      <div className="backoffice-access-denied">
        <div className="access-denied-card">
          <h1>{t('backoffice.adminArea')}</h1>
          <p>{t('backoffice.loginAsAdmin')}</p>
          <a href="/login" className="access-denied-button">{t('backoffice.login')} →</a>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="backoffice-access-denied">
        <div className="access-denied-card loading">
          <div className="access-denied-spinner"></div>
          <p>{t('backoffice.verifying')}</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="backoffice-access-denied">
        <div className="access-denied-card denied">
          <h1>{t('backoffice.noAccess')}</h1>
          <p>{t('backoffice.noPermissions')}</p>
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="/" className="access-denied-button secondary">{t('backoffice.backHome')} →</a>
            <a href="/login" className="access-denied-button" onClick={() => localStorage.removeItem('jwt')} style={{cursor: 'pointer'}}>{t('backoffice.switchAccount')} →</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backoffice">
      <div className="backoffice-header">
        <h1 className="backoffice-title">{t('backoffice.dashboard')}</h1>
        <div className="backoffice-nav">
          <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>{t('backoffice.stats')}</button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>{t('backoffice.users')}</button>
          <button className={tab === 'reservations' ? 'active' : ''} onClick={() => setTab('reservations')}>{t('backoffice.reservations')}</button>
        </div>
      </div>

      {loading && <div className="muted loading">{t('profile.loading')}</div>}

      <div className="backoffice-body">
        {tab === 'stats' && <Stats reservations={reservations} />}
        {tab === 'users' && <UsersTable users={users} onDelete={deleteUser} onChangeRole={changeUserRole} />}
        {tab === 'reservations' && <ReservationsTable reservations={reservations} onDelete={deleteReservation} />}
      </div>
    </div>
  );
};

export default Backoffice;
