import React from "react";

export default function PatientTable({ patients, onDataChange }) {
  if (!patients || patients.length === 0) return <div>No patients found.</div>;

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => {
          const fullName = `${p.first_name || ""} ${p.last_name || ""}`.trim() || "N/A";
          const age = p.dob
            ? new Date().getFullYear() - new Date(p.dob).getFullYear()
            : "N/A";
          return (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{fullName}</td>
              <td>{age}</td>
              <td>{p.gender || "N/A"}</td>
              <td>{p.phone || "N/A"}</td>
              <td>{p.email || "N/A"}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => alert("Edit patient " + p.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => alert("Delete patient " + p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
