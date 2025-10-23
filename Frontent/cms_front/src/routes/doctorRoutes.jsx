import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorHome from "../pages/doctor/DoctorHome";
import Consultations from "../pages/doctor/Consultations";
import Schedule from "../pages/doctor/Schedule";

export default function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DoctorHome />} />
      <Route path="/dashboard" element={<DoctorHome />} />
      <Route path="/queue" element={<DoctorHome />} />
      <Route path="/consultations" element={<Consultations />} />
      <Route path="/schedule" element={<Schedule />} />
    </Routes>
  );
}