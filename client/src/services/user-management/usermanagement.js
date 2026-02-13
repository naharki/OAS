import api from "@/lib/api";

export const AppsService = {
  list: () => api.get("/users/apps/"),
//   get: (id) => api.get(`/users/apps/${id}/`),
  create: (data) => api.post("/users/apps/", data),
//   update: (id, data) => api.put(`/users/apps/${id}/`, data),
//   remove: (id) => api.delete(`/users/apps/${id}/`),
};

export const AdminService = {
  list: () => api.get("/users/admins/"),
  get: (id) => api.get(`/users/create-admin/${id}/`),
  create: (data) => api.post("/users/create-admin/", data),
  update: (id, data) => api.put(`/users/update-admin/${id}/`, data),
  remove: (id) => api.delete(`/users/delete-admin/${id}/`),
};