import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserInjured, 
  FaCalendarAlt, 
  FaFileInvoiceDollar, 
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave
} from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { BsGraphUp } from "react-icons/bs";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import { 
  fetchPatients, 
  fetchAppointments, 
  fetchBills 
} from "../../services/receptionistService";
import "./ReceptionistDashboard.css";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingBills: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch all required data in parallel
        const [patients, appointments, bills] = await Promise.all([
          fetchPatients(),
          fetchAppointments({ date: today }),
          fetchBills({ is_paid: false }) // Get only pending bills
        ]);
        
        // Get recent patients (last 3 registered)
        const recentPatients = patients
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
          .map(patient => ({
            id: patient.id,
            type: 'patient',
            name: `${patient.first_name} ${patient.last_name}`,
            action: 'registered',
            time: new Date(patient.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

        // Get recent appointments (today's appointments)
        const recentAppointments = appointments
          .slice(0, 2)
          .map(appt => ({
            id: `appt-${appt.id}`,
            type: 'appointment',
            name: `${appt.patient_name || 'Patient'}`,
            time: new Date(appt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appt.status || 'scheduled'
          }));

        // Update stats with actual counts
        setStats({
          totalPatients: patients.length,
          todayAppointments: appointments.length,
          pendingBills: bills.length
        });
        
        // Combine recent activities and sort by time
        setRecentActivity([
          ...recentPatients,
          ...recentAppointments
        ].sort((a, b) => new Date(b.time) - new Date(a.time)));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set all counts to 0 if there's an error
        setStats({
          totalPatients: 0,
          todayAppointments: 0,
          pendingBills: 0
        });
        
        // Show error state in recent activity
        setRecentActivity([
          { 
            id: 'error', 
            type: 'error', 
            name: 'Error loading data', 
            message: 'Could not fetch recent activity', 
            time: 'Now' 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon, title, value, color, iconBg }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: iconBg, color: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

  const FeatureCard = ({ icon, title, description, btnText, onClick, color }) => (
    <div className="feature-card" onClick={onClick}>
      <div className="feature-icon" style={{ color }}>
        {icon}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      <button 
        className="btn-feature"
        style={{ backgroundColor: color }}
      >
        {btnText}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="main-content">
          <div className="dashboard-header">
            <h1>Receptionist Dashboard</h1>
            <p className="text-muted">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Overview */}
          <div className="stats-container">
            <StatCard 
              icon={<FaUsers size={24} />} 
              title="Total Patients" 
              value={stats.totalPatients} 
              color="#4e73df" 
              iconBg="#e3ebfc"
            />
            <StatCard 
              icon={<FaCalendarCheck size={24} />} 
              title="Today's Appointments" 
              value={stats.todayAppointments} 
              color="#1cc88a" 
              iconBg="#d1f3e8"
            />
            <StatCard 
              icon={<FaFileInvoiceDollar size={24} />} 
              title="Pending Bills" 
              value={stats.pendingBills} 
              color="#f6c23e" 
              iconBg="#fef7e6"
            />
          </div>

          {/* Quick Actions */}
          <div className="features-container">
            <h3 className="section-title">Quick Actions</h3>
            <div className="row g-4">
              <div className="col-md-4">
                <FeatureCard
                  icon={<FaUserInjured size={32} />}
                  title="Patient Management"
                  description="Manage patient records, view history, and update information"
                  btnText="Manage Patients"
                  color="#4e73df"
                  onClick={() => navigate("/receptionist/patients")}
                />
              </div>
              <div className="col-md-4">
                <FeatureCard
                  icon={<FaCalendarAlt size={32} />}
                  title="Appointments"
                  description="Schedule, view, and manage doctor appointments"
                  btnText="View Appointments"
                  color="#1cc88a"
                  onClick={() => navigate("/receptionist/appointments")}
                />
              </div>
              <div className="col-md-4">
                <FeatureCard
                  icon={<FaFileInvoiceDollar size={32} />}
                  title="Billing & Invoices"
                  description="Generate and manage patient bills and invoices"
                  btnText="Manage Billing"
                  color="#f6c23e"
                  onClick={() => navigate("/receptionist/billing")}
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity mt-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Recent Activity</h5>
              </div>
              <div className="card-body">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item d-flex align-items-center mb-3">
                    <div className={`activity-icon me-3 ${activity.type}`}>
                      {activity.type === 'appointment' && <FaCalendarAlt />}
                      {activity.type === 'bill' && <FaFileInvoiceDollar />}
                      {activity.type === 'patient' && <FaUserInjured />}
                    </div>
                    <div className="activity-details">
                      <p className="mb-0 fw-bold">
                        {activity.name}
                        {activity.type === 'bill' && ` - $${activity.amount}`}
                        {activity.type === 'patient' && ` - ${activity.action}`}
                      </p>
                      <small className="text-muted">{activity.time || 'Just now'}</small>
                    </div>
                    {activity.status && (
                      <span className={`badge ms-auto ${activity.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
