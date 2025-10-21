import { api } from "./api";

export const receptionistService = {
  async createPatient(payload) {
    return api.post("/reception/patients", payload);
  },
};
