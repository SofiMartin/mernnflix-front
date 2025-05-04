import axiosInstance from './axiosConfig';

class AnimeService {
  // Obtener todos los animes con filtros y paginación
  async getAnimes(options = {}) {
    try {
      console.log("AnimeService.getAnimes llamado con opciones:", options);
      
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
      
      console.log("URL de petición:", url);
      
      const response = await axiosInstance.get(url);
      console.log("Respuesta completa recibida");
      
      return response;
    } catch (error) {
      console.error("Error en AnimeService.getAnimes:", error);
      // Mostrar detalles del error para depuración
      if (error.response) {
        console.error("Detalles del error - status:", error.response.status);
        console.error("Detalles del error - data:", error.response.data);
      } else if (error.request) {
        console.error("Detalles del error - request:", error.request);
      } else {
        console.error("Mensaje de error:", error.message);
      }
      throw error.response?.data || { message: 'Error al obtener animes' };
    }
  }
  
  // Obtener un anime por su ID
  async getAnimeById(id) {
    try {
      console.log(`Obteniendo anime con ID: ${id}`);
      const response = await axiosInstance.get(`/animes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener anime con ID ${id}:`, error);
      throw error.response?.data || { message: 'Error al obtener el anime' };
    }
  }
  
  // Crear un nuevo anime
  async createAnime(animeData) {
    try {
      console.log("Creando nuevo anime:", animeData);
      const response = await axiosInstance.post('/animes', animeData);
      return response.data.data;
    } catch (error) {
      console.error("Error al crear anime:", error);
      throw error.response?.data || { message: 'Error al crear el anime' };
    }
  }
  
  // Actualizar un anime existente
  async updateAnime(id, animeData) {
    try {
      console.log(`Actualizando anime con ID ${id}:`, animeData);
      const response = await axiosInstance.put(`/animes/${id}`, animeData);
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar anime con ID ${id}:`, error);
      throw error.response?.data || { message: 'Error al actualizar el anime' };
    }
  }
  
  // Eliminar un anime
  async deleteAnime(id) {
    try {
      console.log(`Eliminando anime con ID: ${id}`);
      const response = await axiosInstance.delete(`/animes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar anime con ID ${id}:`, error);
      throw error.response?.data || { message: 'Error al eliminar el anime' };
    }
  }
  
  // Buscar animes por término
  async searchAnimes(query, options = {}) {
    try {
      console.log(`Buscando animes con query: "${query}"`, options);
      const { page = 1, limit = 20 } = options;
      
      const url = `/animes/search?q=${query}&page=${page}&limit=${limit}`;
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al buscar animes:", error);
      throw error.response?.data || { message: 'Error al buscar animes' };
    }
  }
  
  // Obtener animes aleatorios
  async getRandomAnimes(options = {}) {
    try {
      console.log("Obteniendo animes aleatorios:", options);
      const { genre, contentRating, count = 5 } = options;
      
      let url = `/animes/random?count=${count}`;
      
      if (genre) url += `&genre=${genre}`;
      if (contentRating) url += `&contentRating=${contentRating}`;
      
      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener animes aleatorios:", error);
      throw error.response?.data || { message: 'Error al obtener animes aleatorios' };
    }
  }
  
  // Obtener todos los géneros disponibles
  async getGenres() {
    try {
      console.log("Obteniendo géneros disponibles");
      const response = await axiosInstance.get('/animes/genres');
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener géneros:", error);
      throw error.response?.data || { message: 'Error al obtener géneros' };
    }
  }
  
  // Buscar animes en una API externa
  async searchExternalAPI(title) {
    try {
      console.log(`Buscando en API externa con título: "${title}"`);
      const response = await axiosInstance.get(`/animes/external/search?title=${title}`);
      return response.data.data;
    } catch (error) {
      console.error("Error al buscar en API externa:", error);
      throw error.response?.data || { message: 'Error al buscar en API externa' };
    }
  }
  
  // Importar un anime desde una API externa
  async importFromExternalAPI(externalId) {
    try {
      console.log(`Importando anime desde API externa con ID: ${externalId}`);
      const response = await axiosInstance.post('/animes/external/import', { externalId });
      return response.data.data;
    } catch (error) {
      console.error("Error al importar anime:", error);
      throw error.response?.data || { message: 'Error al importar anime' };
    }
  }
}

export default new AnimeService();