import axios from "axios";

// In production on Vercel, requests to '/api/...' can go directly to the same domain (relative URL)
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "",
    timeout: 15000,
    withCredentials: true,
});

export default API;
