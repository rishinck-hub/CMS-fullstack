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
  const [showPassword, setShowPassword] = useState(false);

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
    // Username
    if (!data.username || !/^[a-zA-Z0-9_]{3,}$/.test(data.username)) {
      throw new Error("Username is required (min 3 chars, only letters, numbers, underscore, no spaces).");
    }
    // Email
    if (!data.email || !/^[\w\.-]+@[\w-]+(\.[\w-]+)+$/.test(data.email)) {
      throw new Error("Please enter a valid email address.");
    }
    // First name
    if (!data.first_name || !/^[a-zA-Z]+$/.test(data.first_name)) {
      throw new Error("First name is required and can only contain letters.");
    }
    // Password
    if (
      !data.password ||
      data.password.length < 6 ||
      !/[A-Za-z]/.test(data.password) ||
      !/\d/.test(data.password)
    ) {
      throw new Error("Password must be at least 6 characters and contain both letters and numbers.");
    }
    // Phone
    if (data.staff?.phone && !/^[6-9]\d{9}$/.test(data.staff.phone)) {
      throw new Error("Phone must be 10 digits and start with 6, 7, 8, or 9.");
    }
    // Blood group required once on staff step
    if (step > 0 && !data.staff?.blood_group) {
      throw new Error("Blood group is required for staff.");
    }

    // HIRE DATE VALIDATIONS (presence, not future, not before DOB, >= 18 on hire)
// HIRE DATE VALIDATIONS (presence, not future, not before DOB, age between 18 and 60)
if (step > 0) {
  const hireStr = data.staff?.hire_date || "";
  if (!hireStr) {
    throw new Error("Hire date is required for staff.");
  }
  const hire = new Date(hireStr);
  const today = new Date();
  // normalize to date-only for comparison
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (hire > todayMid) {
    throw new Error("Hire date cannot be in the future.");
  }

  const dobStr = data.staff?.dob || "";
  if (dobStr) {
    const dob = new Date(dobStr);

    if (hire < dob) {
      throw new Error("Hire date cannot be before date of birth.");
    }

    // Check minimum age (18 years)
    const eighteenAt = new Date(dob);
    eighteenAt.setFullYear(dob.getFullYear() + 18);
    if (hire < eighteenAt) {
      throw new Error("Hire date must be on or after the 18th birthday.");
    }

    // ✅ Check maximum age (60 years)
    const sixtyAt = new Date(dob);
    sixtyAt.setFullYear(dob.getFullYear() + 60);
    if (hire > sixtyAt) {
      throw new Error("Age at the time of hire cannot exceed 60 years.");
    }
  }
}

    const payload = { ...data };

    // remove empty nested
    if (payload.staff && Object.values(payload.staff).every((v) => !v)) delete payload.staff;
    if (payload.doctor && Object.values(payload.doctor).every((v) => !v)) delete payload.doctor;

    // remove dummy gender
    if (payload.staff && "gender" in payload.staff) {
      delete payload.staff.gender;
    }

    // Age checks (based on DOB) if provided
    if (payload.staff && payload.staff.dob) {
      const staffAge = getAge(payload.staff.dob);
      if (staffAge < 18) {
        throw new Error("Staff must be at least 18 years old.");
      }
    }

    // Doctor age rule (if doctor role and dob present)
    if (data.role === "Doctor" && payload.staff && payload.staff.dob) {
      const doctorAge = getAge(payload.staff.dob);
      if (doctorAge < 25) {
        throw new Error("Doctors must be at least 25 years old.");
      }
    }

    // Doctor specialization
    if (data.role === "Doctor") {
      const specId = payload.doctor?.specialization;
      if (!specId) throw new Error("Please select a specialization for doctor");
    }

    const res = await createUserWithProfiles(payload);
    showNotification("Created successfully", "success");
    onCreated && onCreated(res);
    onClose && onClose();
  } catch (err) {
    showNotification(err?.detail || err?.toString() || "Create failed", "danger");
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
                  <label>Username <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    value={data.username}
                    onChange={(e) => change("username", e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label>Email <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    value={data.email}
                    onChange={(e) => change("email", e.target.value)}
                  />
                </div>
                <div className="row mb-2">
                  <div className="col">
                    <label>First name <span className="text-danger">*</span></label>
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
                  <label>Password <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => change("password", e.target.value)}
                    autoComplete="new-password"
                  />
                  <div className="form-check mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showPass"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showPass">
                      Show password
                    </label>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h6>Staff details (optional)</h6>
                <div className="mb-2">
                  <label>Phone <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    value={data.staff?.phone || ""}
                    onChange={(e) =>
                      changeNested("staff", { phone: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Blood group <span className="text-danger">*</span></label>
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
                <div className="mb-2">
                  <label>Gender <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={data.staff?.gender || ""}
                    onChange={(e) =>
                      changeNested("staff", { gender: e.target.value })
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col">
                    <label>DOB <span className="text-danger">*</span></label>
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
                    <label>Hire date <span className="text-danger">*</span></label>
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
                  <label>Address <span className="text-danger">*</span></label>
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
