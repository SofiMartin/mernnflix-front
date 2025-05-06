import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import animeService from '../services/animeService';
import { ProfileContext } from './ProfileContext';

export const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const { currentProfile } = useContext(ProfileContext);
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAnimes, setTotalAnimes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({
    page: 1,
    limit: 20,
    genre: '',
    status: '',
    contentRating: '',
    search: '',
    sort: 'rating',
    order: 'desc'
  });

  // Cargar animes con paginación y filtros
  const fetchAnimes = async (options = {}) => {
    try {
      setLoading(true);
      
      // Combinar filtros actuales con nuevas opciones
      const newFilters = {...currentFilters, ...options};
      setCurrentFilters(newFilters);
      
      const response = await animeService.getAnimes(newFilters);
      
      setAnimes(response.data.data);
      setTotalAnimes(response.data.pagination.total);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.message || 'Error al cargar los animes';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error en fetchAnimes:', err);
      return { data: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    } finally {
      setLoading(false);
    }
  };

  // Cargar animes cuando cambia el perfil
  useEffect(() => {
    if (currentProfile) {
      // Ajustar filtros según el tipo de perfil
      let contentFilter = '';
      if (currentProfile.type === 'kid') {
        contentFilter = 'G,PG';
      } else if (currentProfile.type === 'teen') {
        contentFilter = 'G,PG,PG-13';
      }
      
      // Actualizar filtros y cargar animes
      fetchAnimes({
        contentRating: contentFilter,
        page: 1 // Reiniciar a la primera página
      });
    }
  }, [currentProfile]);

  const getAnimeById = async (id) => {
    try {
      const response = await animeService.getAnimeById(id);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener el anime';
      toast.error(errorMessage);
      console.error('Error en getAnimeById:', err);
      return null;
    }
  };

  const createAnime = async (animeData) => {
    try {
      const response = await animeService.createAnime(animeData);
      // Refrescar la lista de animes
      fetchAnimes(currentFilters);
      toast.success('Anime agregado con éxito');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al crear el anime';
      toast.error(errorMessage);
      console.error('Error en createAnime:', err);
      return null;
    }
  };

  const updateAnime = async (id, animeData) => {
    try {
      const response = await animeService.updateAnime(id, animeData);
      // Actualizar en el estado local
      setAnimes(prevAnimes => 
        prevAnimes.map(anime => 
          (anime._id === id || anime.id === id) ? response : anime
        )
      );
      toast.success('Anime actualizado con éxito');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar el anime';
      toast.error(errorMessage);
      console.error('Error en updateAnime:', err);
      return null;
    }
  };

  const deleteAnime = async (id) => {
    try {
      await animeService.deleteAnime(id);
      // Eliminar del estado local
      setAnimes(prevAnimes => 
        prevAnimes.filter(anime => 
          anime._id !== id && anime.id !== id
        )
      );
      // Actualizar conteo total
      setTotalAnimes(prevTotal => prevTotal - 1);
      
      toast.success('Anime eliminado con éxito');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Error al eliminar el anime';
      toast.error(errorMessage);
      console.error('Error en deleteAnime:', err);
      return false;
    }
  };

  // Buscar animes por término
  const searchAnimes = async (query, options = {}) => {
    try {
      setLoading(true);
      
      // Combinar con filtros actuales
      const searchOptions = {
        ...currentFilters,
        search: query,
        page: 1, // Reiniciar a la primera página
        ...options
      };
      
      setCurrentFilters(searchOptions);
      
      const response = await animeService.searchAnimes(query, searchOptions);
      
      setAnimes(response.data);
      setTotalAnimes(response.pagination.total);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setError(null);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error en la búsqueda';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error en searchAnimes:', err);
      return { data: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    } finally {
      setLoading(false);
    }
  };

  // Obtener animes aleatorios
  const getRandomAnimes = async (options = {}) => {
    try {
      const response = await animeService.getRandomAnimes(options);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al obtener animes aleatorios';
      toast.error(errorMessage);
      console.error('Error en getRandomAnimes:', err);
      return [];
    }
  };

  // Obtener todos los géneros disponibles
  const getGenres = async () => {
    try {
      const response = await animeService.getGenres();
      return response;
    } catch (err) {
      console.error('Error al obtener géneros:', err);
      return [];
    }
  };

  // Buscar animes en la API externa
  const searchExternalAPI = async (title) => {
    try {
      const response = await animeService.searchExternalAPI(title);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al buscar en la API externa';
      toast.error(errorMessage);
      console.error('Error en searchExternalAPI:', err);
      return [];
    }
  };

  // Importar un anime desde la API externa
  const importFromExternalAPI = async (externalId) => {
    try {
      const response = await animeService.importFromExternalAPI(externalId);
      toast.success('Anime importado con éxito');
      // Refrescar la lista de animes
      fetchAnimes(currentFilters);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al importar el anime';
      toast.error(errorMessage);
      console.error('Error en importFromExternalAPI:', err);
      return null;
    }
  };

  // Limpiar filtros y reiniciar todo
  const clearFilters = async () => {
    const defaultFilters = {
      page: 1,
      limit: 20,
      genre: '',
      status: '',
      contentRating: '',
      search: '',
      sort: 'rating',
      order: 'desc'
    };
    
    // Ajustar filtros según el tipo de perfil
    if (currentProfile) {
      if (currentProfile.type === 'kid') {
        defaultFilters.contentRating = 'G,PG';
      } else if (currentProfile.type === 'teen') {
        defaultFilters.contentRating = 'G,PG,PG-13';
      }
    }
    
    setCurrentFilters(defaultFilters);
    await fetchAnimes(defaultFilters);
  };

  const value = {
    animes,
    loading,
    error,
    totalAnimes,
    currentPage,
    totalPages,
    currentFilters,
    fetchAnimes,
    getAnimeById,
    createAnime,
    updateAnime,
    deleteAnime,
    searchAnimes,
    getRandomAnimes,
    getGenres,
    searchExternalAPI,
    importFromExternalAPI,
    clearFilters
  };

  return (
    <AnimeContext.Provider value={value}>
      {children}
    </AnimeContext.Provider>
  );
};