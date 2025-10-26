import React, { useEffect, useState } from "react";
import { fetchAppointment } from "../../services/receptionistService";

export default function AppointmentDetailsModal({
  appointmentId,
  show,
  onClose,
  doctors = [],
  receptionists = [],
  patients = [],
}) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !appointmentId) return;
    let mounted = true;

    async function loadAppointment() {
      try {
        setLoading(true);
        const data = await fetchAppointment(appointmentId);
        if (mounted) setAppointment(data);
      } catch (err) {
        console.error("Error loading appointment:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAppointment();
    return () => {
      mounted = false;
    };
  }, [show, appointmentId]);

  if (!show) return null;

  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.id === id);
    return doc ? doc.name : `Doctor ${id}`;
  };

  const getReceptionistName = (id) => {
    const rec = receptionists.find((r) => r.id === id);
    return rec ? rec.name : `Receptionist ${id}`;
  };

  const getPatientName = (id) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? `${patient.first_name} ${patient.last_name}` : `Patient ${id}`;
  };

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
              Appointment Details{" "}
              {appointment ? `: ${getPatientName(appointment.patient_id)}` : ""}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading && <div>Loading...</div>}

            {!loading && appointment && (
              <>
                <h6>Appointment Information</h6>
                <dl className="row">
                  <dt className="col-4">Patient</dt>
                  <dd className="col-8">{getPatientName(appointment.patient_id)}</dd>

                  <dt className="col-4">Doctor</dt>
                  <dd className="col-8">{getDoctorName(appointment.doctor_id)}</dd>

                  <dt className="col-4">Receptionist</dt>
                  <dd className="col-8">{getReceptionistName(appointment.receptionist_id)}</dd>

                  <dt className="col-4">Date & Time</dt>
                  <dd className="col-8">{new Date(appointment.date_time).toLocaleString()}</dd>

                  <dt className="col-4">Status</dt>
                  <dd className="col-8">{appointment.status}</dd>
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
