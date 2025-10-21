import React, { useEffect, useState, useContext } from "react";
import {
  fetchDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  fetchSpecializations,
} from "../../services/adminService";
import AdminForm from "./AdminForm";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { NotificationContext } from "../../context/NotificationContext";

export default function DoctorTable() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const { showNotification } = useContext(NotificationContext);
  const [confirm, setConfirm] = useState({ show: false, id: null });

  useEffect(() => {
    load();
    fetchSpecializations().then(setSpecializations);
  }, []);
  async function load() {
    setLoading(true);
    try {
      setDoctors(await fetchDoctors());
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditDoctor(null);
    setShowModal(true);
  }
  function openEdit(doc) {
    setEditDoctor(doc);
    setShowModal(true);
  }
  async function handleSave(doc) {
    if (editDoctor) await updateDoctor(editDoctor.id, doc);
    else await addDoctor(doc);
    setShowModal(false);
    await load();
    showNotification("Doctor saved", "success");
  }
  async function handleDelete(doc) {
    setConfirm({ show: true, id: doc.id });
  }

  return (
    <div>
      <h5>Doctors</h5>
      <button className="btn btn-primary mb-2" onClick={openAdd}>
        Add Doctor
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d, i) => (
              <tr key={d.id}>
                <td>{i + 1}</td>
                <td>{d.user?.username || d.user}</td>
                <td>{d.specialization?.name}</td>
                <td>{d.experience}</td>
                <td>{d.consultation_fee}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => openEdit(d)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(d)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <AdminForm
          show={showModal}
          mode="doctor"
          initial={editDoctor}
          extraOptions={{ specializations }}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        show={confirm.show}
        title="Delete doctor"
        message="Delete this doctor?"
        onCancel={() => setConfirm({ show: false, id: null })}
        onConfirm={async () => {
          try {
            await deleteDoctor(confirm.id);
            setConfirm({ show: false, id: null });
            await load();
            showNotification("Deleted", "success");
          } catch (err) {
            showNotification(err?.toString() || "Delete failed", "danger");
          }
        }}
      />
    </div>
  );
}

// Modal component for Add/Edit Doctor
function DoctorModal({ onClose, onSave, specializations, editDoctor }) {
  const [form, setForm] = useState({
    user: editDoctor?.user?.username || editDoctor?.user || "",
    specialization: editDoctor?.specialization?.id || "",
    experience: editDoctor?.experience || "",
    consultation_fee: editDoctor?.consultation_fee || "",
  });
  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog">
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editDoctor ? "Edit" : "Add"} Doctor
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label>User (username)</label>
                <input
                  className="form-control"
                  value={form.user}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, user: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label>Specialization</label>
                <select
                  className="form-select"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialization: e.target.value }))
                  }
                  required
                >
                  <option value="">Choose specialization</option>
                  {specializations.map((s) => (
                    <option value={s.id} key={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label>Experience (years)</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, experience: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label>Consultation Fee</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.consultation_fee}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, consultation_fee: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
