import axios from 'axios';

// Creamos una instancia de axios con la URL base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api';

// Creamos un servicio de autenticación
class AuthService {
  // Método para iniciar sesión
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error en el servidor' };
    }
  }

  // Método para registrarse
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error en el servidor' };
    }
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('user');
  }

  // Método para refrescar el token
  async refreshToken() {
    try {
      const user = this.getCurrentUser();
      if (!user || !user.token) {
        throw new Error('No hay usuario o token');
      }
      
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        token: user.token
      });
      
      if (response.data.data.token) {
        // Actualizar el token en el localStorage
        const updatedUser = { ...user, token: response.data.data.token };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      return null;
    } catch (error) {
      // Si hay error en el refresh, deslogueamos al usuario
      this.logout();
      throw error.response?.data || { message: 'Error al refrescar token' };
    }
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }
}

export default new AuthService();