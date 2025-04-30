import axiosInstance from './axiosConfig';

class WatchlistService {
  // Añadir anime a la watchlist
  async addToWatchlist(profileId, animeId, options = {}) {
    try {
      const data = {
        profileId,
        animeId,
        ...options
      };
      
      const response = await axiosInstance.post('/watchlists', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al añadir anime a la watchlist' };
    }
  }
  
  // Obtener watchlist de un perfil
  async getWatchlist(profileId, options = {}) {
    try {
      const { status, page = 1, limit = 20, sort } = options;
      
      let url = `/watchlists/${profileId}?page=${page}&limit=${limit}`;
      
      if (status) {
        url += `&status=${status}`;
      }
      
      if (sort) {
        url += `&sort=${JSON.stringify(sort)}`;
      }
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener la watchlist' };
    }
  }
  
  // Actualizar una entrada de la watchlist
  async updateWatchlistEntry(entryId, profileId, updateData) {
    try {
      const data = {
        profileId,
        ...updateData
      };
      
      const response = await axiosInstance.put(`/watchlists/${entryId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar la entrada de watchlist' };
    }
  }
  
  // Eliminar una entrada de la watchlist
  async removeFromWatchlist(entryId, profileId) {
    try {
      const response = await axiosInstance.delete(`/watchlists/${entryId}`, {
        data: { profileId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar de la watchlist' };
    }
  }
  
  // Eliminar un anime de la watchlist por ID de perfil y anime
  async removeAnimeFromWatchlist(profileId, animeId) {
    try {
      const response = await axiosInstance.delete(`/watchlists/${profileId}/anime/${animeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar anime de la watchlist' };
    }
  }
  
  // Marcar/desmarcar un anime como favorito
  async toggleFavorite(entryId, profileId, isFavorite) {
    try {
      const response = await axiosInstance.patch(`/watchlists/${entryId}/favorite`, {
        profileId,
        isFavorite
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al cambiar estado de favorito' };
    }
  }
  
  // Obtener favoritos de un perfil
  async getFavorites(profileId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      
      const url = `/watchlists/profile/${profileId}/favorites?page=${page}&limit=${limit}`;
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener favoritos' };
    }
  }
  
  // Verificar si un anime está en la watchlist
  async isInWatchlist(profileId, animeId) {
    try {
      const response = await axiosInstance.get(`/watchlists/${profileId}/anime/${animeId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error.response?.data || { message: 'Error al verificar watchlist' };
    }
  }
  
  // Obtener estadísticas de la watchlist
  async getWatchlistStats(profileId) {
    try {
      const response = await axiosInstance.get(`/watchlists/${profileId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener estadísticas' };
    }
  }
}

export default new WatchlistService();