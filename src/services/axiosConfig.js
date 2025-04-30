import axios from 'axios';
import authService from './authService';

// Configuración base de Axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      
      // Añadir profileId al header si existe en localStorage
      const currentProfileId = localStorage.getItem('currentProfileId');
      if (currentProfileId) {
        config.headers.profileid = currentProfileId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (Unauthorized) y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const success = await authService.refreshToken();
        
        if (success) {
          // Si se refrescó correctamente, obtener el nuevo usuario
          const user = authService.getCurrentUser();
          // Actualizar el token en la petición original
          originalRequest.headers.Authorization = `Bearer ${user.token}`;
          // Reintentar la petición
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Si falla el refresh, redirigir al login
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;