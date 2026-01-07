import axios from "axios";

// VIte ngrok env var & fallback for AWS later
const API_BASE_URL =import.meta.env.VITE_API_URL || "/api";

const client = axios.create({
    baseURL: API_BASE_URL,
});

// Attach access token from localStoarge
client.interceptors.request.use((config) => {
    const token = localStorage.getItem("tfp_accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;