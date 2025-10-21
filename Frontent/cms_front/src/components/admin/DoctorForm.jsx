import React, { useEffect, useState, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import {
  addDoctor,
  updateDoctor,
  fetchSpecializations,
} from "../../services/adminService";

export default function DoctorForm({ show, initial, onClose, onSaved }) {
  const { showNotification } = useContext(NotificationContext);
  const [form, setForm] = useState({
    user: "",
    specialization: "",
    experience: "",
    consultation_fee: "",
  });
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadSpecs() {
      try {
        const specs = await fetchSpecializations();
        if (mounted) setSpecializations(specs);
      } catch (err) {}
    }
    loadSpecs();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    if (initial) {
      setForm({
        user: initial.user?.username || initial.user || "",
        specialization: initial.specialization || "",
        experience: initial.experience || "",
        consultation_fee: initial.consultation_fee || "",
      });
    } else {
      setForm({
        user: "",
        specialization: "",
        experience: "",
        consultation_fee: "",
      });
    }
  }, [show, initial]);

  function change(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e && e.preventDefault();
    try {
      if (initial) await updateDoctor(initial.id, form);
      else await addDoctor(form);
      showNotification("Doctor saved", "success");
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      showNotification(err?.toString() || "Save failed", "danger");
    }
  }

  if (!show) return null;
  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog">
        <form onSubmit={submit}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{initial ? "Edit" : "Add"} Doctor</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <label className="form-label">Username</label>
              <input
                className="form-control mb-2"
                value={form.user}
                onChange={(e) => change("user", e.target.value)}
                required
              />
              <label className="form-label">Specialization</label>
              <select
                className="form-select mb-2"
                value={form.specialization}
                onChange={(e) => change("specialization", e.target.value)}
                required
              >
                <option value="">Select</option>
                {specializations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <label className="form-label">Experience (years)</label>
              <input
                className="form-control mb-2"
                type="number"
                value={form.experience}
                onChange={(e) => change("experience", e.target.value)}
              />
              <label className="form-label">Consultation fee</label>
              <input
                className="form-control mb-2"
                type="number"
                value={form.consultation_fee}
                onChange={(e) => change("consultation_fee", e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
