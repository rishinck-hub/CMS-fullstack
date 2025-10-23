import React, { useState, useContext, useEffect } from "react";
import {
  createUserWithProfiles,
  fetchSpecializations,
} from "../../services/adminService";
import { NotificationContext } from "../../context/NotificationContext";

export default function UserWizard({ show, onClose, onCreated }) {
  const { showNotification } = useContext(NotificationContext);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "Admin",
    is_active: true,
    password: "",
    staff: null,
    doctor: null,
  });
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    if (!show) setStep(0);
  }, [show]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const specs = await fetchSpecializations();
        if (mounted) setSpecializations(specs);
      } catch (err) {
        // ignore or show notification
      }
    }
    if (show) load();
    return () => {
      mounted = false;
    };
  }, [show]);

  function hasDoctorStep() {
    return data.role === "Doctor";
  }

  function change(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  function changeNested(group, obj) {
    setData((d) => ({ ...d, [group]: { ...(d[group] || {}), ...obj } }));
  }

  function getAge(dateString) {
    if (!dateString) return 0;
    const today = new Date();
    const dob = new Date(dateString);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  async function submit() {
    setLoading(true);
    try {
      const payload = { ...data };

      // Staff DOB validation
      if (payload.staff && payload.staff.dob) {
        const staffAge = getAge(payload.staff.dob);
        if (staffAge < 18) {
          throw new Error("Staff must be at least 18 years old.");
        }
      }

      // Doctor DOB validation (role must be Doctor and staff.dob must exist)
      if (data.role === "Doctor" && payload.staff && payload.staff.dob) {
        const doctorAge = getAge(payload.staff.dob);
        if (doctorAge < 25) {
          throw new Error("Doctors must be at least 25 years old.");
        }
      }

      // remove empty nested objects
      if (payload.staff && Object.values(payload.staff).every((v) => !v))
        delete payload.staff;
      if (payload.doctor && Object.values(payload.doctor).every((v) => !v))
        delete payload.doctor;

      // Doctor specialization validation
      if (data.role === "Doctor") {
        const specId = payload.doctor?.specialization;
        if (!specId) throw new Error("Please select a specialization for doctor");
      }

      const res = await createUserWithProfiles(payload);
      showNotification("Created successfully", "success");
      onCreated && onCreated(res);
      onClose && onClose();
    } catch (err) {
      showNotification(
        err?.detail || err?.toString() || "Create failed",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  }

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
            <h5 className="modal-title">Create User - Step {step + 1} of 3</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {step === 0 && (
              <div>
                <div className="mb-2">
                  <label>Username</label>
                  <input
                    className="form-control"
                    value={data.username}
                    onChange={(e) => change("username", e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label>Email</label>
                  <input
                    className="form-control"
                    value={data.email}
                    onChange={(e) => change("email", e.target.value)}
                  />
                </div>
                <div className="row mb-2">
                  <div className="col">
                    <label>First name</label>
                    <input
                      className="form-control"
                      value={data.first_name}
                      onChange={(e) => change("first_name", e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label>Last name</label>
                    <input
                      className="form-control"
                      value={data.last_name}
                      onChange={(e) => change("last_name", e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label>Role</label>
                  <select
                    className="form-select"
                    value={data.role}
                    onChange={(e) => change("role", e.target.value)}
                  >
                    <option>Admin</option>
                    <option>Receptionist</option>
                    <option>Doctor</option>
                    <option>Pharmacist</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={data.password}
                    onChange={(e) => change("password", e.target.value)}
                  />
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h6>Staff details (optional)</h6>
                <div className="mb-2">
                  <label>Phone</label>
                  <input
                    className="form-control"
                    value={data.staff?.phone || ""}
                    onChange={(e) =>
                      changeNested("staff", { phone: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Blood group</label>
                  <select
                    className="form-select"
                    value={data.staff?.blood_group || ""}
                    onChange={(e) =>
                      changeNested("staff", { blood_group: e.target.value })
                    }
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col">
                    <label>DOB</label>
                    <input
                      className="form-control"
                      type="date"
                      value={data.staff?.dob || ""}
                      onChange={(e) =>
                        changeNested("staff", { dob: e.target.value })
                      }
                    />
                  </div>
                  <div className="col">
                    <label>Hire date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={data.staff?.hire_date || ""}
                      onChange={(e) =>
                        changeNested("staff", { hire_date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label>Address</label>
                  <textarea
                    className="form-control"
                    value={data.staff?.address || ""}
                    onChange={(e) =>
                      changeNested("staff", { address: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            {step === 2 && hasDoctorStep() && (
              <div>
                <h6>Doctor details (optional)</h6>
                <div className="mb-2">
                  <label>Specialization</label>
                  <select
                    className="form-select"
                    value={data.doctor?.specialization || ""}
                    onChange={(e) =>
                      changeNested("doctor", { specialization: e.target.value })
                    }
                  >
                    <option value="">Choose specialization</option>
                    {specializations.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label>Experience (years)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={data.doctor?.experience || ""}
                    onChange={(e) =>
                      changeNested("doctor", { experience: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Consultation fee</label>
                  <input
                    className="form-control"
                    type="number"
                    value={data.doctor?.consultation_fee || ""}
                    onChange={(e) =>
                      changeNested("doctor", {
                        consultation_fee: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <div className="me-auto">
              {step > 0 && (
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </button>
              )}
              {!hasDoctorStep() && step < 1 && (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next
                </button>
              )}
              {hasDoctorStep() && step < 2 && (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next
                </button>
              )}
            </div>
            <div>
              <button className="btn btn-secondary me-2" onClick={onClose}>
                Cancel
              </button>
              {((hasDoctorStep() && step === 2) ||
                (!hasDoctorStep() && step === 1)) && (
                <button
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={submit}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
