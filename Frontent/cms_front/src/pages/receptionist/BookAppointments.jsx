import React, { useEffect, useState } from "react";
import { fetchAppointments, deleteAppointment } from "../../services/receptionistService";
import AppointmentTable from "../../components/receptionist/AppointmentTable";

export default function BookAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this appointment?")) {
      try {
        await deleteAppointment(id);
        loadAppointments();
      } catch (error) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="container mt-4">
      <h3>Book Appointments</h3>
      <AppointmentTable appointments={appointments} onDelete={handleDelete} />
    </div>
  );
}
