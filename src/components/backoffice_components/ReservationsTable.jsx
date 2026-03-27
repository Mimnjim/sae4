import { useTranslation } from 'react-i18next';

const ReservationsTable = ({ reservations, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t('backoffice.reservations')}</h3>
      <div className="bo-table-wrap table-wrap">
        <table className="bo-table">
          <thead>
            <tr>
              <th>{t('backoffice.id')}</th>
              <th>{t('backoffice.reference')}</th>
              <th>{t('backoffice.dateColumn')}</th>
              <th>{t('backoffice.contact')}</th>
              <th>{t('backoffice.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.reference}</td>
                <td>{r.reservation_date}</td>
                <td>{r.contact_firstname} {r.contact_lastname} ({r.contact_email})</td>
                <td className="bo-actions">
                  <button type="button" className="delete" onClick={() => onDelete(r.id)}>
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

export default ReservationsTable;