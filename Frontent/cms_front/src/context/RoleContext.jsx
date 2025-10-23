import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const RoleContext = createContext();

export function RoleProvider({ children }) {
  const { user, hasRole, hasPermission } = useContext(AuthContext);
  const role = user?.role || null;

  // Role-based navigation and UI helpers
  const getRoleBasedRoutes = () => {
    const routes = {
      Admin: ['/admin/dashboard', '/admin/users', '/admin/doctors', '/admin/staff'],
      Doctor: ['/doctor/dashboard', '/doctor/patients', '/doctor/consultations'],
      Receptionist: ['/receptionist/dashboard', '/receptionist/patients', '/receptionist/appointments'],
      Pharmacist: ['/pharmacist/dashboard', '/pharmacist/medicines', '/pharmacist/prescriptions']
    };
    return routes[role] || [];
  };

  const getRoleBasedMenuItems = () => {
    const menuItems = {
      Admin: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
        { label: 'Users', path: '/admin/users', icon: 'users' },
        { label: 'Doctors', path: '/admin/doctors', icon: 'doctor' },
        { label: 'Staff', path: '/admin/staff', icon: 'staff' }
      ],
      Doctor: [
        { label: 'Dashboard', path: '/doctor/dashboard', icon: 'dashboard' },
        { label: 'Patients', path: '/doctor/patients', icon: 'patients' },
        { label: 'Consultations', path: '/doctor/consultations', icon: 'consultation' }
      ],
      Receptionist: [
        { label: 'Dashboard', path: '/receptionist/dashboard', icon: 'dashboard' },
        { label: 'Patients', path: '/receptionist/patients', icon: 'patients' },
        { label: 'Appointments', path: '/receptionist/appointments', icon: 'appointment' }
      ],
      Pharmacist: [
        { label: 'Dashboard', path: '/pharmacist/dashboard', icon: 'dashboard' },
        { label: 'Medicines', path: '/pharmacist/medicines', icon: 'medicine' },
        { label: 'Prescriptions', path: '/pharmacist/prescriptions', icon: 'prescription' }
      ]
    };
    return menuItems[role] || [];
  };

  return (
    <RoleContext.Provider value={{ 
      role, 
      hasRole, 
      hasPermission,
      getRoleBasedRoutes,
      getRoleBasedMenuItems
    }}>
      {children}
    </RoleContext.Provider>
  );
}
