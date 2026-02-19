import api from "@/lib/api"
export const wardsService = {
  list: () => api.get("/wards/"),
  get: (id) => api.get(`/wards/${id}/`),
  create: (data) => api.post("/wards/", data),
  update: (id, data) => api.put(`/wards/${id}/`, data),
  remove: (id) => api.delete(`/wards/${id}/`),
}