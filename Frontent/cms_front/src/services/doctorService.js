import api from "./api"; // Default import

export const doctorService = {
  async getConsultations() {
    return api.get("/doctor/consultations");
  },

  async getAppointments() {
    return api.get("/doctor/appointments/");
  },

  async getTodayAppointments() {
    return api.get("/doctor/appointments/today/");
  },

  async getDashboardData() {
    return api.get("/doctor/dashboard");
  },

  async createConsultation(data) {
    return api.post("/doctor/consultations/", data);
  },

  async createPrescription(data) {
    return api.post("/doctor/prescriptions/", data);
  },

  async addMedicineToPrescription(prescriptionId, medicineData) {
    return api.post(`/doctor/prescriptions/${prescriptionId}/add_medicine/`, medicineData);
  },

  async updateAppointment(id, data) {
    return api.patch(`/doctor/appointments/${id}/`, data);
  },

  async getPrescriptions() {
    return api.get("/doctor/prescriptions");
  }
};