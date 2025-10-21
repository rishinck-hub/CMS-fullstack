import React, { useEffect, useState, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { fetchUser } from "../../services/adminService";

// mode: 'user' | 'staff' | 'doctor' | 'spec'
export default function AdminForm({
  show,
  mode,
  initial,
  onClose,
  onSave,
  extraOptions = {},
  forcePassword = false,
}) {
  const { showNotification } = useContext(NotificationContext);
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!show) return;
    let mounted = true;
    async function loadInitial() {
      if (initial && mode === "user" && initial.id) {
        // fetch full user to ensure all fields are present
        try {
          const full = await fetchUser(initial.id);
          if (!mounted) return;
          setForm(full || initial);
          return;
        } catch (err) {
          // fallback to provided initial
        }
      }
      if (initial) {
        setForm(initial);
        return;
      }

      // defaults per mode when no initial provided
      if (mode === "user")
        setForm({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          role: "Admin",
          is_active: true,
          password: "",
        });
      else if (mode === "staff")
        setForm({
          user: "",
          phone: "",
          blood_group: "",
          dob: "",
          hire_date: "",
          address: "",
        });
      else if (mode === "doctor")
        setForm({
          user: "",
          specialization: "",
          experience: "",
          consultation_fee: "",
        });
      else if (mode === "spec") setForm({ name: "" });
    }
    loadInitial();
  }, [show, initial, mode]);

  function change(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    if (mode === "user")
      return (
        !!form.username &&
        !!form.email &&
        (initial ? (forcePassword ? !!form.password : true) : !!form.password)
      );
    if (mode === "staff") return form.user && form.phone;
    if (mode === "doctor") return form.user && form.specialization;
    if (mode === "spec") return form.name;
    return true;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) {
      showNotification("Please fill required fields", "danger");
      return;
    }
    try {
      await onSave(form);
      showNotification("Saved successfully", "success");
      onClose();
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
              <h5 className="modal-title">
                {initial ? "Edit" : "Add"} {mode}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {mode === "user" && (
                <>
                  <label className="form-label">Username</label>
                  <input
                    className="form-control mb-2"
                    value={form.username || ""}
                    onChange={(e) => change("username", e.target.value)}
                    disabled={!!initial}
                    required
                  />
                  <label className="form-label">Email</label>
                  <input
                    className="form-control mb-2"
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => change("email", e.target.value)}
                    required
                  />
                  <div className="row">
                    <div className="col">
                      <label className="form-label">First name</label>
                      <input
                        className="form-control mb-2"
                        value={form.first_name || ""}
                        onChange={(e) => change("first_name", e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Last name</label>
                      <input
                        className="form-control mb-2"
                        value={form.last_name || ""}
                        onChange={(e) => change("last_name", e.target.value)}
                      />
                    </div>
                  </div>
                  <label className="form-label">Role</label>
                  <select
                    className="form-select mb-2"
                    value={form.role || "Admin"}
                    onChange={(e) => change("role", e.target.value)}
                  >
                    <option>Admin</option>
                    <option>Receptionist</option>
                    <option>Doctor</option>
                    <option>Pharmacist</option>
                  </select>
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="is_active"
                      checked={!!form.is_active}
                      onChange={(e) => change("is_active", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="is_active">
                      Active
                    </label>
                  </div>
                  {(forcePassword || !initial) && (
                    <>
                      <label className="form-label">Password</label>
                      <div className="input-group mb-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          value={form.password || ""}
                          onChange={(e) => change("password", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword((s) => !s)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {mode === "staff" && (
                <>
                  <label className="form-label">Username</label>
                  <input
                    className="form-control mb-2"
                    value={form.user || ""}
                    onChange={(e) => change("user", e.target.value)}
                    required
                  />
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control mb-2"
                    value={form.phone || ""}
                    onChange={(e) => change("phone", e.target.value)}
                    required
                  />
                  <label className="form-label">Blood Group</label>
                  <select
                    className="form-select mb-2"
                    value={form.blood_group || ""}
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
                    type="date"
                    className="form-control mb-2"
                    value={form.dob || ""}
                    onChange={(e) => change("dob", e.target.value)}
                  />
                  <label className="form-label">Hire Date</label>
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={form.hire_date || ""}
                    onChange={(e) => change("hire_date", e.target.value)}
                  />
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    value={form.address || ""}
                    onChange={(e) => change("address", e.target.value)}
                  />
                </>
              )}

              {mode === "doctor" && (
                <>
                  <label className="form-label">Username</label>
                  <input
                    className="form-control mb-2"
                    value={form.user || ""}
                    onChange={(e) => change("user", e.target.value)}
                    required
                  />
                  <label className="form-label">Specialization</label>
                  <select
                    className="form-select mb-2"
                    value={form.specialization || ""}
                    onChange={(e) => change("specialization", e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {(extraOptions.specializations || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <label className="form-label">Experience (years)</label>
                  <input
                    className="form-control mb-2"
                    type="number"
                    min="0"
                    value={form.experience || ""}
                    onChange={(e) => change("experience", e.target.value)}
                  />
                  <label className="form-label">Consultation Fee</label>
                  <input
                    className="form-control mb-2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.consultation_fee || ""}
                    onChange={(e) => change("consultation_fee", e.target.value)}
                  />
                </>
              )}

              {mode === "spec" && (
                <>
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={form.name || ""}
                    onChange={(e) => change("name", e.target.value)}
                    required
                  />
                </>
              )}
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
