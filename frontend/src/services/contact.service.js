import api from "@/lib/axios";
export const submitContact = (data) => api.post("/contact", data).then((r) => r.data);
export const getMessages = (params) => api.get("/contact/messages", { params }).then((r) => r.data);
export const getMessage = (id) => api.get(`/contact/messages/${id}`).then((r) => r.data);
export const toggleRead = (id) => api.patch(`/contact/messages/${id}/read`).then((r) => r.data);
export const deleteMessage = (id) => api.delete(`/contact/messages/${id}`);
