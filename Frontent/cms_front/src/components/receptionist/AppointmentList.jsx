import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import AppointmentTable from "./AppointmentTable";
import { fetchAppointments, fetchPatients } from "../../services/receptionistService";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log('Fetching appointments and patients...');
      const [apptData, patientData] = await Promise.all([
        fetchAppointments().catch(e => {
          console.error('Error in fetchAppointments:', e);
          throw e;
        }), 
        fetchPatients().catch(e => {
          console.error('Error in fetchPatients:', e);
          throw e;
        })
      ]);
      
      console.log('Appointments data:', apptData);
      console.log('Patients data:', patientData);
      
      const appointmentsList = Array.isArray(apptData) ? apptData : (apptData?.results || []);
      console.log('Processed appointments:', appointmentsList);
      
      setAppointments(appointmentsList);
      setPatients(Array.isArray(patientData) ? patientData : (patientData?.results || []));
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message || "Unable to load data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0" style={{ fontSize: "40px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", color: "transparent" }}>APPOINTMENT MANAGEMENT</h4>
            <button className="btn btn-outline-success btn-sm" onClick={loadData}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success mb-2"></div>
              <div>Loading appointments...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : appointments.length === 0 ? (
            <div className="alert alert-warning text-center">No appointments found.</div>
          ) : (
            <AppointmentTable
              appointments={appointments}
              patients={patients}       // pass patients here
              onDataChange={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
