import { api } from "./api";

export const pharmacistService = {
  async listInventory() {
    return api.get("/pharmacy/inventory");
  },
};
