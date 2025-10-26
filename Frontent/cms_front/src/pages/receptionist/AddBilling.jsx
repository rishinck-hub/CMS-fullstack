import React, { useEffect, useState } from "react";
import { fetchBills, deleteBill } from "../../services/receptionistService";

export default function AddBilling() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBills = async () => {
    try {
      const data = await fetchBills();
      setBills(data);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this bill?")) {
      try {
        await deleteBill(id);
        loadBills();
      } catch (error) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  if (loading) return <p>Loading bills...</p>;

  return (
    <div className="container mt-4">
      <h3>Add Billing</h3>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.patient_name || b.patient?.name || "N/A"}</td>
              <td>{b.amount || "N/A"}</td>
              <td>{b.is_paid ? "Paid" : "Pending"}</td>
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
    </div>
  );
}
