import api from "./api";

// ===================== PATIENTS =====================
export const DEFAULT_PAGE_SIZE = 20;

// Fetch all patients with optional filters
export async function fetchPatients(params = {}) {
  try {
    const res = await api.get("/receptionist/patients/", { params });
    if (res.data && Array.isArray(res.data.results)) {
      return res.data;
    }
    return { results: res.data, count: Array.isArray(res.data) ? res.data.length : 0 };
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching patients";
  }
}

// Fetch a single patient
export async function fetchPatient(id) {
  try {
    const res = await api.get(`/receptionist/patients/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || `Error fetching patient ${id}`;
  }
}

// Add a new patient
export async function addPatient(payload) {
  try {
    const res = await api.post("/receptionist/patients/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add patient";
  }
}

// Update patient
export async function updatePatient(id, payload) {
  try {
    const res = await api.put(`/receptionist/patients/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update patient";
  }
}

// Delete patient
export async function deletePatient(id) {
  try {
    const res = await api.delete(`/receptionist/patients/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete patient";
  }
}

// ===================== APPOINTMENTS =====================

// Fetch appointments (today / upcoming / filters)
export async function fetchAppointments(params = {}) {
  try {
    const res = await api.get("/receptionist/appointments/", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching appointments";
  }
}

// Add a new appointment
export async function addAppointment(payload) {
  try {
    const res = await api.post("/receptionist/appointments/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add appointment";
  }
}

// Update appointment
export async function updateAppointment(id, payload) {
  try {
    const res = await api.put(`/receptionist/appointments/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update appointment";
  }
}

// Delete appointment
export async function deleteAppointment(id) {
  try {
    const res = await api.delete(`/receptionist/appointments/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete appointment";
  }
}

// ===================== BILLING =====================

// Fetch bills
export async function fetchBills(params = {}) {
  try {
    const res = await api.get("/receptionist/billing/", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching bills";
  }
}

// Add a bill
export async function addBill(payload) {
  try {
    const res = await api.post("/receptionist/billing/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add bill";
  }
}

// Update a bill
export async function updateBill(id, payload) {
  try {
    const res = await api.put(`/receptionist/billing/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update bill";
  }
}

// Delete a bill
export async function deleteBill(id) {
  try {
    const res = await api.delete(`/receptionist/billing/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete bill";
  }
}

// ===================== DASHBOARD STATS =====================
export async function fetchDashboardStats() {
  try {
    const res = await api.get("/receptionist/dashboard-stats/");
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not fetch dashboard stats";
  }
}
