import React from "react";
import UserManagementTable from "../../components/admin/UserManagementTable";

export default function ManageUsers() {
  return (
    <div className="container mt-4">
      <h3>Manage Users</h3>
      <UserManagementTable />
    </div>
  );
}
