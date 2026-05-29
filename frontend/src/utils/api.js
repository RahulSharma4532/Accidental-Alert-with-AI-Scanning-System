import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust to your Laravel local URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auto-inject the Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
