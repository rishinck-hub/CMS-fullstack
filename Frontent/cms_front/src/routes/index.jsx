import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminDashboard from "../components/admin/AdminDashboard";
import ReceptionistDashboard from "../components/receptionist/ReceptionistDashboard";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import Unauthorized from "../pages/Unauthorized";
import DashboardRedirect from "../components/auth/DashboardRedirect";
import AuthTest from "../components/auth/AuthTest";

// Import role-specific routes
import AdminRoutes from "./adminRoutes";
import DoctorRoutes from "./doctorRoutes";
import ReceptionistRoutes from "./receptionistRoutes";
import PharmacistRoutes from "./pharmacistRoutes";

function NotFound() {
  return <div style={{ padding: 40 }}>Page not found</div>;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <RoleBasedRoute roles={['Admin']}>
            <AdminRoutes />
          </RoleBasedRoute>
        } />
        
        {/* Doctor Routes */}
        <Route path="/doctor/*" element={
          <RoleBasedRoute roles={['Doctor']}>
            <DoctorRoutes />
          </RoleBasedRoute>
        } />
        
        {/* Receptionist Routes */}
        <Route path="/receptionist/*" element={
          <RoleBasedRoute roles={['Receptionist']}>
            <ReceptionistRoutes />
          </RoleBasedRoute>
        } />
        
        {/* Pharmacist Routes */}
        <Route path="/pharmacist/*" element={
          <RoleBasedRoute roles={['Pharmacist']}>
            <PharmacistRoutes />
          </RoleBasedRoute>
        } />
        
        {/* Default redirect based on role */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } />
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/auth-test" element={
          <ProtectedRoute>
            <AuthTest />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
