/*  src/services/receptionistService.js  */
import api from "./api";          // your configured axios instance

const DEFAULT_PAGE_SIZE = 20;

/* =========================================================
 * BILLING – corrected end-point + solid error handling
 * ========================================================= */

export async function fetchBills(params = {}) {
  try {
    const { data } = await api.get("/receptionist/billing/", { params });
    return Array.isArray(data) ? data : data.results || [];   // safe array
  } catch (e) {
    console.error("[fetchBills]", e);
    throw e.response?.data?.detail || "Unable to load billing data";
  }
}

export async function fetchBill(id) {
  try {
    const { data } = await api.get(`/receptionist/billing/${id}/`);
    return data;
  } catch (e) {
    console.error(`[fetchBill  ${id}]`, e);
    throw e.response?.data?.detail || `Error fetching bill ${id}`;
  }
}

export async function addBill(payload) {
  try {
    const { data } = await api.post("/receptionist/billing/", {
      appointment_id:   Number(payload.appointment_id),
      consultation_fee: Number(payload.consultation_fee) || 0,
      medicine_fee:     Number(payload.medicine_fee)     || 0,
      total_fee:        Number(payload.total_fee)        || 0,
      is_paid:          Boolean(payload.is_paid),
      timestamp:        payload.timestamp || new Date().toISOString(),
    });
    return data;
  } catch (e) {
    console.error("[addBill]", e);
    throw e.response?.data || "Failed to create bill";
  }
}

export async function updateBill(id, payload) {   // ← was missing
  try {
    const { data } = await api.put(`/receptionist/billing/${id}/`, {
      ...payload,
      appointment_id:   Number(payload.appointment_id),
      consultation_fee: Number(payload.consultation_fee) || 0,
      medicine_fee:     Number(payload.medicine_fee)     || 0,
      total_fee:        Number(payload.total_fee)        || 0,
      is_paid:          Boolean(payload.is_paid),
    });
    return data;
  } catch (e) {
    console.error(`[updateBill ${id}]`, e);
    throw e.response?.data || "Failed to update bill";
  }
}

export async function deleteBill(id) {
  try {
    await api.delete(`/receptionist/billing/${id}/`);
  } catch (e) {
    console.error(`[deleteBill ${id}]`, e);
    throw e.response?.data || "Failed to delete bill";
  }
}

export async function markBillAsPaid(id) {
  try {
    const { data } = await api.patch(`/receptionist/billing/${id}/`, { is_paid: true });
    return data;
  } catch (e) {
    console.error(`[markBillAsPaid ${id}]`, e);
    throw e.response?.data || "Failed to mark bill as paid";
  }
}

/* =========================================================
 * PATIENTS  (unchanged)
 * ========================================================= */
export async function fetchPatients(params = {}) {
  const res = await api.get("/receptionist/patients/", { params });
  return res.data.results || res.data;
}
export const fetchPatientById = async (id) => (await api.get(`/patients/${id}/`)).data;
export async function fetchPatient(id) {
  const res = await api.get(`/receptionist/patients/${id}/`);
  return res.data;
}
export async function addPatient(payload) {
  const res = await api.post("/receptionist/patients/", payload);
  return res.data;
}
export async function updatePatient(id, payload) {
  const res = await api.put(`/receptionist/patients/${id}/`, payload);
  return res.data;
}
export async function deletePatient(id) {
  const res = await api.delete(`/receptionist/patients/${id}/`);
  return res.data;
}

/* =========================================================
 * APPOINTMENTS  (unchanged)
 * ========================================================= */
