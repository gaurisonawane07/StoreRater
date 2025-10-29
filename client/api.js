// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://storerater-4.onrender.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
