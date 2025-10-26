import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import BillingTable from "./BillingTable";
import { fetchBills, fetchPatients, fetchAppointments } from "../../services/receptionistService";

export default function BillingList() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch bills, patients, and appointments simultaneously
      const [billsData, patientsData, appointmentsData] = await Promise.all([
        fetchBills(),
        fetchPatients(),
        fetchAppointments(),
      ]);

      setBills(Array.isArray(billsData) ? billsData : billsData.results || []);
      setPatients(patientsData);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.results || []);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Unable to load data. Please try again later.");
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
            <h4 className="fw-bold mb-0" style={{ fontSize: "40px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", color: "transparent" }}>BILLING RECORDS</h4>
            <button className="btn btn-outline-success btn-sm" onClick={loadData}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success"></div>
              <div>Loading billing records...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : bills.length === 0 ? (
            <div className="alert alert-warning text-center">No billing records found.</div>
          ) : (
            <BillingTable
              bills={bills}
              appointments={appointments}  // pass appointments here
              patients={patients}          // pass patients here
              onDataChange={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
