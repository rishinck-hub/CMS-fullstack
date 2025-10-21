import React, { useEffect, useState, useContext } from "react";
import {
  fetchStaffs,
  addStaff,
  updateStaff,
  deleteStaff,
} from "../../services/adminService";
import AdminForm from "./AdminForm";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { NotificationContext } from "../../context/NotificationContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function StaffTable() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const { showNotification } = useContext(NotificationContext);
  const [confirm, setConfirm] = useState({ show: false, id: null });

  useEffect(() => {
    load();
  }, []);
  async function load() {
    setLoading(true);
    setStaffs(await fetchStaffs());
    setLoading(false);
  }

  function openAdd() {
    setEditStaff(null);
    setShowModal(true);
  }
  function openEdit(staff) {
    setEditStaff(staff);
    setShowModal(true);
  }

  async function handleSave(data) {
    if (editStaff) await updateStaff(editStaff.id, data);
    else await addStaff(data);
    setShowModal(false);
    load();
    showNotification("Staff saved", "success");
  }
  async function handleDelete(staff) {
    setConfirm({ show: true, id: staff.id });
  }

  return (
    <div>
      <h5>Staffs</h5>
      <button className="btn btn-primary mb-2" onClick={openAdd}>
        Add Staff
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered align-middle table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Phone</th>
              <th>Blood</th>
              <th>DOB</th>
              <th>Hire Date</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.user?.username || s.user}</td>
                <td>{s.phone}</td>
                <td>{s.blood_group}</td>
                <td>{s.dob}</td>
                <td>{s.hire_date}</td>
                <td>{s.address}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => openEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s)}
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
          mode="staff"
          initial={editStaff}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        show={confirm.show}
        title="Delete staff"
        message="Delete this staff record?"
        onCancel={() => setConfirm({ show: false, id: null })}
        onConfirm={async () => {
          try {
            await deleteStaff(confirm.id);
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

// Modal for Add/Edit Staff
function StaffModal({ onClose, onSave, editStaff }) {
  const [form, setForm] = useState({
    user: editStaff?.user?.username || editStaff?.user || "",
    phone: editStaff?.phone || "",
    blood_group: editStaff?.blood_group || "",
    dob: editStaff?.dob || "",
    hire_date: editStaff?.hire_date || "",
    address: editStaff?.address || "",
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.2)" }}
    >
      <div className="modal-dialog">
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editStaff ? "Edit" : "Add"} Staff
              </h5>
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
                name="user"
                value={form.user}
                onChange={handleChange}
                required
              />
              <label className="form-label">Phone</label>
              <input
                className="form-control mb-2"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <label className="form-label">Blood Group</label>
              <select
                className="form-select mb-2"
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <label className="form-label">Date of Birth</label>
              <input
                className="form-control mb-2"
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
              <label className="form-label">Hire Date</label>
              <input
                className="form-control mb-2"
                type="date"
                name="hire_date"
                value={form.hire_date}
                onChange={handleChange}
                required
              />
              <label className="form-label">Address</label>
              <textarea
                className="form-control mb-2"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
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
