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

export default client;