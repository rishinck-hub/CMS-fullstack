import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ className = "" }) {
  return (
    <div
      className={`bg-light border-end vh-100 ${className}`}
      style={{ width: 240 }}
    >
      <div className="list-group list-group-flush">
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
      </div>
    </div>
  );
}
