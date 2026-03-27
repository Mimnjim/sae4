import { useTranslation } from 'react-i18next';

const UsersTable = ({ users, onDelete, onChangeRole }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3>{t('backoffice.users')}</h3>
      <div className="bo-table-wrap table-wrap">
        <table className="bo-table">
          <thead>
            <tr>
              <th>{t('backoffice.id')}</th>
              <th>{t('form.email')}</th>
              <th>{t('backoffice.name')}</th>
              <th>{t('backoffice.role')}</th>
              <th>{t('backoffice.actions')}</th>
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
                    {t('backoffice.roleOf')} {user.firstname}
                  </label>
                  <select
                    id={`role-${user.id}`}
                    value={user.role}
                    onChange={e => onChangeRole(user.id, e.target.value)}
                  >
                    <option value="user">{t('backoffice.userRole')}</option>
                    <option value="admin">{t('backoffice.adminRole')}</option>
                  </select>
                </td>
                <td className="bo-actions">
                  <button type="button" className="delete" onClick={() => onDelete(user.id)}>
                    {t('profile.delete')}
                  </button>
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