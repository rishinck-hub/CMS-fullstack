import React from "react";

export default function StatCard({ title, value, icon = "bi bi-bar-chart", color = "#0d6efd" }) {
  return (
    <div className="card border-left-primary shadow h-100 py-2">
      <div className="card-body">
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold text-gray-800">
              {value}
            </div>
          </div>
          <div className="col-auto">
            <i 
              className={`${icon}`} 
              style={{ 
                fontSize: "2rem", 
                color: color,
                opacity: 0.8
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
