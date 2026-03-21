import React from 'react';

const ReservationsTable = ({reservations, onDelete}) => {
  return (
    <div>
      <h3>Réservations</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr><th>ID</th><th>Référence</th><th>Date</th><th>Contact</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{r.id}</td>
              <td>{r.reference}</td>
              <td>{r.reservation_date}</td>
              <td>{r.contact_firstname} {r.contact_lastname} ({r.contact_email})</td>
              <td>
                <button onClick={() => onDelete(r.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsTable;
