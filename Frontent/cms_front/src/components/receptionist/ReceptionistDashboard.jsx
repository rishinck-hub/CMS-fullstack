import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import StatCard from "../../ui/StatCard";
import PatientTable from "./PatientTable";
import AppointmentTable from "./AppointmentTable";
import BillingTable from "./BillingTable";
import { fetchDashboardStats } from "../../services/receptionistService";

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await fetchDashboardStats();
      // Example: { total_patients, total_appointments, total_revenue }
      setStats([
        { title: "Patients", value: data.total_patients, icon: "bi-person" },
        { title: "Appointments", value: data.total_appointments, icon: "bi-calendar-check" },
        { title: "Revenue", value: `$${data.total_revenue}`, icon: "bi-cash" },
      ]);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      setStats([]);
    }
    setLoadingStats(false);
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-3">
          <h2>Receptionist Dashboard</h2>

          {/* Stats Cards */}
          <div className="row my-4">
            {loadingStats ? (
              <div>Loading stats...</div>
            ) : (
              stats.map((stat, idx) => (
                <div className="col-md-4" key={idx}>
                  <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
                </div>
              ))
            )}
          </div>

          {/* Patients Table */}
          <div className="row mt-4">
            <div className="col-12">
              <h4>Patients</h4>
              <PatientTable onDataChange={() => setRefreshKey(k => k + 1)} />
            </div>
          </div>

          {/* Appointments Table */}
          <div className="row mt-4">
            <div className="col-12">
              <h4>Appointments</h4>
              <AppointmentTable onDataChange={() => setRefreshKey(k => k + 1)} />
            </div>
          </div>

          {/* Billing Table */}
          <div className="row mt-4">
            <div className="col-12">
              <h4>Billing</h4>
              <BillingTable onDataChange={() => setRefreshKey(k => k + 1)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
