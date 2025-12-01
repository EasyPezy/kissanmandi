import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

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

