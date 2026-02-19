import api from "@/lib/api";

export const OfficeService = {
  list: () => api.get("/offices/"),
  get: (id) => api.get(`/offices/${id}/`),
  create: (data) => api.post("/offices/", data),
  update: (id, data) => api.put(`/offices/${id}/`, data),
  remove: (id) => api.delete(`/offices/${id}/`)
};
