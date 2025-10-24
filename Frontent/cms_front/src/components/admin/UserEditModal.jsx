import React, { useEffect, useState, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import {
  fetchStaffs,
  fetchDoctors,
  fetchSpecializations,
  fetchUser,
  updateUser,
  updateStaff,
  addStaff,
  updateDoctor,
  addDoctor,
} from "../../services/adminService";

export default function UserEditModal({ user, show, onClose, onSaved }) {
  const { showNotification } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState("user");
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    is_active: true,
  });
  const [staff, setStaff] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !user) return;
    setUserForm({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      role: "",
      is_active: true,
    });
    setStaff(null);
    setDoctor(null);
    setSpecializations([]);

    let mounted = true;
    async function loadRelated() {
      try {
        // fetch full user record first
        let fullUser = null;
        try {
          fullUser = await fetchUser(user.id);
        } catch (e) {
          fullUser = user;
        }
        if (!mounted) return;
        // Prefill user form with fetched data or provided user
        setUserForm({
          username: fullUser.username || "",
          email: fullUser.email || "",
          first_name: fullUser.first_name || "",
          last_name: fullUser.last_name || "",
          role: fullUser.role || "",
          is_active:
            typeof fullUser.is_active === "boolean"
              ? fullUser.is_active
              : true,
        });

        const [staffs, doctors, specs] = await Promise.all([
          fetchStaffs(),
          fetchDoctors(),
          fetchSpecializations(),
        ]);
        if (!mounted) return;

        // Prefer nested staff/doctor on the user object if provided
        const sFromUser =
          fullUser && (fullUser.staff || fullUser.staff_profile || null);
        const dFromUser =
          fullUser && (fullUser.doctor || fullUser.doctor_profile || null);

        const s =
          sFromUser ||
          (staffs || []).find(
            (x) =>
              x.user &&
              (x.user.id === user.id ||
                x.user === user.id ||
                x.user === user.username)
          ) ||
          null;
        const d =
          dFromUser ||
          (doctors || []).find(
            (x) =>
              x.user &&
              (x.user.id === user.id ||
                x.user === user.id ||
                x.user === user.username)
          ) ||
          null;

        setStaff(s);
        setDoctor(d);
        setSpecializations(specs || []);
      } catch (err) {
        // ignore
      }
    }
    loadRelated();
    return () => {
      mounted = false;
    };
  }, [show, user]);

  if (!show || !user || userForm == null) return null;

  function changeUser(field, value) {
    setUserForm((f) => ({ ...(f || {}), [field]: value }));
  }

  function changeStaff(field, value) {
    setStaff((s) => ({ ...(s || {}), [field]: value }));
  }

  function changeDoctor(field, value) {
    setDoctor((d) => ({ ...(d || {}), [field]: value }));
  }

  async function saveUser() {
    if (!userForm) return;
    setLoading(true);
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password;
      await updateUser(user.id, payload);
      showNotification("User updated", "success");
      onSaved && onSaved();
    } catch (err) {
      showNotification(err?.toString() || "Failed", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function saveStaff() {
    setLoading(true);
    try {
      const payload = { ...staff };
      payload.user = payload.user?.id || payload.user || user.id;
      if (staff && staff.id) {
        await updateStaff(staff.id, payload);
        showNotification("Staff updated", "success");
      } else {
        await addStaff(payload);
        showNotification("Staff created", "success");
      }
      onSaved && onSaved();
    } catch (err) {
      showNotification(err?.toString() || "Failed", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function saveDoctor() {
    setLoading(true);
    try {
      const payload = { ...doctor };
      payload.user = payload.user?.id || payload.user || user.id;
      if (doctor && doctor.id) {
        await updateDoctor(doctor.id, payload);
        showNotification("Doctor updated", "success");
      } else {
        await addDoctor(payload);
        showNotification("Doctor created", "success");
      }
      onSaved && onSaved();
    } catch (err) {
      showNotification(err?.toString() || "Failed", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit user: {userForm.username}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "user" ? "active" : ""}`}
                  onClick={() => setActiveTab("user")}
                >
                  User
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "staff" ? "active" : ""}`}
                  onClick={() => setActiveTab("staff")}
                >
                  Staff
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "doctor" ? "active" : ""}`}
                  onClick={() => setActiveTab("doctor")}
                >
                  Doctor
                </button>
              </li>
            </ul>

            {activeTab === "user" && (
              <div>
                <label className="form-label">Username</label>
                <input
                  className="form-control mb-2"
                  value={userForm.username || ""}
                  disabled
                />
                <label className="form-label">Email</label>
                <input
                  className="form-control mb-2"
                  value={userForm.email || ""}
                  onChange={(e) => changeUser("email", e.target.value)}
                />
                <div className="row mb-2">
                  <div className="col">
                    <label className="form-label">First name</label>
                    <input
                      className="form-control"
                      value={userForm.first_name || ""}
                      onChange={(e) => changeUser("first_name", e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">Last name</label>
                    <input
                      className="form-control"
                      value={userForm.last_name || ""}
                      onChange={(e) => changeUser("last_name", e.target.value)}
                    />
                  </div>
                </div>
                <label className="form-label">Role</label>
                <select
                  className="form-select mb-2"
                  value={userForm.role || ""}
                  onChange={(e) => changeUser("role", e.target.value)}
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
                    checked={!!userForm.is_active}
                    onChange={(e) => changeUser("is_active", e.target.checked)}
                  />
                  <label className="form-check-label">Active</label>
                </div>
                <div className="mt-2">
                  <button
                    className="btn btn-primary"
                    onClick={saveUser}
                    disabled={loading}
                  >
                    Save user
                  </button>
                </div>
              </div>
            )}

            {activeTab === "staff" && (
              <div>
                {staff ? (
                  <>
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control mb-2"
                      value={staff.phone || ""}
                      onChange={(e) => changeStaff("phone", e.target.value)}
                    />
                    <label className="form-label">Blood group</label>
                    <select
                      className="form-select mb-2"
                      value={staff.blood_group || ""}
                      onChange={(e) =>
                        changeStaff("blood_group", e.target.value)
                      }
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
                      value={staff.dob || ""}
                      onChange={(e) => changeStaff("dob", e.target.value)}
                    />
                    <label className="form-label">Hire date</label>
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={staff.hire_date || ""}
                      onChange={(e) => changeStaff("hire_date", e.target.value)}
                    />
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      value={staff.address || ""}
                      onChange={(e) => changeStaff("address", e.target.value)}
                    />

                    <div className="mt-2">
                      <button
                        className="btn btn-primary"
                        onClick={saveStaff}
                        disabled={loading}
                      >
                        Save staff
                      </button>
                    </div>
                  </>
                ) : (
                  <div>No staff record for this user</div>
                )}
              </div>
            )}

            {activeTab === "doctor" && (
              <div>
                {doctor ? (
                  <>
                    <label className="form-label">Specialization</label>
                    <select
                      className="form-select mb-2"
                      value={doctor.specialization || ""}
                      onChange={(e) =>
                        changeDoctor("specialization", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {specializations.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <label className="form-label">Experience</label>
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={doctor.experience || ""}
                      onChange={(e) =>
                        changeDoctor("experience", e.target.value)
                      }
                    />
                    <label className="form-label">Consultation fee</label>
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={doctor.consultation_fee || ""}
                      onChange={(e) =>
                        changeDoctor("consultation_fee", e.target.value)
                      }
                    />
                    <div className="mt-2">
                      <button
                        className="btn btn-primary"
                        onClick={saveDoctor}
                        disabled={loading}
                      >
                        Save doctor
                      </button>
                    </div>
                  </>
                ) : (
                  <div>No doctor record for this user</div>
                )}
              </div>
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
