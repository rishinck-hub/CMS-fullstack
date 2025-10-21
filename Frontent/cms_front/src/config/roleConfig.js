// Role configuration for routing and sidebar, etc.

export const ROLE_DASHBOARD_ROUTES = {
  Admin: "/admin/dashboard",
  Receptionist: "/receptionist/dashboard",
  Doctor: "/doctor/dashboard",
  Pharmacist: "/pharmacist/dashboard"
};

export const SIDEBAR_LINKS = {
  Admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { to: "/admin/users", label: "Manage Users", icon: "bi-people" },
    { to: "/admin/reports", label: "Reports", icon: "bi-bar-chart" },
    { to: "/admin/settings", label: "Settings", icon: "bi-gear" }
  ],
  Receptionist: [
    { to: "/receptionist/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { to: "/receptionist/patients", label: "Patients", icon: "bi-person" },
    { to: "/receptionist/appointments", label: "Appointments", icon: "bi-calendar" },
    { to: "/receptionist/billing", label: "Billing", icon: "bi-wallet2" }
  ],
  Doctor: [
    { to: "/doctor/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { to: "/doctor/schedule", label: "Schedule", icon: "bi-calendar" },
    { to: "/doctor/consultations", label: "Consultations", icon: "bi-file-medical" }
  ],
  Pharmacist: [
    { to: "/pharmacist/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { to: "/pharmacist/inventory", label: "Inventory", icon: "bi-capsule" }
  ]
};
