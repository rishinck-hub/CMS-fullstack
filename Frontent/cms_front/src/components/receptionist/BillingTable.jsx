import React, { useEffect, useState } from "react";
import { fetchBills, deleteBill } from "../../services/receptionistService";

export default function BillingTable({ onDataChange }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBills = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchBills();
      setBills(data.results || []);
    } catch (err) {
      setError(err.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await deleteBill(id);
      loadBills();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert("Error deleting bill: " + err);
    }
  };

  if (loading) return <div>Loading bills...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Appointment</th>
          <th>Consultation Fee</th>
          <th>Medicine Fee</th>
          <th>Total Fee</th>
          <th>Created By</th>
          <th>Timestamp</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.appointment?.id}</td>
            <td>{b.consultation_fee}</td>
            <td>{b.medicine_fee}</td>
            <td>{b.total_fee}</td>
            <td>{b.created_by?.first_name || "N/A"}</td>
            <td>{new Date(b.timestamp).toLocaleString()}</td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(b.id)}
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
