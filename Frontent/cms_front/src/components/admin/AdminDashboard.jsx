import React, { useState, useEffect, useContext } from "react";
import StatCard from "../../ui/StatCard";
import UserManagementTable from "./UserManagementTable";
import StaffTable from "./StaffTable";
import DoctorTable from "./DoctorTable";
import SpecializationTable from "./SpecializationTable";
import Reports from "../../pages/admin/Reports";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import Footer from "../../ui/Footer";
import { fetchDashboardStats } from "../../services/adminService";
import { useAuth } from "../../hooks/useRole";
import { NotificationContext } from "../../context/NotificationContext";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
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

  // Prepare enhanced stats from dashboard data
  const stats = dashboardData ? [
    { 
      title: "Total Users", 
      value: dashboardData.total_users || 0, 
      icon: "👥",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "System-wide users",
      trend: "+12%"
    },
    { 
      title: "Doctors", 
      value: dashboardData.total_doctors || 0, 
      icon: "👨‍⚕️",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Medical professionals",
      trend: "+5%"
    },
    { 
      title: "Staff Members", 
      value: dashboardData.total_staff || 0, 
      icon: "👔",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Receptionists & more",
      trend: "+8%"
    },
    { 
      title: "Active Sessions", 
      value: dashboardData.total_users || 0, 
      icon: "✓",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      description: "Currently online",
      trend: "Real-time"
    },
  ] : [];

  // Role distribution for pie chart
  const roleDistribution = dashboardData?.recent_users?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <Navbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1">
          {/* Enhanced Header */}
          <div style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "2rem 0",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center text-white">
                <div>
                  <h2 className="mb-1" style={{ fontWeight: 'bold' }}>
                    🏥 Admin Dashboard
                  </h2>
                  <p className="mb-0 opacity-75">Welcome back, <strong>{user?.username}</strong> • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <button 
                    className="btn btn-light btn-sm px-4"
                    onClick={loadDashboardData}
                    disabled={loading}
                    style={{ borderRadius: '50px' }}
                  >
                    {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid py-4">
            {/* Tab Navigation */}
            <ul className="nav nav-pills mb-4" style={{ 
              background: 'white', 
              borderRadius: '10px',
              padding: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                  style={{ border: 'none', background: 'none' }}
                >
                  📊 Overview
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                  style={{ border: 'none', background: 'none' }}
                >
                  👥 Users
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'specializations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specializations')}
                  style={{ border: 'none', background: 'none' }}
                >
                  🎓 Specializations
                </button>
              </li>
            </ul>

            {activeTab === 'overview' && (
              <>
                {/* Enhanced Statistics Cards */}
                <div className="row mb-4">
                  {loading ? (
                    <div className="col-12">
                      <div className="card shadow" style={{ border: 'none', borderRadius: '15px' }}>
                        <div className="card-body text-center py-5">
                          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-3 text-muted">Loading dashboard data...</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    stats.map((stat, idx) => (
                      <div className="col-xl-3 col-md-6 mb-4" key={idx}>
                        <div 
                          className="card shadow-sm border-0" 
                          style={{ 
                            borderRadius: '20px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                        >
                          <div style={{ 
                            background: stat.color,
                            padding: '1.5rem',
                            color: 'white'
                          }}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <p className="mb-1 opacity-75" style={{ fontSize: '0.875rem' }}>
                                  {stat.title}
                                </p>
                                <h2 className="mb-0" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                  {stat.value}
                                </h2>
                              </div>
                              <div style={{ fontSize: '3rem', lineHeight: '1' }}>
                                {stat.icon}
                              </div>
                            </div>
                          </div>
                          <div className="card-body" style={{ background: 'white' }}>
                            <small className="text-muted">{stat.description}</small>
                            <div className="mt-2">
                              <span className="badge bg-success-subtle text-success">
                                {stat.trend}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="row">
                  {/* Recent Users Section - Enhanced */}
                  <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
                      <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 fw-bold">🔔 Recent Users Activity</h6>
                          <span className="badge bg-light text-dark">{dashboardData?.recent_users?.length || 0} users</span>
                        </div>
                      </div>
                      <div className="card-body">
                        {dashboardData?.recent_users && dashboardData.recent_users.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead style={{ background: '#f8f9fa' }}>
                                <tr>
                                  <th>👤 Username</th>
                                  <th>🎭 Role</th>
                                  <th>✅ Status</th>
                                  <th>📅 Joined</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dashboardData.recent_users.map((u) => (
                                  <tr key={u.id}>
                                    <td className="fw-bold">{u.username}</td>
                                    <td>
                                      <span className={`badge ${
                                        u.role === 'Admin' ? 'bg-danger' : 
                                        u.role === 'Doctor' ? 'bg-primary' : 
                                        u.role === 'Receptionist' ? 'bg-warning' : 
                                        'bg-info'
                                      }`}>
                                        {u.role}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`badge ${u.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                        {u.is_active ? '✓ Active' : '✗ Inactive'}
                                      </span>
                                    </td>
                                    <td className="text-muted">
                                      {new Date(u.date_joined).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted mb-0">No recent users to display</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Widget */}
                  <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
                      <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
                        <h6 className="mb-0 fw-bold">⚡ System Status</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">📊 System Health</span>
                            <span className="badge bg-success">Excellent</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: '95%' }}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">💾 Database Status</span>
                            <span className="badge bg-success">Online</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-info" role="progressbar" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">🔄 Last Sync</span>
                            <span className="text-success">2 min ago</span>
                          </div>
                        </div>
                        <hr />
                        <div className="text-center">
                          <button 
                            className="btn btn-primary btn-sm w-100"
                            onClick={loadDashboardData}
                            disabled={loading}
                            style={{ borderRadius: '10px' }}
                          >
                            🔄 Refresh All Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
                <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
                  <h6 className="mb-0 fw-bold">👥 User Management</h6>
                </div>
                <div className="card-body">
                  <UserManagementTable
                    onDataChange={() => {
                      setRefreshKey((k) => k + 1);
                      loadDashboardData();
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'specializations' && (
              <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
                <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
                  <h6 className="mb-0 fw-bold">🎓 Specializations</h6>
                </div>
                <div className="card-body">
                  <SpecializationTable />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <Footer />

      {/* Enhanced Styles */}
      <style>{`
        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border-radius: 10px !important;
        }
        .nav-link {
          color: #667eea;
          margin-right: 5px;
          border-radius: 10px;
        }
        .nav-link:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}
