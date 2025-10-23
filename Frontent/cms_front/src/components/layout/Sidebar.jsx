import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ className = "" }) {
  const { user } = useContext(AuthContext);
  const role = user?.role || "Guest"; // fallback role

  return (
    <div
      className={`bg-light border-end vh-100 ${className}`}
      style={{ width: 240 }}
    >
      <div className="list-group list-group-flush">
        {/* ADMIN SIDEBAR */}
        {role === "Admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className="list-group-item list-group-item-action"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="list-group-item list-group-item-action"
            >
              Users
            </Link>
            <Link
              to="/admin/staffs"
              className="list-group-item list-group-item-action"
            >
              Staff
            </Link>
            <Link
              to="/admin/doctors"
              className="list-group-item list-group-item-action"
            >
              Doctors
            </Link>
            <Link
              to="/admin/specializations"
              className="list-group-item list-group-item-action"
            >
              Specializations
            </Link>
          </>
        )}

        {/* RECEPTIONIST SIDEBAR */}
        {role === "Receptionist" && (
          <>
            <Link
              to="/receptionist/dashboard"
              className="list-group-item list-group-item-action"
            >
              Dashboard
            </Link>
            <Link
              to="/receptionist/appointments"
              className="list-group-item list-group-item-action"
            >
              Appointments
            </Link>
            <Link
              to="/receptionist/patients"
              className="list-group-item list-group-item-action"
            >
              Patients
            </Link>
            <Link
              to="/receptionist/billing"
              className="list-group-item list-group-item-action"
            >
              Billing
            </Link>
            <Link
              to="/receptionist/reports"
              className="list-group-item list-group-item-action"
            >
              Reports
            </Link>
          </>
        )}

        {/* FALLBACK (if no role detected) */}
        {role !== "Admin" && role !== "Receptionist" && (
          <div className="p-3 text-muted small">No menu available</div>
        )}
      </div>
    </div>
  );
}
