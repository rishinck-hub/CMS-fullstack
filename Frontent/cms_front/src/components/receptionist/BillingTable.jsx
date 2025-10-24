import React from "react";

export default function BillingTable({ bills, onDataChange }) {
  if (!bills || bills.length === 0) return <div>No billing records found.</div>;

  const handleMarkPaid = (id) => {
    alert("Mark bill " + id + " as paid");
  };

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Appointment ID</th>
          <th>Consultation Fee</th>
          <th>Medicine Fee</th>
          <th>Total Fee</th>
          <th>Status</th>
          <th>Created By</th>
          <th>Timestamp</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.appointment?.id || "N/A"}</td>
            <td>{b.consultation_fee}</td>
            <td>{b.medicine_fee}</td>
            <td>{b.total_fee}</td>
            <td>{b.is_paid ? "Paid" : "Pending"}</td>
            <td>{b.created_by?.first_name || "N/A"}</td>
            <td>{new Date(b.timestamp).toLocaleString()}</td>
            <td>
              {!b.is_paid && (
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleMarkPaid(b.id)}
                >
                  Mark Paid
                </button>
              )}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => alert("Delete bill " + b.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
