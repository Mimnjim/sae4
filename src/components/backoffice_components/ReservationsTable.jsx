const ReservationsTable = ({ reservations, onDelete }) => (
  <div>
    <h3>Réservations</h3>
    <div className="bo-table-wrap table-wrap">
      <table className="bo-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Référence</th>
            <th>Date</th>
            <th>Contact</th>
            <th>Actions</th>
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

export default ReservationsTable;