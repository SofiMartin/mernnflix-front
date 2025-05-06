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

  // Cargar animes con paginación
  const fetchAnimes = async (options = {}) => {
    try {
      setLoading(true);
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
      
      setAnimes(response.data.data);
      setTotalAnimes(response.data.pagination.total);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError('Error al cargar los animes');
      toast.error('No se pudieron cargar los animes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar animes cuando cambia el perfil
  useEffect(() => {
    if (currentProfile) {
      fetchAnimes();
    }
  }, [currentProfile]);

  const getAnimeById = async (id) => {
    try {
      return await animeService.getAnimeById(id);
    } catch (err) {
      toast.error('Error al obtener el anime');
      console.error(err);
      return null;
    }
  };

  const createAnime = async (animeData) => {
    try {
      const response = await animeService.createAnime(animeData);
      // Refrescar la lista de animes
      fetchAnimes();
      toast.success('Anime agregado con éxito');
      return response;
    } catch (err) {
      toast.error('Error al crear el anime');
      console.error(err);
      return null;
    }
  };

  const updateAnime = async (id, animeData) => {
    try {
      const response = await animeService.updateAnime(id, animeData);
      // Actualizar en el estado local
      setAnimes(animes.map(anime => anime._id === id ? response : anime));
      toast.success('Anime actualizado con éxito');
      return response;
    } catch (err) {
      toast.error('Error al actualizar el anime');
      console.error(err);
      return null;
    }
  };

  const deleteAnime = async (id) => {
    try {
      await animeService.deleteAnime(id);
      // Eliminar del estado local
      setAnimes(animes.filter(anime => anime._id !== id));
      toast.success('Anime eliminado con éxito');
      return true;
    } catch (err) {
      toast.error('Error al eliminar el anime');
      console.error(err);
      return false;
    }
  };

  // Buscar animes por término
  const searchAnimes = async (query, options = {}) => {
    try {
      setLoading(true);
      const response = await animeService.searchAnimes(query, options);
      
      setAnimes(response.data.data);
      setTotalAnimes(response.data.pagination.total);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
      
      return response.data;
    } catch (err) {
      setError('Error al buscar animes');
      toast.error('Error en la búsqueda');
      console.error(err);
      return { data: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    } finally {
      setLoading(false);
    }
  };

  // Obtener animes aleatorios
  const getRandomAnimes = async (options = {}) => {
    try {
      return await animeService.getRandomAnimes(options);
    } catch (err) {
      toast.error('Error al obtener animes aleatorios');
      console.error(err);
      return [];
    }
  };

  // Obtener todos los géneros disponibles
  const getGenres = async () => {
    try {
      return await animeService.getGenres();
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
      toast.error('Error al buscar en la API externa');
      console.error(err);
      return [];
    }
  };

  // Importar un anime desde la API externa
  const importFromExternalAPI = async (externalId) => {
    try {
      const response = await animeService.importFromExternalAPI(externalId);
      toast.success('Anime importado con éxito');
      // Refrescar la lista de animes
      fetchAnimes();
      return response;
    } catch (err) {
      toast.error('Error al importar el anime');
      console.error(err);
      return null;
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
    getGenres,
    searchExternalAPI,
    importFromExternalAPI
  };

  return (
    <AnimeContext.Provider value={value}>
      {children}
    </AnimeContext.Provider>
  );
};