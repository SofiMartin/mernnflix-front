import axiosInstance from './axiosConfig';

class ProfileService {
  // Obtener todos los perfiles del usuario
  async getProfiles() {
    try {
      const response = await axiosInstance.get('/profiles');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener perfiles' };
    }
  }
  
  // Obtener un perfil específico
  async getProfile(id) {
    try {
      const response = await axiosInstance.get(`/profiles/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el perfil' };
    }
  }
  
  // Crear un nuevo perfil
  async createProfile(profileData) {
    try {
      const response = await axiosInstance.post('/profiles', profileData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el perfil' };
    }
  }
  
  // Actualizar un perfil existente
  async updateProfile(id, profileData) {
    try {
      const response = await axiosInstance.put(`/profiles/${id}`, profileData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el perfil' };
    }
  }
  
  // Eliminar un perfil
  async deleteProfile(id) {
    try {
      const response = await axiosInstance.delete(`/profiles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el perfil' };
    }
  }
  
  // Cambiar el tipo de un perfil (adulto, adolescente, niño)
  async changeProfileType(id, type) {
    try {
      const response = await axiosInstance.patch(`/profiles/${id}/type`, { type });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al cambiar el tipo de perfil' };
    }
  }
  
  // Establecer el perfil actual
  setCurrentProfile(profileId) {
    localStorage.setItem('currentProfileId', profileId);
    return true;
  }
  
  // Obtener el ID del perfil actual
  getCurrentProfileId() {
    return localStorage.getItem('currentProfileId');
  }
  
  // Limpiar el perfil actual
  clearCurrentProfile() {
    localStorage.removeItem('currentProfileId');
    return true;
  }
}

export default new ProfileService();