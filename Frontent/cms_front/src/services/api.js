import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    // Do not attach Authorization header when requesting token endpoints
    const tokenEndpoints = ["/token/", "/token/refresh/"];
    const isTokenEndpoint = tokenEndpoints.some(
      (ep) => config.url && config.url.includes(ep)
    );
    const token = localStorage.getItem("accessToken");
    if (token && !isTokenEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
