import React from "react";
import StatCard from "../../ui/StatCard";
import UserManagementTable from "./UserManagementTable";
import StaffTable from "./StaffTable";
import DoctorTable from "./DoctorTable";
import SpecializationTable from "./SpecializationTable";
import Reports from "../../pages/admin/Reports";
import { useState } from "react";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  // Example stats; in real use, fetch these from API
  const stats = [
    { title: "Users", value: 120, icon: "bi-person" },
    { title: "Doctors", value: 18, icon: "bi-heart-pulse" },
    { title: "Appointments", value: 220, icon: "bi-calendar-check" },
    { title: "Revenue", value: "$25,000", icon: "bi-cash" },
  ];

  return (
    <div className="container mt-3">
      <h2>Admin Dashboard</h2>
      <div className="row my-4">
        {stats.map((stat, idx) => (
          <div className="col-md-3" key={idx}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
          </div>
        ))}
      </div>
      {/* Live reports */}
      <div className="row mb-4">
        <div className="col-12">
          <Reports refreshKey={refreshKey} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <UserManagementTable
            onDataChange={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <SpecializationTable />
        </div>
      </div>
    </div>
  );
}
