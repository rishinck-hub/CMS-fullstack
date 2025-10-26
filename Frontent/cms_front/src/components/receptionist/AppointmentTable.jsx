import React, { useEffect, useState } from "react";
import { BsCalendarCheck, BsClock, BsCheckCircle } from "react-icons/bs";
import {
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  fetchDoctors,
  fetchReceptionists,
  fetchPatients,
} from "../../services/receptionistService";

export default function AppointmentManagement({
  doctors = [],
  receptionists = [],
  patients = [],
}) {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [editing, setEditing] = useState(null);

  // local copies (will be fetched if props are empty)
  const [localDoctors, setLocalDoctors] = useState(doctors || []);
  const [localReceptionists, setLocalReceptionists] = useState(receptionists || []);
  const [localPatients, setLocalPatients] = useState(patients || []);

  const initialFormData = {
    date_time: "",
    status: "Scheduled",
    doctor_id: "",
    receptionist_id: "",
    patient_id: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const STATUS_CHOICES = ["Scheduled", "Completed", "Cancelled"];

  // ✅ Fetch appointments
  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data.results || data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    loadAppointments();

    // fetch supporting lists only if props didn't provide them (use service helpers)
    const loadLists = async () => {
      if (!doctors || doctors.length === 0) {
        try {
          const docs = await fetchDoctors();
          setLocalDoctors(docs || []);
        } catch (err) {
          console.warn("Failed to load doctors:", err);
        }
      }
      if (!receptionists || receptionists.length === 0) {
        try {
          const recs = await fetchReceptionists();
          setLocalReceptionists(recs || []);
        } catch (err) {
          console.warn("Failed to load receptionists:", err);
        }
      }
      if (!patients || patients.length === 0) {
        try {
          const pats = await fetchPatients();
          setLocalPatients(pats || []);
        } catch (err) {
          console.warn("Failed to load patients:", err);
        }
      }
    };

    loadLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Name Extractor Helpers
  const getDoctorName = (doc) => {
    if (!doc) return "N/A";
    if (typeof doc === "object" && doc.full_name) return doc.full_name;
    if (typeof doc === "object" && doc.user)
      return `${doc.user.first_name || ""} ${doc.user.last_name || ""}`.trim() ||
        doc.user.username ||
        "N/A";
    if (typeof doc === "number") {
      const found = localDoctors.find((d) => d.id === doc) || doctors.find((d) => d.id === doc);
      if (!found) return `Doctor ${doc}`;
      return found.user
        ? `${found.user.first_name} ${found.user.last_name}`
        : found.name || found.full_name || `Doctor ${doc}`;
    }
    return "N/A";
  };

  const getReceptionistName = (rec) => {
    if (!rec) return "N/A";
    if (typeof rec === "object" && rec.full_name) return rec.full_name;
    if (typeof rec === "object" && rec.user)
      return `${rec.user.first_name || ""} ${rec.user.last_name || ""}`.trim() ||
        rec.user.username ||
        "N/A";
    if (typeof rec === "number") {
      const found = localReceptionists.find((r) => r.id === rec) || receptionists.find((r) => r.id === rec);
      if (!found) return `Receptionist ${rec}`;
      return found.user
        ? `${found.user.first_name} ${found.user.last_name}`
        : found.name || `Receptionist ${rec}`;
    }
    return "N/A";
  };

  const getPatientName = (pat) => {
    if (!pat) return "N/A";
    if (typeof pat === "number") {
      const found = localPatients.find((p) => p.id === pat) || patients.find((p) => p.id === pat);
      if (!found) return `Patient ${pat}`;
      return `${found.first_name} ${found.last_name}`;
    }
    return `${pat.first_name || ""} ${pat.last_name || ""}`.trim() || "N/A";
  };

  // ✅ CRUD Handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    try {
      await addAppointment(formData);
      setFormData(initialFormData);
      setShowForm(false);
      loadAppointments();
    } catch (err) {
      console.error("Error adding appointment (full):", err);
      const server = err && err.response ? err.response.data : err;
      const msg = typeof server === "object" ? JSON.stringify(server) : String(server);
      alert("Error adding appointment: " + msg);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateAppointment(editing.id, formData);
      setEditing(null);
      setFormData(initialFormData);
      setShowForm(false);
      loadAppointments();
    } catch (err) {
      console.error("Error updating appointment (full):", err);
      const server = err && err.response ? err.response.data : err;
      const msg = typeof server === "object" ? JSON.stringify(server) : String(server);
      alert("Error updating appointment: " + msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;
    try {
      await deleteAppointment(id);
      loadAppointments();
    } catch (err) {
      alert("Error deleting appointment: " + err);
    }
  };

  // ✅ FIXED: Properly load doctor/receptionist/patient IDs for edit mode
  const handleEdit = (appt) => {
    setEditing(appt);
    setFormData({
      date_time: appt.date_time,
      status: appt.status,
      doctor_id: appt.doctor?.id || appt.doctor_id || "",
      receptionist_id: appt.receptionist?.id || appt.receptionist_id || "",
      patient_id: appt.patient?.id || appt.patient_id || "",
    });
    setShowForm(true);
  };

  const handleView = (appt) => {
    setSelectedAppointmentId(appt.id);
    setShowDetails(true);
  };

  const filteredAppointments = appointments.filter((a) => {
    const patientName = getPatientName(a.patient).toLowerCase();
    return patientName.includes(search.toLowerCase());
  });

  // --- NEW: compute stats
  const todayDate = new Date().toDateString();
  const todaysAppointmentsCount = appointments.filter(
    (a) => a.date_time && new Date(a.date_time).toDateString() === todayDate
  ).length;
  const scheduledAppointmentsCount = appointments.filter(
    (a) => a.status === "Scheduled"
  ).length;
  const completedAppointmentsCount = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  // selected appointment for the inline modal
  const selectedAppt = appointments.find(a => a.id === selectedAppointmentId) || null;

  return (
    <div className="container mt-4">
      {/* --- UPDATED: Stats Overview (top) - use flex to keep three cards on one line */}
      <div className="row mb-3 g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon me-3" style={{ backgroundColor: '#e3ebfc', color: '#1cc88a' }}>
                <BsCalendarCheck size={24} />
              </div>
              <div>
                <div className="text-muted small">Today's Appointments</div>
                <div className="fs-5 fw-bold" style={{ color: '#1cc88a' }}>{todaysAppointmentsCount}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon me-3" style={{ backgroundColor: '#fef7e6', color: '#f6c23e' }}>
                <BsClock size={24} />
              </div>
              <div>
                <div className="text-muted small">Scheduled Appointments</div>
                <div className="fs-5 fw-bold" style={{ color: '#f6c23e' }}>{scheduledAppointmentsCount}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon me-3" style={{ backgroundColor: '#d1f3e8', color: '#4e73df' }}>
                <BsCheckCircle size={24} />
              </div>
              <div>
                <div className="text-muted small">Completed Appointments</div>
                <div className="fs-5 fw-bold" style={{ color: '#4e73df' }}>{completedAppointmentsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by patient name..."
          className="form-control w-50 me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-sidebar"
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData(initialFormData);
          }}
        >
          + Book Appointment
        </button>
      </div>

      {/* Add/Edit Form - Replace inline card with modal */}
      {showForm && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Edit Appointment" : "Book New Appointment"}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="date_time"
                      className="form-control"
                      value={formData.date_time || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {STATUS_CHOICES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Doctor</label>
                    <select
                      name="doctor_id"
                      className="form-select"
                      value={formData.doctor_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Doctor</option>
                      {(localDoctors || []).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.user
                            ? `${d.user.first_name} ${d.user.last_name}`
                            : d.name || d.full_name || `Doctor ${d.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Patient</label>
                    <select
                      name="patient_id"
                      className="form-select"
                      value={formData.patient_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Patient</option>
                      {(localPatients || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {`${p.first_name || ""} ${p.last_name || ""}`.trim() || `Patient ${p.id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Receptionist</label>
                    <select
                      name="receptionist_id"
                      className="form-select"
                      value={formData.receptionist_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Receptionist</option>
                      {(localReceptionists || []).map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.user
                            ? `${r.user.first_name} ${r.user.last_name}`
                            : r.name || r.full_name || `Receptionist ${r.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button
                  className="btn btn-sidebar"
                  onClick={editing ? handleUpdate : handleAdd}
                >
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Table */}
      <div className="card shadow-sm">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light text-center">
            <tr>
              <th>#</th>
              <th>Patient Name</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Doctor Name</th>
              <th>Receptionist Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a, idx) => (
                <tr key={a.id}>
                  <td>{idx + 1}</td>
                  <td>{getPatientName(a.patient)}</td>
                  <td>{new Date(a.date_time).toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.status === "Completed"
                          ? "bg-success"
                          : a.status === "Cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>{getDoctorName(a.doctor)}</td>
                  <td>{getReceptionistName(a.receptionist)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-sidebar me-1"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-sidebar-info me-1"
                      onClick={() => handleView(a)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-sidebar-danger"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal (inline) */}
      {showDetails && selectedAppt && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details : {getPatientName(selectedAppt.patient)}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDetails(false)}></button>
              </div>
              <div className="modal-body">
                <dl className="row">
                  <dt className="col-sm-3">Patient</dt>
                  <dd className="col-sm-9">{getPatientName(selectedAppt.patient)}</dd>

                  <dt className="col-sm-3">Doctor</dt>
                  <dd className="col-sm-9">{getDoctorName(selectedAppt.doctor)}</dd>

                  <dt className="col-sm-3">Specialization</dt>
                  <dd className="col-sm-9">
                    {
                      // try appointment doctor specialization first, otherwise lookup from localDoctors
                      (selectedAppt.doctor && (selectedAppt.doctor.specialization?.name || selectedAppt.doctor.specialization)) ||
                      (localDoctors.find(d => d.id === (selectedAppt.doctor?.id || selectedAppt.doctor_id))?.specialization?.name) ||
                      "N/A"
                    }
                  </dd>

                  <dt className="col-sm-3">Date & Time</dt>
                  <dd className="col-sm-9">{selectedAppt.date_time ? new Date(selectedAppt.date_time).toLocaleString() : "N/A"}</dd>

                  <dt className="col-sm-3">Status</dt>
                  <dd className="col-sm-9">{selectedAppt.status || "N/A"}</dd>
                </dl>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDetails(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button Styles */}
      <style>{`
        /* Reuse Billing styles for consistent look */
        .btn-sidebar {
          background: linear-gradient(135deg, #727da9ff 0%, #8a6ca9ff 100%);
          color: #fff;
          border: none;
          font-weight: 500;
          transition: 0.3s;
        }
        .btn-sidebar:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .btn-sidebar-secondary {
          background: #6c757d;
          color: #fff;
        }
        .btn-sidebar-secondary:hover {
          background: #5a6268;
        }
        .btn-sidebar-info {
          background: linear-gradient(135deg, #4356a7ff 0%, #723ea5ff 100%);
          color: #fff;
        }
        .btn-sidebar-info:hover {
          background: #138496;
        }
        .btn-sidebar-danger {
          background: linear-gradient(135deg, #253b9dff 0%, #5e2596ff 100%);
          color: #fff;
        }
        .btn-sidebar-danger:hover {
          background: #c82333;
        }

        /* Stat card / billing-like styles */
        .stats-row { display:flex; gap:16px; flex-wrap:nowrap; align-items:stretch; }
        .stats-row .card { border: none; min-width: 0; } /* min-width:0 allows flex children to shrink correctly */
        .stats-row .card .card-body { padding: 14px; }

        .stat-card { display: flex; align-items: center; gap: 12px; padding: 12px; }
        .stat-icon { width:48px; height:48px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:20px; }
        .stat-info .small { font-size:12px; color:#6c757d; }
        .stat-info .value { font-weight:700; font-size:18px; }

        /* small screens: allow horizontal scroll instead of wrapping */
        @media (max-width: 768px) {
          .stats-row { overflow-x: auto; padding-bottom:6px; }
        }

        /* keep table/card visuals consistent */
        .card.border-0.shadow-sm { border-radius:8px; }
      `}</style>
    </div>
  );
}

/* --- NEW: small StatCard component */
function StatCard({ title, value, color = "#4e73df" }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body stat-card">
        <div className="stat-icon" style={{ background: `${color}22`, color }}>
          {/* simple icon placeholder */}
          📋
        </div>
        <div className="stat-info">
          <div className="small">{title}</div>
          <div className="value">{value}</div>
        </div>
      </div>
    </div>
  );
}
