import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import watchlistService from '../services/watchlistService';
import { ProfileContext } from './ProfileContext';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { currentProfile } = useContext(ProfileContext);
  
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar watchlist cuando cambia el perfil
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!currentProfile) {
        setWatchlist([]);
        setFavorites([]);
        setStats(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const profileId = currentProfile._id;
        
        // Cargar watchlist
        const watchlistResponse = await watchlistService.getWatchlist(profileId);
        setWatchlist(watchlistResponse.data || []);
        
        // Cargar favoritos
        const favoritesResponse = await watchlistService.getFavorites(profileId);
        setFavorites(favoritesResponse.data || []);
        
        // Cargar estadísticas
        const statsResponse = await watchlistService.getWatchlistStats(profileId);
        setStats(statsResponse);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar watchlist:', err);
        setError(err.message || 'Error al cargar la watchlist');
        toast.error('Error al cargar datos de watchlist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchlist();
  }, [currentProfile]);
  
  // Verificar si un anime está en la watchlist
  const isInWatchlist = async (animeId) => {
    if (!currentProfile) return false;
    
    try {
      const result = await watchlistService.isInWatchlist(currentProfile._id, animeId);
      return result;
    } catch {
      return false;
    }
  };
  
  // Añadir anime a la watchlist
  const addToWatchlist = async (animeId, options = {}) => {
    if (!currentProfile) {
      toast.error('Debes seleccionar un perfil primero');
      return null;
    }
    
    try {
      setLoading(true);
      const result = await watchlistService.addToWatchlist(currentProfile._id, animeId, options);
      
      // Actualizar el estado
      await refreshWatchlist();
      
      toast.success('Añadido a tu watchlist');
      return result;
    } catch (err) {
      setError(err.message || 'Error al añadir a watchlist');
      toast.error(err.message || 'Error al añadir a watchlist');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Actualizar entrada de watchlist
  const updateWatchlistEntry = async (entryId, updateData) => {
    if (!currentProfile) {
      toast.error('Debes seleccionar un perfil primero');
      return null;
    }
    
    try {
      setLoading(true);
      const result = await watchlistService.updateWatchlistEntry(entryId, currentProfile._id, updateData);
      
      // Actualizar el estado
      await refreshWatchlist();
      
      toast.success('Watchlist actualizada');
      return result;
    } catch (err) {
      setError(err.message || 'Error al actualizar watchlist');
      toast.error(err.message || 'Error al actualizar watchlist');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar anime de la watchlist
  const removeFromWatchlist = async (entryId) => {
    if (!currentProfile) {
      toast.error('Debes seleccionar un perfil primero');
      return false;
    }
    
    try {
      setLoading(true);
      await watchlistService.removeFromWatchlist(entryId, currentProfile._id);
      
      // Actualizar el estado
      await refreshWatchlist();
      
      toast.success('Eliminado de tu watchlist');
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar de watchlist');
      toast.error(err.message || 'Error al eliminar de watchlist');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar anime de la watchlist usando IDs
  const removeAnimeFromWatchlist = async (animeId) => {
    if (!currentProfile) {
      toast.error('Debes seleccionar un perfil primero');
      return false;
    }
    
    try {
      setLoading(true);
      await watchlistService.removeAnimeFromWatchlist(currentProfile._id, animeId);
      
      // Actualizar el estado
      await refreshWatchlist();
      
      toast.success('Eliminado de tu watchlist');
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar de watchlist');
      toast.error(err.message || 'Error al eliminar de watchlist');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Marcar/desmarcar como favorito
  const toggleFavorite = async (entryId, isFavorite) => {
    if (!currentProfile) {
      toast.error('Debes seleccionar un perfil primero');
      return null;
    }
    
    try {
      setLoading(true);
      const result = await watchlistService.toggleFavorite(entryId, currentProfile._id, isFavorite);
      
      // Actualizar el estado
      await refreshWatchlist();
      
      toast.success(isFavorite ? 'Añadido a favoritos' : 'Eliminado de favoritos');
      return result;
    } catch (err) {
      setError(err.message || 'Error al actualizar favoritos');
      toast.error(err.message || 'Error al actualizar favoritos');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Refrescar datos de watchlist
  const refreshWatchlist = async () => {
    if (!currentProfile) return;
    
    try {
      const profileId = currentProfile._id;
      
      // Cargar watchlist
      const watchlistResponse = await watchlistService.getWatchlist(profileId);
      setWatchlist(watchlistResponse.data || []);
      
      // Cargar favoritos
      const favoritesResponse = await watchlistService.getFavorites(profileId);
      setFavorites(favoritesResponse.data || []);
      
      // Cargar estadísticas
      const statsResponse = await watchlistService.getWatchlistStats(profileId);
      setStats(statsResponse);
    } catch (err) {
      console.error('Error al refrescar watchlist:', err);
    }
  };
  
  const value = {
    watchlist,
    favorites,
    stats,
    loading,
    error,
    isInWatchlist,
    addToWatchlist,
    updateWatchlistEntry,
    removeFromWatchlist,
    removeAnimeFromWatchlist,
    toggleFavorite,
    refreshWatchlist
  };
  
  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};