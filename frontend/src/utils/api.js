import axios from 'axios';

// Use environment variable for API URL, fallback to proxy in dev or relative path
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running. Please start the backend server on port 5000.');
    }
    return Promise.reject(error);
  }
);

export default api;

