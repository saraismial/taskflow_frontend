import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

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

// Basic 401 handler placeholder, add refresh logic later
client.interceptors.response.use(
    (res) => res, 
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("Received 401...");
        }
        return Promise.reject(error);
    }
);

export default client;