import React from "react";
export default function StatCard({ title, value, icon = "bi bi-bar-chart" }) {
  return (
    <div className="card text-center">
      <div className="card-body">
        <i className={`${icon} mb-2`} style={{ fontSize: 32, color: "#0d6efd" }} />
        <h5 className="card-title">{title}</h5>
        <p className="display-6">{value}</p>
      </div>
    </div>
  );
}
