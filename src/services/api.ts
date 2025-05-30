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

// Portfolio API endpoints
export const getPortfolios = async () => {
  const response = await api.get('/api/portfolios');
  return response.data;
};

export const createPortfolio = async (name: string) => {
  const response = await api.post('/api/portfolios', { name });
  return response.data;
};

export const deletePortfolio = async (id: string) => {
  const response = await api.delete(`/api/portfolios/${id}`);
  return response.data;
};

export const getPortfolioAnalytics = async (portfolioId: string) => {
  const response = await api.get(`/api/portfolios/${portfolioId}/analytics`);
  return response.data;
};

// Portfolio Detail API endpoints
export const getPortfolioDetails = async (id: string) => {
  const response = await api.get(`/api/portfolios/${id}`);
  return response.data;
};

export const getPortfolioHoldings = async (id: string) => {
  const response = await api.get(`/api/portfolios/${id}/holdings`);
  return response.data;
};

export const addHolding = async (portfolioId: string, holding: {
  symbol: string;
  quantity: number;
  buyPrice: number;
  sector: string;
}) => {
  const response = await api.post(`/api/portfolios/${portfolioId}/holdings`, holding);
  return response.data;
};

export const deleteHolding = async (holdingId: string) => {
  const response = await api.delete(`/api/holdings/${holdingId}`);
  return response.data;
};

export const getPortfolioCAGR = async (id: string) => {
  const response = await api.get(`/api/analytics/${id}/cagr`);
  return response.data;
};

export const getSectorExposure = async (id: string) => {
  const response = await api.get(`/api/analytics/${id}/sector`);
  return response.data;
};

export const exportPortfolio = async (id: string) => {
  const response = await api.get(`/api/exports/${id}`, {
    responseType: 'blob'
  });
  return response.data;
};

export default api;