  // src/lib/api.ts
  import axios from 'axios';
  import { AuthResponse, TransactionResponse, DashboardSummary } from '@/types';
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api';
  
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  export const auth = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    },
    
    register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', { email, password, name });
      return response.data;
    },
  };
  
  export const transactions = {
    getAll: async (params: any): Promise<TransactionResponse> => {
      const response = await api.get('/transactions', { params });
      return response.data;
    },
    
    getSummary: async (): Promise<DashboardSummary> => {
      const response = await api.get('/transactions/summary');
      return response.data;
    },
  };
  
  export default api;