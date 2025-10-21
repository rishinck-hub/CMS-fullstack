import React, { useEffect, useState, useContext } from "react";
import {
  fetchSpecializations,
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../../services/adminService";
import AdminForm from "./AdminForm";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { NotificationContext } from "../../context/NotificationContext";

export default function SpecializationTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSpec, setEditSpec] = useState(null);
  const { showNotification } = useContext(NotificationContext);
  const [confirm, setConfirm] = useState({ show: false, id: null });

  useEffect(() => {
    load();
  }, []);
  async function load() {
    setLoading(true);
    setItems(await fetchSpecializations());
    setLoading(false);
  }

  function openAdd() {
    setEditSpec(null);
    setShowModal(true);
  }
  function openEdit(item) {
    setEditSpec(item);
    setShowModal(true);
  }

  async function handleSave(data) {
    if (editSpec) await updateSpecialization(editSpec.id, data);
    else await addSpecialization(data);
    setShowModal(false);
    load();
    showNotification("Saved", "success");
  }
  async function handleDelete(item) {
    setConfirm({ show: true, id: item.id });
  }

  return (
    <div>
      <h5>Specializations</h5>
      <button className="btn btn-primary mb-2" onClick={openAdd}>
        Add
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered align-middle table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id}>
                <td>{i + 1}</td>
                <td>{it.name}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => openEdit(it)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(it)}
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
          mode="spec"
          initial={editSpec}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        show={confirm.show}
        title="Delete specialization"
        message="Delete this item?"
        onCancel={() => setConfirm({ show: false, id: null })}
        onConfirm={async () => {
          try {
            await deleteSpecialization(confirm.id);
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

// Modal component for Add/Edit Specialization
function SpecModal({ onClose, onSave, editSpec }) {
  const [name, setName] = useState(editSpec?.name || "");
  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name });
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
                {editSpec ? "Edit" : "Add"} Specialization
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <label>Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
