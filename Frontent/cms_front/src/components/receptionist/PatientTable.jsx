import React, { useEffect, useState } from "react";
import { BsPeople, BsPersonCheck, BsPersonDash } from "react-icons/bs";
import {
  fetchPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../../services/receptionistService";
import PatientDetailsModal from "../receptionist/PatientDetailsModel";

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [updatingIds, setUpdatingIds] = useState([]); // track in-progress enable/disable requests

  const initialFormData = {
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    emergency_contact: "",
    medical_history: "",
    blood_group: "",
    is_active: true, // <- default new patients as active
  };

  const [formData, setFormData] = useState(initialFormData);

  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      const list = data.results || data || [];
      // normalize: ensure every patient has is_active (default true)
      const normalized = list.map((p) =>
        Object.prototype.hasOwnProperty.call(p, "is_active") ? p : { ...p, is_active: true }
      );
      setPatients(normalized);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    try {
      // ensure new patient is active by default and append returned record to state
      const created = await addPatient({ ...formData, is_active: true });
      const createdNormalized = Object.prototype.hasOwnProperty.call(created, "is_active")
        ? created
        : { ...created, is_active: true };
      // prepend so newest appears first
      setPatients((prev) => [createdNormalized, ...prev]);
      setFormData(initialFormData);
      setShowForm(false);
    } catch (err) {
      alert("Error adding patient: " + err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePatient(editing.id, formData);
      setEditing(null);
      setFormData(initialFormData);
      setShowForm(false);
      loadPatients();
    } catch (err) {
      alert("Error updating patient: " + err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      loadPatients();
    } catch (err) {
      alert("Error deleting patient: " + err);
    }
  };

  const handleEdit = (patient) => {
    setEditing(patient);
    setFormData(patient);
    setShowForm(true);
  };

  const handleView = (patient) => {
    setSelectedPatientId(patient.id);
    setShowDetails(true);
  };

  // Optimistic toggle (enable/disable): update UI immediately, revert on error, show in-progress state
  const handleToggleActive = async (patient) => {
    const targetState = !Boolean(patient.is_active);
    const actionLabel = targetState ? "enable" : "disable";
    if (!window.confirm(`Are you sure you want to ${actionLabel} this patient?`)) return;

    setUpdatingIds((s) => [...s, patient.id]);
    const original = patients.find((p) => p.id === patient.id);
    // optimistic update
    setPatients((prev) => prev.map((p) => (p.id === patient.id ? { ...p, is_active: targetState } : p)));

    try {
      await updatePatient(patient.id, { ...original, is_active: targetState });
    } catch (err) {
      // revert on error
      setPatients((prev) => prev.map((p) => (p.id === patient.id ? original : p)));
      console.error(`Error toggling patient status:`, err);
      alert("Failed to update patient status: " + (err?.detail || err?.message || err));
    } finally {
      setUpdatingIds((s) => s.filter((id) => id !== patient.id));
    }
  };

  const filteredPatients = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  // Add computed stats
  const totalPatientsCount = patients.length;
  const activePatientsCount = patients.filter(
    (p) => p.is_active !== false
  ).length;
  const inactivePatientsCount = patients.filter(
    (p) => p.is_active === false
  ).length;

  return (
    <div className="container mt-4">
      {/* Stats Overview */}
      <div className="row mb-3 g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div
                className="stat-icon me-3"
                style={{
                  backgroundColor: "#e3ebfc",
                  color: "#1cc88a",
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BsPeople size={24} />
              </div>
              <div>
                <div className="text-muted small">Total Patients</div>
                <div className="fs-5 fw-bold" style={{ color: "#1cc88a" }}>
                  {totalPatientsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div
                className="stat-icon me-3"
                style={{
                  backgroundColor: "#d1f3e8",
                  color: "#4e73df",
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BsPersonCheck size={24} />
              </div>
              <div>
                <div className="text-muted small">Active Patients</div>
                <div className="fs-5 fw-bold" style={{ color: "#4e73df" }}>
                  {activePatientsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div
                className="stat-icon me-3"
                style={{
                  backgroundColor: "#fef7e6",
                  color: "#f6c23e",
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BsPersonDash size={24} />
              </div>
              <div>
                <div className="text-muted small">Inactive Patients</div>
                <div className="fs-5 fw-bold" style={{ color: "#f6c23e" }}>
                  {inactivePatientsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search patients..."
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
          + Add Patient
        </button>
      </div>

      {/* Add/Edit Form (REPLACED: modal overlay like Billing) */}
      {showForm && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,.4)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Edit Patient" : "Add New Patient"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      name="first_name"
                      className="form-control"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      name="last_name"
                      className="form-control"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Blood Group</label>
                    <select
                      name="blood_group"
                      className="form-select"
                      value={formData.blood_group}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Emergency Contact</label>
                    <input
                      name="emergency_contact"
                      className="form-control"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <input
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Medical History</label>
                    <textarea
                      name="medical_history"
                      className="form-control"
                      value={formData.medical_history}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
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

      {/* Patient Table */}
      <div className="card shadow-sm">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light text-center">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p, idx) => {
                const isActive = Boolean(p.is_active);
                const busy = updatingIds.includes(p.id);
                return (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>{`${p.first_name} ${p.last_name}`}</td>
                    <td>{p.gender}</td>
                    <td>{p.phone}</td>
                    <td>{p.blood_group}</td>
                    <td>
                      {isActive ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-sidebar me-1"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-sidebar-info me-1"
                        onClick={() => handleView(p)}
                      >
                        View
                      </button>

                      {/* single toggle button: Disable when active, Enable when inactive */}
                      <button
                        className={`btn btn-sm ${isActive ? "btn-outline-danger" : "btn-outline-success"}`}
                        onClick={() => handleToggleActive(p)}
                        disabled={busy}
                        title={isActive ? "Disable patient" : "Enable patient"}
                        aria-busy={busy}
                      >
                        {busy ? "Updating..." : (isActive ? "Disable" : "Enable")}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-muted">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        show={showDetails}
        patientId={selectedPatientId}
        onClose={() => setShowDetails(false)}
      />

      {/* Button Styles Matching Sidebar */}
      <style>{`
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

        /* Stats card styles */
        .card.border-0.shadow-sm {
          border-radius: 8px;
          transition: transform 0.2s;
        }
        .card.border-0.shadow-sm:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
