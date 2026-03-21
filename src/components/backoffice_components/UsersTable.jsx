import React from 'react';

const UsersTable = ({users, onDelete, onChangeRole}) => {
  return (
    <div>
      <h3>Utilisateurs</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr><th>ID</th><th>Email</th><th>Nom</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.firstname} {u.lastname}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => { const r = prompt('Nouveau rôle', u.role); if (r) onChangeRole(u.id, r); }}>Changer rôle</button>
                <button onClick={() => onDelete(u.id)} style={{marginLeft:8}}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
