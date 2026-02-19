import api from "@/lib/api";

export const DesignationService = {
  list: () => api.get("darta-chalani/designations/"),
  get: (id) => api.get(`darta-chalani/designations/${id}/`),
  create: (data) => api.post("darta-chalani/designations/", data),
  update: (id, data) => api.put(`darta-chalani/designations/${id}/`, data),
  remove: (id) => api.delete(`darta-chalani/designations/${id}/`),
};

export const DartaService = {
  list: () => api.get("darta-chalani/darta/"),
  get: (id) => api.get(`darta-chalani/darta/${id}/`),
  create: (data) => api.post("darta-chalani/darta/", data),
  update: (id, data) => api.put(`darta-chalani/darta/${id}/`, data),
  remove: (id) => api.delete(`darta-chalani/darta/${id}/`),
  nextDartaNumber: () => api.get("darta-chalani/next-darta-number/"),
};

export const ChalaniService = {
  list: () => api.get("darta-chalani/chalani/"),
  get: (id) => api.get(`darta-chalani/chalani/${id}/`),
  create: (data) => api.post("darta-chalani/chalani/", data),
  update: (id, data) => api.put(`darta-chalani/chalani/${id}/`, data),
  remove: (id) => api.delete(`darta-chalani/chalani/${id}/`),
  nextChalaniNumber: () => api.get("darta-chalani/next-chalani-number/"),
};
 