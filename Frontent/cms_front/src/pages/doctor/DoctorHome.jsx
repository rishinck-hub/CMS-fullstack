import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../../components/doctor/DoctorDashboard';
import PatientQueueList from '../../components/doctor/PatientQueueList';
import Consultations from './Consultations';
import Schedule from './Schedule';

const DoctorHome = () => {
  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<DoctorDashboard />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/queue" element={<PatientQueueList />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </div>
  );
};

export default DoctorHome;
