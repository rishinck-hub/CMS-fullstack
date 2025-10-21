// Dashboard widget configuration for each role

export const DASHBOARD_WIDGETS = {
  Admin: [
    { key: "users", title: "Total Users", icon: "bi-person" },
    { key: "doctors", title: "Doctors", icon: "bi-heart-pulse" },
    { key: "appointments", title: "Appointments", icon: "bi-calendar-check" },
    { key: "revenue", title: "Total Revenue", icon: "bi-cash" },
  ],
  Receptionist: [
    { key: "patients", title: "Patients", icon: "bi-people" },
    { key: "appointments", title: "Appointments", icon: "bi-calendar-plus" },
    { key: "billings", title: "Billings", icon: "bi-receipt" }
  ],
  Doctor: [
    { key: "myAppointments", title: "My Appointments", icon: "bi-calendar" },
    { key: "todayPatients", title: "Today's Patients", icon: "bi-person-lines-fill" }
  ],
  Pharmacist: [
    { key: "medicines", title: "Medicines in Stock", icon: "bi-capsule" },
    { key: "dispensed", title: "Dispensed Today", icon: "bi-box-arrow-right" }
  ]
};
