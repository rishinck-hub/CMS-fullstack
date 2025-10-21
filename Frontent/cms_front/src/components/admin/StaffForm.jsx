import React, { useEffect, useState, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { addStaff, updateStaff } from "../../services/adminService";

export default function StaffForm({ show, initial, onClose, onSaved }) {
  const { showNotification } = useContext(NotificationContext);
  const [form, setForm] = useState({
    user: "",
    phone: "",
    blood_group: "",
    dob: "",
    hire_date: "",
    address: "",
  });

  useEffect(() => {
    if (!show) return;
    if (initial) {
      setForm({
        user: initial.user?.username || initial.user || "",
        phone: initial.phone || "",
        blood_group: initial.blood_group || "",
        dob: initial.dob || "",
        hire_date: initial.hire_date || "",
        address: initial.address || "",
      });
    } else {
      setForm({
        user: "",
        phone: "",
        blood_group: "",
        dob: "",
        hire_date: "",
        address: "",
      });
    }
  }, [show, initial]);

  function change(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e && e.preventDefault();
    try {
      if (initial) await updateStaff(initial.id, form);
      else await addStaff(form);
      showNotification("Staff saved", "success");
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
              <h5 className="modal-title">{initial ? "Edit" : "Add"} Staff</h5>
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
              <label className="form-label">Phone</label>
              <input
                className="form-control mb-2"
                value={form.phone}
                onChange={(e) => change("phone", e.target.value)}
                required
              />
              <label className="form-label">Blood Group</label>
              <select
                className="form-select mb-2"
                value={form.blood_group}
                onChange={(e) => change("blood_group", e.target.value)}
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
              <label className="form-label">DOB</label>
              <input
                className="form-control mb-2"
                type="date"
                value={form.dob}
                onChange={(e) => change("dob", e.target.value)}
              />
              <label className="form-label">Hire date</label>
              <input
                className="form-control mb-2"
                type="date"
                value={form.hire_date}
                onChange={(e) => change("hire_date", e.target.value)}
              />
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                value={form.address}
                onChange={(e) => change("address", e.target.value)}
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
