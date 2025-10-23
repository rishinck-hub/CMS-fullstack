import React from 'react';
import { useAuth, useRole, usePermission, useRoleCheck } from '../../hooks/useRole';
import { 
  RoleGuard, 
  AdminOnly, 
  DoctorOnly, 
  ReceptionistOnly, 
  PharmacistOnly,
  AdminOrDoctor,
  AdminOrReceptionist,
  AdminOrPharmacist
} from './RoleGuard';

export default function AuthExample() {
  const { user, isAuthenticated, hasRole, hasPermission } = useAuth();
  const { role, getRoleBasedMenuItems } = useRole();
  const canManagePatients = usePermission('manage_patients');
  const isAdminOrDoctor = useRoleCheck(['Admin', 'Doctor']);

  if (!isAuthenticated) {
    return <div>Please log in to see role-based features</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Role-Based Authentication Demo</h1>
      
      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Current User Info</h2>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      </div>

      {/* Role-based Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Admin Only Content */}
        <AdminOnly fallback={<div className="p-4 bg-red-100 rounded">Admin access required</div>}>
          <div className="p-4 bg-green-100 rounded">
            <h3 className="font-semibold text-green-800">Admin Panel</h3>
            <p>This content is only visible to administrators.</p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
              Manage System
            </button>
          </div>
        </AdminOnly>

        {/* Doctor Only Content */}
        <DoctorOnly fallback={<div className="p-4 bg-red-100 rounded">Doctor access required</div>}>
          <div className="p-4 bg-blue-100 rounded">
            <h3 className="font-semibold text-blue-800">Doctor Dashboard</h3>
            <p>This content is only visible to doctors.</p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              View Patients
            </button>
          </div>
        </DoctorOnly>

        {/* Receptionist Only Content */}
        <ReceptionistOnly fallback={<div className="p-4 bg-red-100 rounded">Receptionist access required</div>}>
          <div className="p-4 bg-yellow-100 rounded">
            <h3 className="font-semibold text-yellow-800">Receptionist Panel</h3>
            <p>This content is only visible to receptionists.</p>
            <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded">
              Schedule Appointment
            </button>
          </div>
        </ReceptionistOnly>

        {/* Pharmacist Only Content */}
        <PharmacistOnly fallback={<div className="p-4 bg-red-100 rounded">Pharmacist access required</div>}>
          <div className="p-4 bg-purple-100 rounded">
            <h3 className="font-semibold text-purple-800">Pharmacy Panel</h3>
            <p>This content is only visible to pharmacists.</p>
            <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">
              Manage Medicines
            </button>
          </div>
        </PharmacistOnly>

        {/* Combined Role Access */}
        <AdminOrDoctor fallback={<div className="p-4 bg-red-100 rounded">Admin or Doctor access required</div>}>
          <div className="p-4 bg-indigo-100 rounded">
            <h3 className="font-semibold text-indigo-800">Medical Records</h3>
            <p>This content is visible to both admins and doctors.</p>
            <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">
              View Medical Records
            </button>
          </div>
        </AdminOrDoctor>

        {/* Permission-based Content */}
        <RoleGuard 
          permissions={['manage_patients']} 
          fallback={<div className="p-4 bg-red-100 rounded">Patient management permission required</div>}
        >
          <div className="p-4 bg-teal-100 rounded">
            <h3 className="font-semibold text-teal-800">Patient Management</h3>
            <p>This content requires patient management permission.</p>
            <button className="mt-2 px-4 py-2 bg-teal-600 text-white rounded">
              Manage Patients
            </button>
          </div>
        </RoleGuard>

        {/* Custom Role Check */}
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold text-gray-800">Custom Role Check</h3>
          <p>Can manage patients: {canManagePatients ? 'Yes' : 'No'}</p>
          <p>Is Admin or Doctor: {isAdminOrDoctor ? 'Yes' : 'No'}</p>
          <p>Has specific role: {hasRole('Admin') ? 'Yes' : 'No'}</p>
        </div>

        {/* Role-based Menu Items */}
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold text-gray-800">Available Menu Items</h3>
          <ul className="list-disc list-inside">
            {getRoleBasedMenuItems().map((item, index) => (
              <li key={index}>{item.label} - {item.path}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">1. Route Protection:</h4>
            <pre className="bg-gray-200 p-2 rounded text-sm">
{`<Route path="/admin/*" element={
  <RoleBasedRoute roles={['Admin']}>
    <AdminRoutes />
  </RoleBasedRoute>
} />`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium">2. Component Protection:</h4>
            <pre className="bg-gray-200 p-2 rounded text-sm">
{`<AdminOnly fallback={<div>Access denied</div>}>
  <AdminPanel />
</AdminOnly>`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium">3. Permission Check:</h4>
            <pre className="bg-gray-200 p-2 rounded text-sm">
{`const canManage = usePermission('manage_patients');
return canManage ? <ManageButton /> : null;`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
