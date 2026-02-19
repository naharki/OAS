import api from "@/lib/api";

export const CommitteeService = {
  list: () => api.get("/committees/"),
  get: (id) => api.get(`/committees/${id}/`),
  create: (data) => api.post("/committees/", data),
  update: (id, data) => api.put(`/committees/${id}/`, data),
  remove: (id) => api.delete(`/committeese/${id}/`),
};

export const CommitteeTypesService = {
  list: () => api.get("/committeetypes/"),
  get: (id) => api.get(`/committeetypes/${id}/`),
  create: (data) => api.post("/committeetypes/", data),
  update: (id, data) => api.put(`/committeetypes/${id}/`, data),
  remove: (id) => api.delete(`/committeetypes/${id}/`),
}