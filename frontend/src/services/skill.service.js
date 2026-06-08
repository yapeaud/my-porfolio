import api from "@/lib/axios";
export const getSkills = () => api.get("/skills").then((r) => r.data);
export const createSkill = (data) => api.post("/skills", data).then((r) => r.data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data).then((r) => r.data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);
