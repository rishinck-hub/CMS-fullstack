import React from "react";

export default function AppointmentTable({ appointments, onDataChange }) {
  if (!appointments || appointments.length === 0)
    return <div>No appointments found.</div>;

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Patient ID</th>
          <th>Doctor ID</th>
          <th>Date Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.patient_id}</td>
            <td>{a.doctor_id}</td>
            <td>{a.date_time ? new Date(a.date_time).toLocaleString() : "N/A"}</td>
            <td>{a.status || "N/A"}</td>
            <td>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => alert("Edit appointment " + a.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => alert("Delete appointment " + a.id)}
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
