import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import DoctorDashboardEnhanced from './DoctorDashboardEnhanced';

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
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <DoctorDashboardEnhanced />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;