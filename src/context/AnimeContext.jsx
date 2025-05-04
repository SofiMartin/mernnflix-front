import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import animeService from '../services/animeService';
import { AuthContext } from './authContext';

export const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAnimes, setTotalAnimes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastFetchOptions, setLastFetchOptions] = useState(null);

  // Cargar animes con paginación (usando useCallback para evitar regeneraciones)
  const fetchAnimes = useCallback(async (options = {}) => {
    // Comparar opciones para evitar refetch innecesarios
    const optionsString = JSON.stringify(options);
    if (lastFetchOptions === optionsString && animes.length > 0) {
      console.log("AnimeContext: Saltando fetchAnimes, mismas opciones que antes");
      return;
    }
    
    try {
      setLoading(true);
      console.log("AnimeContext: Iniciando fetchAnimes con opciones:", options);
      
      const response = await animeService.getAnimes({
        page: options.page || 1,
        limit: options.limit || 20,
        genre: options.genre || '',
        status: options.status || '',
        contentRating: options.contentRating || '',
        search: options.search || '',
        sort: options.sort || 'rating',
        order: options.order || 'desc'
      });
      
      console.log("AnimeContext: Respuesta recibida");
      
      if (response && response.data) {
        setAnimes(response.data.data || []);
        setTotalAnimes(response.data.pagination?.total || 0);
        setCurrentPage(response.data.pagination?.page || 1);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setError(null);
        // Guardar opciones para comparar más tarde
        setLastFetchOptions(optionsString);
      } else {
        console.error("Formato de respuesta inesperado:", response);
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err) {
      console.error("Error en AnimeContext.fetchAnimes:", err);
      setError('Error al cargar los animes. Por favor, inténtalo de nuevo.');
      toast.error('No se pudieron cargar los animes');
    } finally {
      setLoading(false);
    }
  }, [lastFetchOptions, animes.length]);

  // Cargar lista inicial de animes solo una vez al montar
  useEffect(() => {
    console.log("AnimeContext: Efecto de montaje inicial");
    
    // Solo cargar si no hay animes ya cargados
    if (animes.length === 0 && !lastFetchOptions) {
      console.log("AnimeContext: Cargando animes iniciales");
      fetchAnimes();
    }
  }, [fetchAnimes, animes.length, lastFetchOptions]);

  // Resto de funciones del contexto...
  const getAnimeById = async (id) => {
    try {
      const data = await animeService.getAnimeById(id);
      return data;
    } catch (err) {
      console.error(`Error al obtener anime con ID ${id}:`, err);
      toast.error('Error al obtener el anime');
      return null;
    }
  };

  const createAnime = async (animeData) => {
    try {
      setLoading(true);
      const response = await animeService.createAnime(animeData);
      // Refrescar la lista de animes, pero invalidando el cache de opciones
      setLastFetchOptions(null);
      fetchAnimes();
      toast.success('Anime agregado con éxito');
      return response;
    } catch (err) {
      console.error("Error al crear anime:", err);
      toast.error(err.message || 'Error al crear el anime');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAnime = async (id, animeData) => {
    try {
      setLoading(true);
      const response = await animeService.updateAnime(id, animeData);
      // Actualizar en el estado local
      setAnimes(animes.map(anime => 
        anime._id === id || anime.id === id ? response : anime
      ));
      toast.success('Anime actualizado con éxito');
      return response;
    } catch (err) {
      console.error(`Error al actualizar anime con ID ${id}:`, err);
      toast.error(err.message || 'Error al actualizar el anime');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAnime = async (id) => {
    try {
      setLoading(true);
      await animeService.deleteAnime(id);
      // Eliminar del estado local
      setAnimes(animes.filter(anime => 
        anime._id !== id && anime.id !== id
      ));
      toast.success('Anime eliminado con éxito');
      return true;
    } catch (err) {
      console.error(`Error al eliminar anime con ID ${id}:`, err);
      toast.error(err.message || 'Error al eliminar el anime');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar animes por término
  const searchAnimes = async (query, options = {}) => {
    try {
      setLoading(true);
      console.log(`AnimeContext: Buscando con query "${query}" y opciones:`, options);
      const response = await animeService.searchAnimes(query, options);
      
      if (response && response.data) {
        setAnimes(response.data.data || []);
        setTotalAnimes(response.data.pagination?.total || 0);
        setCurrentPage(response.data.pagination?.page || 1);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setError(null);
      } else {
        throw new Error("Formato de respuesta inesperado en búsqueda");
      }
      
      return response.data;
    } catch (err) {
      console.error("Error en AnimeContext.searchAnimes:", err);
      setError('Error en la búsqueda. Por favor, inténtalo de nuevo.');
      toast.error('Error en la búsqueda');
      return { data: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    } finally {
      setLoading(false);
    }
  };

  // Obtener animes aleatorios
  const getRandomAnimes = async (options = {}) => {
    try {
      console.log("AnimeContext: Obteniendo animes aleatorios con opciones:", options);
      const randomAnimes = await animeService.getRandomAnimes(options);
      return randomAnimes;
    } catch (err) {
      console.error("Error al obtener animes aleatorios:", err);
      toast.error('Error al obtener animes aleatorios');
      return [];
    }
  };

  // Obtener todos los géneros disponibles
  const getGenres = async () => {
    try {
      console.log("AnimeContext: Obteniendo géneros");
      return await animeService.getGenres();
    } catch (err) {
      console.error("Error al obtener géneros:", err);
      return [];
    }
  };

  const value = {
    animes,
    loading,
    error,
    totalAnimes,
    currentPage,
    totalPages,
    fetchAnimes,
    getAnimeById,
    createAnime,
    updateAnime,
    deleteAnime,
    searchAnimes,
    getRandomAnimes,
    getGenres
  };

  return (
    <AnimeContext.Provider value={value}>
      {children}
    </AnimeContext.Provider>
  );
};