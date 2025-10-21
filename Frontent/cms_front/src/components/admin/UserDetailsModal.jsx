import React, { useEffect, useState } from "react";
import {
  fetchStaffs,
  fetchDoctors,
  fetchSpecializations,
} from "../../services/adminService";

export default function UserDetailsModal({
  user,
  show,
  onClose,
  onEditUser,
  onEditStaff,
  onEditDoctor,
}) {
  const [staff, setStaff] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    if (!show) return;
    let mounted = true;
    async function load() {
      try {
        const [staffs, doctors, specs] = await Promise.all([
          fetchStaffs(),
          fetchDoctors(),
          fetchSpecializations(),
        ]);
        if (!mounted) return;
        const s = staffs.find((x) => {
          if (!x) return false;
          // staff.user may be id or object
          return (
            x.user &&
            (x.user.id === user.id ||
              x.user === user.id ||
              x.user === user.username)
          );
        });
        const d = doctors.find(
          (x) =>
            x &&
            x.user &&
            (x.user.id === user.id ||
              x.user === user.id ||
              x.user === user.username)
        );
        setStaff(s || null);
        setDoctor(d || null);
        setSpecializations(specs || []);
      } catch (err) {
        // ignore
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [show, user]);

  if (!show || !user) return null;

  function specName(id) {
    const s = specializations.find((x) => String(x.id) === String(id));
    return s ? s.name : id;
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
            <h5 className="modal-title">User details: {user.username}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <h6>User</h6>
            <dl className="row">
              <dt className="col-3">Username</dt>
              <dd className="col-9">{user.username}</dd>
              <dt className="col-3">Email</dt>
              <dd className="col-9">{user.email || "-"}</dd>
              <dt className="col-3">Name</dt>
              <dd className="col-9">
                {(user.first_name || "") + " " + (user.last_name || "")}
              </dd>
              <dt className="col-3">Role</dt>
              <dd className="col-9">{user.role}</dd>
              <dt className="col-3">Active</dt>
              <dd className="col-9">{user.is_active ? "Yes" : "No"}</dd>
            </dl>
            <div className="mb-3">
              <button
                className="btn btn-primary me-2"
                onClick={() => onEditUser(user)}
              >
                Edit user
              </button>
            </div>

            <h6>Staff</h6>
            {staff ? (
              <>
                <dl className="row">
                  <dt className="col-3">Phone</dt>
                  <dd className="col-9">{staff.phone}</dd>
                  <dt className="col-3">Blood group</dt>
                  <dd className="col-9">{staff.blood_group}</dd>
                  <dt className="col-3">DOB</dt>
                  <dd className="col-9">{staff.dob}</dd>
                  <dt className="col-3">Hire date</dt>
                  <dd className="col-9">{staff.hire_date}</dd>
                  <dt className="col-3">Address</dt>
                  <dd className="col-9">{staff.address}</dd>
                </dl>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => onEditStaff(staff)}
                >
                  Edit staff
                </button>
              </>
            ) : (
              <div>No staff record</div>
            )}

            <h6 className="mt-3">Doctor</h6>
            {doctor ? (
              <>
                <dl className="row">
                  <dt className="col-3">Specialization</dt>
                  <dd className="col-9">{specName(doctor.specialization)}</dd>
                  <dt className="col-3">Experience</dt>
                  <dd className="col-9">{doctor.experience}</dd>
                  <dt className="col-3">Fee</dt>
                  <dd className="col-9">{doctor.consultation_fee}</dd>
                </dl>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => onEditDoctor(doctor)}
                >
                  Edit doctor
                </button>
              </>
            ) : (
              <div>No doctor record</div>
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
