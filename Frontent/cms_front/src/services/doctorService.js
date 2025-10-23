import api from "./api"; // Default import

export const doctorService = {
  async getConsultations() {
    return api.get("/doctor/consultations");
  },

  async getAppointments() {
    return api.get("/doctor/appointments");
  },

  async getDashboardData() {
    return api.get("/doctor/dashboard");
  },

  async createConsultation(data) {
    return api.post("/doctor/consultations", data);
  },

  async createPrescription(data) {
    return api.post("/doctor/prescriptions", data);
  },

  async updateAppointment(id, data) {
    return api.patch(`/doctor/appointments/${id}`, data);
  }
};