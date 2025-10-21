import React from "react";
import AdminDashboard from "../../components/admin/AdminDashboard";

export default function AdminHome() {
  return (
    <div className="container mt-3">
      <h2>Welcome, Admin!</h2>
      <p className="text-muted">Here is an overview of your clinic system:</p>
      <AdminDashboard />
    </div>
  );
}
