import api from "@/lib/axios";
export const getPosts = (params) => api.get("/blog", { params }).then((r) => r.data);
export const getPost = (slug) => api.get(`/blog/${slug}`).then((r) => r.data);
export const createPost = (data) => api.post("/blog", data).then((r) => r.data);
export const updatePost = (id, data) => api.put(`/blog/${id}`, data).then((r) => r.data);
export const togglePublish = (id) => api.patch(`/blog/${id}/publish`).then((r) => r.data);
export const deletePost = (id) => api.delete(`/blog/${id}`);
