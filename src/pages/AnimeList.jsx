import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AnimeContext } from '../context/AnimeContext';
import { AuthContext } from '../context/authContext'; 
import { ProfileContext } from '../context/ProfileContext'; 
import AnimeCard from '../components/AnimeCard';
import WatchlistButton from '../components/WatchlistButton';
import Pagination from '../components/Pagination';  
import { useTheme } from '../context/ThemeContext';

const AnimeList = () => {
  const { animes, loading, error, fetchAnimes } = useContext(AnimeContext);
  const { isDarkMode } = useTheme();
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const { currentProfile } = useContext(ProfileContext);
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const allGenres = [...new Set(animes.flatMap(anime => anime.genres || []))].sort();
  
  useEffect(() => {
    setCurrentPage(1); // Resetear a la primera página cuando cambien los filtros
    
    const loadAnimesWithFilters = async () => {
      if (animes.length === 0) {
        await fetchAnimes();
      }
      
      let result = [...animes];
      
      if (currentProfile) {
        if (currentProfile.type === 'kid') {
          result = result.filter(anime => 
            anime.contentRating === 'G' || anime.contentRating === 'PG'
          );
        } else if (currentProfile.type === 'teen') {
          result = result.filter(anime => 
            anime.contentRating === 'G' || 
            anime.contentRating === 'PG' || 
            anime.contentRating === 'PG-13'
          );
        }
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(anime => 
          (anime.title && anime.title.toLowerCase().includes(term)) || 
          (anime.synopsis && anime.synopsis.toLowerCase().includes(term))
        );
      }
      
      if (selectedGenre) {
        result = result.filter(anime => 
          anime.genres && anime.genres.includes(selectedGenre)
        );
      }
      
      if (selectedStatus) {
        result = result.filter(anime => 
          anime.status === selectedStatus
        );
      }
      
      result.sort((a, b) => {
        if (sortBy === 'rating') {
          return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        } else if (sortBy === 'title') {
          return sortOrder === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        } else if (sortBy === 'year') {
          return sortOrder === 'asc' 
            ? a.releaseYear - b.releaseYear 
            : b.releaseYear - a.releaseYear;
        }
        return 0;
      });
      
      setFilteredAnimes(result);
    };
    
    loadAnimesWithFilters();
  }, [animes, currentProfile, searchTerm, selectedGenre, selectedStatus, sortBy, sortOrder, fetchAnimes]);
  
  // Cálculos para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnimes = filteredAnimes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAnimes.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };
  
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedStatus('');
    setSortBy('rating');
    setSortOrder('desc');
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-24 px-4`}>
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>Cargando animes...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-24 px-4`}>
        <div className="container mx-auto">
          <div className={`${isDarkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-100 border-red-300'} border rounded-lg p-6 max-w-xl mx-auto`}>
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Error</h2>
            </div>
            <p className={`${isDarkMode ? 'text-red-200' : 'text-red-800'} mb-4`}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-24 pb-16`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 md:mb-0`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Explorar Animes
            </span>
          </h1>
          
          {currentUser && currentUser.isAdmin && (
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/animes/create" 
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Agregar Anime
              </Link>
              
              <Link 
                to="/animes/import" 
                className="px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Importar Anime
              </Link>
            </div>
          )}
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 mb-8 border`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`pl-10 pr-4 py-2 w-full ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                } border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              />
            </div>
            
            <div>
              <select
                value={selectedGenre}
                onChange={handleGenreChange}
                className={`w-full py-2 px-4 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                } border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="${isDarkMode ? 'white' : 'black'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat" }}
              >
                <option value="">Todos los géneros</option>
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className={`w-full py-2 px-4 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                } border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="${isDarkMode ? 'white' : 'black'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat" }}
              >
                <option value="">Todos los estados</option>
                <option value="En emisión">En emisión</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
            
            <div className="flex">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className={`w-full py-2 px-4 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                } border rounded-l-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="${isDarkMode ? 'white' : 'black'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat" }}
              >
                <option value="rating">Calificación</option>
                <option value="title">Título</option>
                <option value="year">Año</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className={`px-4 py-2 ${
                  isDarkMode ? 'bg-purple-700 border-purple-600' : 'bg-purple-600 border-purple-500'
                } border rounded-r-lg text-white transition-colors hover:${
                  isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                }`}
                aria-label={sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('grid')}
                className={`p-2 rounded-md ${
                  currentView === 'grid' 
                    ? 'bg-purple-700 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label="Vista de cuadrícula"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`p-2 rounded-md ${
                  currentView === 'list' 
                    ? 'bg-purple-700 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label="Vista de lista"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            
            <button
              onClick={clearFilters}
              className={`px-4 py-2 ${
                isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } rounded-lg transition-colors flex items-center`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>
        
        {filteredAnimes.length === 0 ? (
          <div className={`${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'
          } border rounded-xl p-10 text-center`}>
            <svg className={`w-16 h-16 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No se encontraron resultados</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Intenta con diferentes criterios o limpia los filtros para ver todos los animes.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Mostrando <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAnimes.length)}</span> de{' '}
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{filteredAnimes.length}</span> {filteredAnimes.length === 1 ? 'anime' : 'animes'}
              </p>
            </div>
            
            {currentView === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentAnimes.map(anime => (
                  <AnimeCard key={anime.id || anime._id} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentAnimes.map(anime => (
                  <div key={anime.id || anime._id} className={`flex ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
                  } border rounded-lg overflow-hidden transition-colors`}>
                    <div className="w-24 md:w-36 flex-shrink-0">
                      <img 
                        src={anime.imageUrl} 
                        alt={anime.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x450?text=No+disponible';
                        }}
                      />
                    </div>
                    <div className="flex-grow p-4">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{anime.title}</h3>
                        <div className="flex items-center bg-black/30 text-yellow-400 px-2 py-1 rounded text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {anime.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 my-2">
                        {anime.genres && anime.genres.map((genre, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-purple-900/40 text-purple-200 text-xs rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm line-clamp-2 mb-2`}>{anime.synopsis}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-400">
                          <span className={anime.status === 'Finalizado' ? 'text-blue-400' : 'text-green-400'}>
                            {anime.status}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{anime.releaseYear}</span>
                          {anime.studio && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{anime.studio}</span>
                            </>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {isAuthenticated && currentProfile && (
                            <WatchlistButton animeId={anime.id || anime._id} size="small" iconOnly={true} />
                          )}
                          <Link 
                            to={`/animes/${anime.id || anime._id}`} 
                            className={`px-4 py-1 ${
                              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                            } ${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm rounded transition-colors`}
                          >
                            Detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AnimeList;