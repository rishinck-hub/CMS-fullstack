import React from "react";
import { Routes, Route } from "react-router-dom";
import ReceptionistHome from "../pages/receptionist/ReceptionistHome";

export default function ReceptionistRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReceptionistHome />} />
      <Route path="/dashboard" element={<ReceptionistHome />} />
    </Routes>
  );
}
