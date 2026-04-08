import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Prefixo definido no backend
});

// Interceptor para injetar o Token em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
  
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
  
      if (!error.config.url.includes('/login') && !error.config.url.includes('/register')) {
      alert('Sua sessão expirou. Por favor, faça login novamente.'); 
  
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; 
      }
    }
  }
    return Promise.reject(error);
  }
);

export default api;