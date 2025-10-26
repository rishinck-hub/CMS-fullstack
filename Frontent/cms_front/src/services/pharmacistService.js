import api from "/src/services/api.js";  // <-- No curly braces

export const pharmacistService = {
  async listInventory() {
    return api.get("/pharmacist/medicines/");
  },

  async addMedicine(medicineData) {
    return api.post("/pharmacist/medicines/", medicineData);
  },

  async updateMedicine(medicineId, medicineData) {
    return api.put(`/pharmacist/medicines/${medicineId}/`, medicineData);
  },

  async deleteMedicine(medicineId) {
    return api.delete(`/pharmacist/medicines/${medicineId}/`);
  },

  async prescriptions() {
    return api.get("/pharmacist/prescriptionmedicines/");
  },

  async getDashboardStats() {
    return api.get("/pharmacist/medicinebilling/dashboard_stats/");
  }
};
