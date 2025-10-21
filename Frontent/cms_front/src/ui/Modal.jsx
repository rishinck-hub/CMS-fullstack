import React from "react";
export default function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="modal-backdrop show" style={{ zIndex: 1051 }}>
      <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
