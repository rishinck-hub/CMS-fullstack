import React, { useEffect, useState } from "react";
import { fetchAppointments, deleteAppointment } from "../../services/receptionistService";

export default function AppointmentTable({ onDataChange }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAppointments();
      setAppointments(data.results || []);
    } catch (err) {
      setError(err.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      loadAppointments();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert("Error deleting appointment: " + err);
    }
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <table className="table table-striped table-hover">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Date & Time</th>
          <th>Status</th>
          <th>Receptionist</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.patient?.first_name} {a.patient?.last_name}</td>
            <td>{a.doctor?.first_name} {a.doctor?.last_name}</td>
            <td>{new Date(a.date_time).toLocaleString()}</td>
            <td>{a.status}</td>
            <td>{a.receptionist?.first_name || "N/A"}</td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(a.id)}
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
