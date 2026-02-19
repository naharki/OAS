import api from "@/lib/api";

export const SuchiDartaService = {
  list: () => api.get("darta-chalani/suchi-darta/"),
  get: (id) => api.get(`darta-chalani/suchi-darta/${id}/`),
  create: (data) => api.post("darta-chalani/suchi-darta/", data),
  update: (id, data) => api.put(`darta-chalani/suchi-darta/${id}/`, data),
  remove: (id) => api.delete(`darta-chalani/suchi-darta/${id}/`),
  nextSuchiDartaNumber: () => api.get("darta-chalani/next-suchi-darta-number/"),
};
