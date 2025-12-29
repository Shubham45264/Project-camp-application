import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export const loginUser = (data: {
  email: string;
  password: string;
}) => api.post("/auth/login", data);
