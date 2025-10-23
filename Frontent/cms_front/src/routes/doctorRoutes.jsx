import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorHome from "../pages/doctor/DoctorHome";

export default function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DoctorHome />} />
      <Route path="/dashboard" element={<DoctorHome />} />
    </Routes>
  );
}
