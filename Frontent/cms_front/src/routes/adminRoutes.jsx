import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "../pages/admin/AdminHome";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/home" element={<AdminHome />} />
    </Routes>
  );
}
