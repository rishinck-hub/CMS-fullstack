import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    today_appointments: 0,
    pending_consultations: 0,
    doctor_name: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await doctorService.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h1 className="h3 mb-2 text-primary">
                Welcome, {dashboardData.doctor_name}!
              </h1>
              <p className="text-muted">Here's your daily overview</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Today's Appointments
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {dashboardData.today_appointments}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar-check fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Consultations
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {dashboardData.pending_consultations}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-stethoscope fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 text-primary">
                <i className="fas fa-tachometer-alt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <a href="/doctor/queue" className="btn btn-primary w-100 py-3">
                    <i className="fas fa-users me-2"></i>
                    View Patient Queue
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/doctor/consultations" className="btn btn-success w-100 py-3">
                    <i className="fas fa-stethoscope me-2"></i>
                    Start Consultation
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/doctor/schedule" className="btn btn-info w-100 py-3">
                    <i className="fas fa-calendar me-2"></i>
                    View Schedule
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;