// Prefer Vite env: import.meta.env.VITE_API_BASE_URL, fall back to REACT_APP_API_BASE_URL for compatibility
const viteUrl =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : undefined;

const legacy =
  typeof process !== "undefined" &&
  process.env &&
  process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL
    : undefined;

const API_BASE_URL = viteUrl || legacy || "http://localhost:8000/api";

export default API_BASE_URL;
