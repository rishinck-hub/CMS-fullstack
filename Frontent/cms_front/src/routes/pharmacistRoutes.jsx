import React from "react";
import { Routes, Route } from "react-router-dom";
import PharmacyHome from "../pages/pharmacist/PharmacyHome";

export default function PharmacistRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PharmacyHome />} />
      <Route path="/dashboard" element={<PharmacyHome />} />
    </Routes>
  );
}
