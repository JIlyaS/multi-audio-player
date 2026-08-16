import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}${import.meta.env.VITE_APP_API_URI}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiClient;
