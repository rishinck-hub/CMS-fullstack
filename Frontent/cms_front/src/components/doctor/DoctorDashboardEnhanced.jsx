import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ConsultationForm from './ConsultationForm';

const DoctorDashboardEnhanced = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTodayAppointments(),
        loadAllAppointments()
      ]);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadTodayAppointments = async () => {
    try {
      const response = await api.get('/doctor/appointments/today/');
      setTodayAppointments(response.data || []);
    } catch (err) {
      console.error('Error loading today\'s appointments:', err);
      setTodayAppointments([]);
    }
  };

  const loadAllAppointments = async () => {
    try {
      const response = await api.get('/doctor/appointments/');
      setAllAppointments(response.data || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
      setAllAppointments([]);
    }
  };


  const handleStartConsultation = (appointment) => {
    setSelectedAppointment(appointment);
    setShowConsultationModal(true);
  };

  const handleConsultationCreated = () => {
    setShowConsultationModal(false);
    setSelectedAppointment(null);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '20px' }}>
        <div className="card-body" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
          <h2 className="mb-2">👨‍⚕️ Doctor Dashboard</h2>
          <p className="mb-0 opacity-75">Manage your appointments, consultations, and prescriptions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4 g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">📅</div>
              <h4 className="text-primary">Today's Appointments</h4>
              <h2 className="text-primary">{todayAppointments.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">📋</div>
              <h4 className="text-info">All Appointments</h4>
              <h2 className="text-info">{allAppointments.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">✅</div>
              <h4 className="text-success">Completed</h4>
              <h2 className="text-success">{allAppointments.filter(a => a.status === 'Completed').length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '20px' }}>
        <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
          <h5 className="mb-0">📅 Today's Appointments</h5>
        </div>
        <div className="card-body">
          {todayAppointments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>{new Date(apt.date_time).toLocaleTimeString()}</td>
                      <td><strong>{apt.patient?.first_name} {apt.patient?.last_name}</strong></td>
                      <td>{apt.patient?.phone || '—'}</td>
                      <td>
                        <span className={`badge ${
                          apt.status === 'Completed' ? 'bg-success' :
                          apt.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        {apt.status === 'Scheduled' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStartConsultation(apt)}
                          >
                            Start Consultation
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <p>No appointments scheduled for today</p>
            </div>
          )}
        </div>
      </div>

      {/* All Appointments */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
        <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
          <h5 className="mb-0">📋 All Appointments</h5>
        </div>
        <div className="card-body">
          {allAppointments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>{new Date(apt.date_time).toLocaleString()}</td>
                      <td><strong>{apt.patient?.first_name} {apt.patient?.last_name}</strong></td>
                      <td>{apt.patient?.phone || '—'}</td>
                      <td>
                        <span className={`badge ${
                          apt.status === 'Completed' ? 'bg-success' :
                          apt.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <p>No appointments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Form Modal */}
      {showConsultationModal && selectedAppointment && (
        <ConsultationForm
          appointment={selectedAppointment}
          onConsultationCreated={handleConsultationCreated}
          onClose={() => setShowConsultationModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboardEnhanced;

