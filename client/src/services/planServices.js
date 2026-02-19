import api from "@/lib/api"
export const plansService = {
  list: () => api.get("/plans/"),
  get: (id) => api.get(`/plans/${id}/`),
  create: (data) => api.post("/plans/", data),
  update: (id, data) => api.put(`/plans/${id}/`, data),
  remove: (id) => api.delete(`/plans/${id}/`),
}