export async function fetchAppointments(params = {}) {
  const res = await api.get("/receptionist/appointments/", { params });
  return res.data.results || res.data;
}
export const fetchAppointmentById = async (id) => (await api.get(`/appointments/${id}/`)).data;
export async function fetchAppointment(id) {
  const res = await api.get(`/receptionist/appointments/${id}/`);
  return res.data;
}
export async function addAppointment(payload) {
  // normalize payload: numeric ids and ISO datetime
  const body = {
    ...payload,
    doctor_id: payload.doctor_id ? Number(payload.doctor_id) : null,
    receptionist_id: payload.receptionist_id ? Number(payload.receptionist_id) : null,
    patient_id: payload.patient_id ? Number(payload.patient_id) : null,
    date_time: payload.date_time
      ? new Date(payload.date_time).toISOString()
      : payload.date_time,
  };
  try {
    console.debug("[addAppointment] body:", body);
    const res = await api.post("/receptionist/appointments/", body);
    return res.data;
  } catch (e) {
    console.error("[addAppointment] error:", e.response?.data || e.message || e);
    // rethrow server validation details (if any) so UI can show them
    throw e.response?.data || e.message || "Failed to create appointment";
  }
}

export async function updateAppointment(id, payload) {
  const body = {
    ...payload,
    doctor_id: payload.doctor_id ? Number(payload.doctor_id) : null,
    receptionist_id: payload.receptionist_id ? Number(payload.receptionist_id) : null,
    patient_id: payload.patient_id ? Number(payload.patient_id) : null,
    date_time: payload.date_time
      ? new Date(payload.date_time).toISOString()
      : payload.date_time,
  };
  try {
    console.debug(`[updateAppointment ${id}] body:`, body);
    const res = await api.put(`/receptionist/appointments/${id}/`, body);
    return res.data;
  } catch (e) {
    console.error(`[updateAppointment ${id}] error:`, e.response?.data || e.message || e);
    throw e.response?.data || e.message || "Failed to update appointment";
  }
}
export async function deleteAppointment(id) {
  const res = await api.delete(`/receptionist/appointments/${id}/`);
  return res.data;
}
export async function fetchPatientAppointments(patientId) {
  const res = await api.get(`/receptionist/appointments/?patient=${patientId}`);
  return res.data.results || res.data;
}

/* =========================================================
 * DOCTORS / RECEPTIONISTS  (unchanged)
 * ========================================================= */
export async function fetchDoctors() {
  const endpoints = [
    "/admin_app/doctors/",
    "/admin/doctors/",
    "/api/doctors/",
    "/doctors/",
  ];
  for (const ep of endpoints) {
    try {
      const res = await api.get(ep);
      return res.data.results || res.data;
    } catch (e) {
      // try next endpoint
    }
  }
  throw "Unable to fetch doctors from admin_app. Checked endpoints: /admin_app/doctors/, /admin/doctors/, /api/doctors/, /doctors/";
}
export async function fetchReceptionists() {
  const endpoints = [
    "/admin/users/?role=Receptionist",
    "/admin/users/?role=Receptionist&page=1", // in case paginated
    "/admin/staffs/?role=Receptionist",
    "/admin/staffs/",
    "/api/staffs/?role=Receptionist",
    "/api/users/?role=Receptionist",
  ];
  for (const ep of endpoints) {
    try {
      const res = await api.get(ep);
      const data = res.data.results || res.data;
      // If endpoint returns users, map users to a common shape expected by frontend:
      if (Array.isArray(data) && data.length > 0) {
        // detect user objects vs staff objects
        const first = data[0];
        if (first && first.user && typeof first.user === "object") {
          // staff-style object: return as-is
          return data;
        } else if (first && (first.role || first.username || first.first_name !== undefined)) {
          // user-style objects: convert to staff-like shape for frontend convenience
          return data.map(u => ({
            id: u.id,
            user: {
              id: u.id,
              username: u.username,
              first_name: u.first_name,
              last_name: u.last_name,
              email: u.email
            }
          }));
        } else {
          return data;
        }
      }
      return data || [];
    } catch (e) {
      // try next endpoint
    }
  }
  // helpful error if nothing worked
  throw "Unable to fetch receptionists. Checked admin users/staffs endpoints.";
}

/* =========================================================
 * DASHBOARD UTILS  (unchanged)
 * ========================================================= */
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