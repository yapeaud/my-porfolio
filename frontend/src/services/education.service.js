import api from "@/lib/axios";
export const getEducation = () => api.get("/education").then((r) => r.data);
export const createEducation = (data) => api.post("/education", data).then((r) => r.data);
export const updateEducation = (id, data) => api.put(`/education/${id}`, data).then((r) => r.data);
export const deleteEducation = (id) => api.delete(`/education/${id}`);
