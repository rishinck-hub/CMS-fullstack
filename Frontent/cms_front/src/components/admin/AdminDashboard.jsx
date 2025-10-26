import React, { useState, useEffect, useContext } from "react";
import StatCard from "../../ui/StatCard";
import UserManagementTable from "./UserManagementTable";
import StaffTable from "./StaffTable";
import DoctorTable from "./DoctorTable";
import SpecializationTable from "./SpecializationTable";
import Reports from "../../pages/admin/Reports";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import { fetchDashboardStats } from "../../services/adminService";
import { useAuth } from "../../hooks/useRole";
import { NotificationContext } from "../../context/NotificationContext";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showNotification('Failed to load dashboard data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Prepare stats from dashboard data
  const stats = dashboardData ? [
    { 
      title: "Total Users", 
      value: dashboardData.total_users || 0, 
      icon: "bi bi-people",
      color: "#4e73df"
    },
    { 
      title: "Doctors", 
      value: dashboardData.total_doctors || 0, 
      icon: "bi bi-heart-pulse",
      color: "#1cc88a"
    },
    { 
      title: "Staff Members", 
      value: dashboardData.total_staff || 0, 
      icon: "bi bi-person-badge",
      color: "#36b9cc"
    },
    { 
      title: "Active Users", 
      value: dashboardData.total_users || 0, 
      icon: "bi bi-person-check",
      color: "#f6c23e"
    },
  ] : [];

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-bottom">
            <div className="container-fluid py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">Admin Dashboard</h2>
                  <p className="text-muted mb-0">Welcome back, {user?.username}</p>
                </div>
                <div>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={loadDashboardData}
                    disabled={loading}
                  >
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid py-4">
            {/* Statistics Cards */}
            <div className="row mb-4">
              {loading ? (
                <div className="col-12">
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading dashboard data...</p>
                  </div>
                </div>
              ) : (
                stats.map((stat, idx) => (
                  <div className="col-xl-3 col-md-6 mb-4" key={idx}>
                    <StatCard
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Recent Users Section */}
            {dashboardData?.recent_users && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card shadow">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Recent Users</h6>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Username</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th>Joined</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.recent_users.map((user) => (
                              <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>
                                  <span className={`badge bg-${user.role === 'Admin' ? 'danger' : user.role === 'Doctor' ? 'primary' : user.role === 'Receptionist' ? 'warning' : 'info'}`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge bg-${user.is_active ? 'success' : 'secondary'}`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Management Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">User Management</h6>
                  </div>
                  <div className="card-body">
                    <UserManagementTable
                      onDataChange={() => {
                        setRefreshKey((k) => k + 1);
                        loadDashboardData(); // Refresh dashboard data when users change
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specializations Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Specializations</h6>
                  </div>
                  <div className="card-body">
                    <SpecializationTable />
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Section */}
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">System Reports</h6>
                  </div>
                  <div className="card-body">
                    {/* <Reports refreshKey={refreshKey} /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
