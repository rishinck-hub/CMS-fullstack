import React from "react";
import Modal from "./Modal";
export default function ConfirmModal({
  show, title, message, onConfirm, onCancel
}) {
  return (
    <Modal show={show} onClose={onCancel}>
      <h5>{title}</h5>
      <p>{message}</p>
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}
