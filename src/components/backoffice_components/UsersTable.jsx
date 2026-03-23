import React from 'react';

const UsersTable = ({users, onDelete, onChangeRole}) => {
  return (
    <div>
      <h3>Utilisateurs</h3>
      <div className="bo-table-wrap table-wrap">
        <table className="bo-table">
        <thead>
          <tr><th>ID</th><th>Email</th><th>Nom</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.firstname} {u.lastname}</td>
              <td>{u.role}</td>
              <td className="bo-actions">
                <button onClick={() => { const r = prompt('Nouveau rôle', u.role); if (r) onChangeRole(u.id, r); }}>Changer rôle</button>
                <button className="delete" onClick={() => onDelete(u.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
