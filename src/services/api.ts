import axios from 'axios';

const API_BASE_URL = 'https://investmind-app-c7irq.ondigitalocean.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('investmind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post('/api/auth/signup', { name, email, password });
  return response.data;
};

export default api;