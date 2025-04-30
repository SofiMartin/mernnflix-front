import axiosInstance from './axiosConfig';

class AnimeService {
  // Obtener todos los animes con filtros y paginación
  async getAnimes(options = {}) {
    try {
      const {
        genre,
        status,
        contentRating,
        search,
        sort = 'rating',
        order = 'desc',
        page = 1,
        limit = 20
      } = options;
      
      let url = `/animes?sort=${sort}&order=${order}&page=${page}&limit=${limit}`;
      
      if (genre) url += `&genre=${genre}`;
      if (status) url += `&status=${status}`;
      if (contentRating) url += `&contentRating=${contentRating}`;
      if (search) url += `&search=${search}`;
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener animes' };
    }
  }
  
  // Obtener un anime por su ID
  async getAnimeById(id) {
    try {
      const response = await axiosInstance.get(`/animes/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el anime' };
    }
  }
  
  // Crear un nuevo anime
  async createAnime(animeData) {
    try {
      const response = await axiosInstance.post('/animes', animeData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el anime' };
    }
  }
  
  // Actualizar un anime existente
  async updateAnime(id, animeData) {
    try {
      const response = await axiosInstance.put(`/animes/${id}`, animeData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el anime' };
    }
  }
  
  // Eliminar un anime
  async deleteAnime(id) {
    try {
      const response = await axiosInstance.delete(`/animes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el anime' };
    }
  }
  
  // Buscar animes por término
  async searchAnimes(query, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      
      const url = `/animes/search?q=${query}&page=${page}&limit=${limit}`;
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al buscar animes' };
    }
  }
  
  // Obtener animes aleatorios
  async getRandomAnimes(options = {}) {
    try {
      const { genre, contentRating, count = 5 } = options;
      
      let url = `/animes/random?count=${count}`;
      
      if (genre) url += `&genre=${genre}`;
      if (contentRating) url += `&contentRating=${contentRating}`;
      
      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener animes aleatorios' };
    }
  }
  
  // Obtener todos los géneros disponibles
  async getGenres() {
    try {
      const response = await axiosInstance.get('/animes/genres');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener géneros' };
    }
  }
  
  // Buscar animes en una API externa
  async searchExternalAPI(title) {
    try {
      const response = await axiosInstance.get(`/animes/external/search?title=${title}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al buscar en API externa' };
    }
  }
  
  // Importar un anime desde una API externa
  async importFromExternalAPI(externalId) {
    try {
      const response = await axiosInstance.post('/animes/external/import', { externalId });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al importar anime' };
    }
  }
}

export default new AnimeService();