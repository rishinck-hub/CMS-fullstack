import React from "react";
import { Routes, Route } from "react-router-dom";
import ReceptionistHome from "../pages/receptionist/ReceptionistHome";
import PatientList from "../components/receptionist/PatientList";
import AppointmentList from "../components/receptionist/AppointmentList";
import BillingList from "../components/receptionist/BillingList";

export default function ReceptionistRoutes() {
  return (
    <Routes>
      {/* Default or dashboard route */}
      <Route path="/" element={<ReceptionistHome />} />
      <Route path="/dashboard" element={<ReceptionistHome />} />

      {/* Manage Patients */}
      <Route path="/patients" element={<PatientList />} />

      {/* Book Appointments */}
      <Route path="/appointments" element={<AppointmentList />} />

      {/* Add Billing */}
      <Route path="/billing" element={<BillingList />} />
    </Routes>
  );
}
