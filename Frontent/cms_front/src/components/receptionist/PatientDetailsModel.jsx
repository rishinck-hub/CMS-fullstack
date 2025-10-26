import React, { useEffect, useState } from "react";
import { fetchPatient } from "../../services/receptionistService";

export default function PatientDetailsModal({ patientId, show, onClose }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !patientId) return;
    let mounted = true;

    async function loadPatient() {
      try {
        setLoading(true);
        const data = await fetchPatient(patientId);
        if (mounted) setPatient(data);
      } catch (err) {
        console.error("Error loading patient:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
    return () => {
      mounted = false;
    };
  }, [show, patientId]);

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Patient Details{" "}
              {patient ? `: ${patient.first_name} ${patient.last_name}` : ""}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading && <div>Loading...</div>}

            {!loading && patient && (
              <>
                <h6>Patient Information</h6>
                <dl className="row">
                  <dt className="col-3">First Name</dt>
                  <dd className="col-9">{patient.first_name || "N/A"}</dd>

                  <dt className="col-3">Last Name</dt>
                  <dd className="col-9">{patient.last_name || "N/A"}</dd>

                  <dt className="col-3">Date of Birth</dt>
                  <dd className="col-9">{patient.dob || "N/A"}</dd>

                  <dt className="col-3">Gender</dt>
                  <dd className="col-9">{patient.gender || "N/A"}</dd>

                  <dt className="col-3">Phone</dt>
                  <dd className="col-9">{patient.phone || "N/A"}</dd>

                  <dt className="col-3">Address</dt>
                  <dd className="col-9">{patient.address || "N/A"}</dd>

                  <dt className="col-3">Blood Group</dt>
                  <dd className="col-9">{patient.blood_group || "N/A"}</dd>

                  <dt className="col-3">Emergency Contact</dt>
                  <dd className="col-9">{patient.emergency_contact || "N/A"}</dd>

                  <dt className="col-3">Medical History</dt>
                  <dd className="col-9">{patient.medical_history || "N/A"}</dd>
                </dl>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
