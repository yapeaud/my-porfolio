import api from "@/lib/axios";
export const getProfile = () => api.get("/profile").then((r) => r.data);
export const updateProfile = (data) => api.put("/profile", data).then((r) => r.data);
export const uploadCv = (file) => {
  const fd = new FormData();
  fd.append("document", file);
  return api.put("/profile/cv", fd).then((r) => r.data);
};
