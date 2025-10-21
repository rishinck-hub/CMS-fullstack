import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminDashboard from "../components/admin/AdminDashboard";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";

function NotFound() {
  return <div style={{ padding: 40 }}>Page not found</div>;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
