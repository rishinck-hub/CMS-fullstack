import React, { useEffect, useState } from "react";
import { fetchPatients, deletePatient } from "../../services/receptionistService";
import PatientTable from "../../components/receptionist/PatientTable";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(id);
        loadPatients();
      } catch (error) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;

  return (
    <div className="container mt-4">
      <h3>Manage Patients</h3>
      <PatientTable patients={patients} onDelete={handleDelete} />
    </div>
  );
}
