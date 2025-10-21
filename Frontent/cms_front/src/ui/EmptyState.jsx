import React from "react";
export default function EmptyState({ message = "No data found", icon = "bi bi-box" }) {
  return (
    <div className="text-center text-muted py-5">
      <i className={`${icon} mb-2`} style={{ fontSize: 32 }} />
      <div>{message}</div>
    </div>
  );
}
