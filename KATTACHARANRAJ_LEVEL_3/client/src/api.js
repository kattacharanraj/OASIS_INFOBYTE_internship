import axios from 'axios';

// One place that talks to the backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Attach the login token to every request (if we have one)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
