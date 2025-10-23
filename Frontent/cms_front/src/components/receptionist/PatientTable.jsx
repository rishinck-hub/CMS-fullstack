import React, { useEffect, useState } from "react";
import { fetchPatients, deletePatient } from "../../services/receptionistService";

export default function PatientTable({ onDataChange }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPatients();
      setPatients(data.results || []);
    } catch (err) {
      setError(err.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      loadPatients();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert("Error deleting patient: " + err);
    }
  };

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>DOB</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Blood Group</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.first_name}</td>
            <td>{p.last_name}</td>
            <td>{p.dob}</td>
            <td>{p.gender}</td>
            <td>{p.phone}</td>
            <td>{p.blood_group}</td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(p.id)}
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
