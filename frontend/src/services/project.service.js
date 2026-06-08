import api from "@/lib/axios";
export const getProjects = (params) => api.get("/projects", { params }).then((r) => r.data);
export const getProject = (slug) => api.get(`/projects/${slug}`).then((r) => r.data);
export const createProject = (data) => api.post("/projects", data).then((r) => r.data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const deleteProjectImage = (id, imageId) => api.delete(`/projects/${id}/images/${imageId}`);
