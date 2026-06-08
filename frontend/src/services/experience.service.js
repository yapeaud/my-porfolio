import api from "@/lib/axios";
export const getExperiences = () => api.get("/experience").then((r) => r.data);
export const createExperience = (data) => api.post("/experience", data).then((r) => r.data);
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data).then((r) => r.data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);
