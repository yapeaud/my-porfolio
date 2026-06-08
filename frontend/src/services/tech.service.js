import api from "@/lib/axios";
export const getTechs = () => api.get("/techs").then((r) => r.data);
export const createTech = (data) => api.post("/techs", data).then((r) => r.data);
export const updateTech = (id, data) => api.put(`/techs/${id}`, data).then((r) => r.data);
export const deleteTech = (id) => api.delete(`/techs/${id}`);
