import api from "./api"; // Axios instance or base API

export const DEFAULT_PAGE_SIZE = 20;

// ===================== PATIENTS =====================

export async function fetchPatients(params = {}) {
  try {
    const res = await api.get("/receptionist/patients/", { params });
    return res.data.results || res.data; // support DRF pagination
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching patients";
  }
}

export async function fetchPatient(id) {
  try {
    const res = await api.get(`/receptionist/patients/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || `Error fetching patient ${id}`;
  }
}

export async function addPatient(payload) {
  try {
    const res = await api.post("/receptionist/patients/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add patient";
  }
}

export async function updatePatient(id, payload) {
  try {
    const res = await api.put(`/receptionist/patients/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update patient";
  }
}

export async function deletePatient(id) {
  try {
    const res = await api.delete(`/receptionist/patients/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete patient";
  }
}

// ===================== APPOINTMENTS =====================

export async function fetchAppointments(params = {}) {
  try {
    const res = await api.get("/receptionist/appointments/", { params });
    return res.data.results || res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching appointments";
  }
}

export async function fetchAppointment(id) {
  try {
    const res = await api.get(`/receptionist/appointments/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || `Error fetching appointment ${id}`;
  }
}

export async function addAppointment(payload) {
  try {
    const res = await api.post("/receptionist/appointments/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add appointment";
  }
}

export async function updateAppointment(id, payload) {
  try {
    const res = await api.put(`/receptionist/appointments/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update appointment";
  }
}

export async function deleteAppointment(id) {
  try {
    const res = await api.delete(`/receptionist/appointments/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete appointment";
  }
}

// ===================== BILLING =====================

export async function fetchBills(params = {}) {
  try {
    const res = await api.get("/receptionist/billing/", { params });
    return res.data.results || res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching bills";
  }
}

export async function fetchBill(id) {
  try {
    const res = await api.get(`/receptionist/billing/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || `Error fetching bill ${id}`;
  }
}

export async function addBill(payload) {
  try {
    const res = await api.post("/receptionist/billing/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add bill";
  }
}

export async function updateBill(id, payload) {
  try {
    const res = await api.put(`/receptionist/billing/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update bill";
  }
}

export async function deleteBill(id) {
  try {
    const res = await api.delete(`/receptionist/billing/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete bill";
  }
}

// ===================== UTILITY FUNCTIONS =====================

// Calculate dashboard stats from fetched data
export function calculateDashboardStats(patients, appointments, bills) {
  const today = new Date().toDateString();

  return {
    total_patients: patients.length,
    today_appointments: appointments.filter(
      (a) => new Date(a.date).toDateString() === today
    ).length,
    pending_bills: bills.filter((b) => !b.is_paid).length,
  };
}
