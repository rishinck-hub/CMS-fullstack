import React, { useState, useEffect, useContext } from "react";
import StatCard from "../../ui/StatCard";
import AppointmentTable from "./AppointmentTable";
import PatientTable from "./PatientTable";
import BillingTable from "./BillingTable";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import {
  fetchPatients,
  fetchAppointments,
  fetchBills,
  calculateDashboardStats,
} from "../../services/receptionistService";
import { useAuth } from "../../hooks/useRole";
import { NotificationContext } from "../../context/NotificationContext";

export default function ReceptionistDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load all data in parallel
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [patientData, appointmentData, billData] = await Promise.all([
        fetchPatients(),
        fetchAppointments(),
        fetchBills(),
      ]);

      setPatients(patientData);
      setAppointments(appointmentData);
      setBills(billData);

      const calculatedStats = calculateDashboardStats(
        patientData,
        appointmentData,
        billData
      );

      setStats([
        {
          title: "Total Patients",
          value: calculatedStats.total_patients,
          icon: "bi bi-person-heart",
          color: "#4e73df",
        },
        {
          title: "Today’s Appointments",
          value: calculatedStats.today_appointments,
          icon: "bi bi-calendar-event",
          color: "#1cc88a",
        },
        {
          title: "Pending Bills",
          value: calculatedStats.pending_bills,
          icon: "bi bi-cash-stack",
          color: "#f6c23e",
        },
      ]);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load dashboard data", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-bottom">
            <div className="container-fluid py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">Receptionist Dashboard</h2>
                  <p className="text-muted mb-0">Welcome back, {user?.username}</p>
                </div>
                <div>
                  <button
                    className="btn btn-outline-primary"
                    onClick={loadDashboardData}
                    disabled={loading}
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="container-fluid py-4">
            <div className="row mb-4">
              {loading ? (
                <div className="col-12 text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading dashboard data...</p>
                </div>
              ) : (
                stats.map((stat, idx) => (
                  <div className="col-xl-3 col-md-6 mb-4" key={idx}>
                    <StatCard
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Appointments Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Today’s Appointments</h6>
                  </div>
                  <div className="card-body">
                    <AppointmentTable
                      appointments={appointments}
                      onDataChange={loadDashboardData}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Patients Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Patient Records</h6>
                  </div>
                  <div className="card-body">
                    <PatientTable
                      patients={patients}
                      onDataChange={loadDashboardData}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Billing Records</h6>
                  </div>
                  <div className="card-body">
                    <BillingTable bills={bills} onDataChange={loadDashboardData} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
