// src/routes/pharmacistRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Core pharmacist pages
import EnhancedPharmacyDashboard from "../components/pharmacist/EnhancedPharmacyDashboard";
import AddMedicine from "../components/pharmacist/AddMedicine";
import BillingManagement from "../components/pharmacist/BillingManagement";
import PrescriptionViewer from "../components/pharmacist/PrescriptionViewer";

// New management pages
import MedicineManagementPage from "../pages/pharmacist/MedicineManagement";
import PrescriptionManagementPage from "../pages/pharmacist/PrescriptionManagement";
import BillingManagementPage from "../pages/pharmacist/BillingManagement";

// Test/legacy pages
import TestPharmacistDashboard from "../pages/pharmacist/TestPharmacistDashboard";
import WorkingDashboard from "../pages/pharmacist/WorkingDashboard";
import TestMedicineManagement from "../pages/pharmacist/TestMedicineManagement";
import TestBillingPrescription from "../pages/pharmacist/TestBillingPrescription";
import SimpleBillingManagement from "../pages/pharmacist/SimpleBillingManagement";
import SimplePrescriptionViewer from "../pages/pharmacist/SimplePrescriptionViewer";
import WorkingBillingPrescription from "../pages/pharmacist/WorkingBillingPrescription";
import FinalWorkingSystem from "../pages/pharmacist/FinalWorkingSystem";
import OldBillingManagement from "../components/pharmacist/OldBillingManagement";
import OldPrescriptionViewer from "../components/pharmacist/OldPrescriptionViewer";
import SimplePharmacyDashboard from "../components/pharmacist/SimplePharmacyDashboard";

function NotFound() {
  return <div style={{ padding: 24 }}>Pharmacist page not found</div>;
}

export default function PharmacistRoutes() {
  return (
    <Routes>
      {/* Default: /pharmacist -> dashboard */}
      <Route index element={<EnhancedPharmacyDashboard />} />

      {/* Core pharmacy routes */}
      <Route path="dashboard" element={<EnhancedPharmacyDashboard />} />
      <Route path="medicines" element={<MedicineManagementPage />} />
      <Route path="billing" element={<BillingManagementPage />} />
      <Route path="prescriptions" element={<PrescriptionManagementPage />} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="old-medicines" element={<AddMedicine />} />
      <Route path="old-billing" element={<BillingManagement />} />
      <Route path="old-prescriptions" element={<PrescriptionViewer />} />

      {/* Relocated test/demo routes under /pharmacist/... */}
      <Route path="test-pharmacist" element={<TestPharmacistDashboard />} />
      <Route path="test-pharmacist/dashboard" element={<EnhancedPharmacyDashboard />} />
      <Route path="test-pharmacist/medicines" element={<AddMedicine />} />

      <Route path="working-dashboard" element={<WorkingDashboard />} />
      <Route path="test-medicine-management" element={<TestMedicineManagement />} />
      <Route path="test-billing-management" element={<BillingManagement />} />
      <Route path="test-prescription-viewer" element={<PrescriptionViewer />} />
      <Route path="test-billing-prescription" element={<TestBillingPrescription />} />
      <Route path="simple-billing" element={<SimpleBillingManagement />} />
      <Route path="simple-prescriptions" element={<SimplePrescriptionViewer />} />
      <Route path="working-billing-prescription" element={<WorkingBillingPrescription />} />
      <Route path="final-working-system" element={<FinalWorkingSystem />} />
      <Route path="old-billing" element={<OldBillingManagement />} />
      <Route path="old-prescriptions" element={<OldPrescriptionViewer />} />

      {/* Legacy simple dashboard */}
      <Route path="simple-dashboard" element={<SimplePharmacyDashboard />} />

      {/* Module-scoped 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
