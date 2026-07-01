import axios from 'axios';

// Create customized Axios instance pointing to the Express server API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

// Attach Authorization Bearer token to all outgoing requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('efcg_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Response Interceptor to intercept 401, 403, and 500 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Token has expired or is invalid, redirect to login page
        localStorage.removeItem('efcg_token');
        localStorage.removeItem('efcg_user');
        
        // Prevent redirect loop if already on login or landing
        const path = window.location.pathname;
        if (path !== '/' && path !== '/login') {
          window.location.href = '/login?expired=true';
        }
      } else if (status === 403) {
        // Access forbidden (e.g. non-admin accessing administration pages)
        console.warn('Access Forbidden: 403');
      } else if (status === 500) {
        // Server crashed
        console.error('Server side error encountered (500):', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
