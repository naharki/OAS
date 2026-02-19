import api from "@/lib/api"
export const fiscalyearsService = {
  list: () => api.get("/fiscalyears/"),
  get: (id) => api.get(`/fiscalyears/${id}/`),
  create: (data) => api.post("/fiscalyears/", data),
  update: (id, data) => api.put(`/fiscalyears/${id}/`, data),
  remove: (id) => api.delete(`/fiscalyears/${id}/`),
}