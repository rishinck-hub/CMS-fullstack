import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { RoleGuard } from '../auth/RoleGuard';

export default function RoleBasedNavigation() {
  const { getRoleBasedMenuItems, role } = useRole();
  const location = useLocation();
  const menuItems = getRoleBasedMenuItems();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Clinic Management System
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {role}
            </span>
            <RoleGuard roles={['Admin']}>
              <Link
                to="/admin/users"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Manage Users
              </Link>
            </RoleGuard>
            <button
              onClick={() => {
                // This would call logout from AuthContext
                window.location.href = '/login';
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
