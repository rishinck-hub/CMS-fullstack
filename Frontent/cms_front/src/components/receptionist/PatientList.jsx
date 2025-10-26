import React, { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import PatientTable from "./PatientTable";
import { fetchPatients } from "../../services/receptionistService";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          {/* Header + Refresh Button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4
              className="fw-bold mb-0"
              style={{ fontSize: "40px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", color: "transparent" }}
            >
              MANAGE PATIENTS
            </h4>
            <button
              className="btn btn-sidebar-refresh btn-sm"
              onClick={loadPatients}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </>
              )}
            </button>
          </div>

          {/* Patient Table / Loading */}
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <PatientTable patients={patients} onDataChange={loadPatients} />
          )}
        </div>
      </div>

      {/* Refresh Button Styles */}
      <style>{`
        .btn-sidebar-refresh {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          font-weight: 500;
          transition: 0.3s;
        }
        .btn-sidebar-refresh:hover {
          background: #5a67d8;
          color: #fff;
        }
        .btn-sidebar-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
