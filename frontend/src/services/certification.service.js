import api from "@/lib/axios";
export const getCertifications = () => api.get("/certifications").then((r) => r.data);
export const createCertification = (data) => api.post("/certifications", data).then((r) => r.data);
export const updateCertification = (id, data) => api.put(`/certifications/${id}`, data).then((r) => r.data);
export const deleteCertification = (id) => api.delete(`/certifications/${id}`);
