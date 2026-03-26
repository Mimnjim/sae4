const UsersTable = ({ users, onDelete, onChangeRole }) => (
  <div>
    <h3>Utilisateurs</h3>
    <div className="bo-table-wrap table-wrap">
      <table className="bo-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.firstname} {user.lastname}</td>
              <td>
                {/* R93 + R162 : select inline plutôt qu'un prompt() natif */}
                <label htmlFor={`role-${user.id}`} className="sr-only">
                  Rôle de {user.firstname}
                </label>
                <select
                  id={`role-${user.id}`}
                  value={user.role}
                  onChange={e => onChangeRole(user.id, e.target.value)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </td>
              <td className="bo-actions">
                <button type="button" className="delete" onClick={() => onDelete(user.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersTable;