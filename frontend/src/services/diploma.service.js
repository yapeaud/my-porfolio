import api from "@/lib/axios";
export const getDiplomas = () => api.get("/diplomas").then((r) => r.data);
export const createDiploma = (data) => api.post("/diplomas", data).then((r) => r.data);
export const updateDiploma = (id, data) => api.put(`/diplomas/${id}`, data).then((r) => r.data);
export const deleteDiploma = (id) => api.delete(`/diplomas/${id}`);
