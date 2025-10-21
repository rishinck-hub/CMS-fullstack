import { api } from "./api";

export const doctorService = {
  async getConsultations() {
    return api.get("/doctor/consultations");
  },
};
