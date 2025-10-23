import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useRole";

export default function Sidebar({ className = "" }) {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const getMenuItems = () => {
    if (!user) return [];
    const basePath = `/${user.role.toLowerCase()}`;
    if (hasRole('Admin')) {
      return [
        { path: `${basePath}/dashboard`, label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: `${basePath}/users`, label: 'Users', icon: 'bi-people' },
        { path: `${basePath}/doctors`, label: 'Doctors', icon: 'bi-heart-pulse' },
        { path: `${basePath}/staff`, label: 'Staff', icon: 'bi-person-badge' },
        { path: `${basePath}/specializations`, label: 'Specializations', icon: 'bi-bookmark' },
      ];
    } else if (hasRole('Doctor')) {
      return [
        { path: `${basePath}/dashboard`, label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: `${basePath}/patients`, label: 'Patients', icon: 'bi-people' },
        { path: `${basePath}/consultations`, label: 'Consultations', icon: 'bi-clipboard-pulse' },
      ];
    } else if (hasRole('Receptionist')) {
      return [
        { path: `${basePath}/dashboard`, label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: `${basePath}/patients`, label: 'Patients', icon: 'bi-people' },
        { path: `${basePath}/appointments`, label: 'Appointments', icon: 'bi-calendar-check' },
      ];
    } else if (hasRole('Pharmacist')) {
      return [
        { path: `${basePath}/dashboard`, label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: `${basePath}/medicines`, label: 'Medicines', icon: 'bi-capsule' },
        { path: `${basePath}/prescriptions`, label: 'Prescriptions', icon: 'bi-prescription' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <>
      <div
        className={`bg-white border-end vh-100 sidebar-theme shadow-sm ${className}`}
        style={{ width: 250 }}
      >
        <div className="p-3 border-bottom">
          <h6 className="mb-0 text-muted">
            <i className="bi bi-person-circle me-2"></i>
            {user?.role} Panel
          </h6>
        </div>
        <div className="list-group list-group-flush">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`list-group-item list-group-item-action border-0 sidebar-link ${
                isActive(item.path) ? 'active' : ''
              }`}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-3 border-top">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Welcome, {user?.username}
          </small>
        </div>
      </div>
      <style>{`
        .sidebar-theme {
          background: #fff;
          border-right: 1.5px solid #e3e3e3;
        }
        .sidebar-link {
          border-radius: 8px;
          margin-bottom: 4px;
          font-weight: 500;
        }
        .sidebar-link.active,
        .sidebar-link.active:focus {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff !important;
        }
        .sidebar-link:hover:not(.active) {
          background: #f6f8fa;
          color: #667eea;
        }
      `}</style>
    </>
  );
}
