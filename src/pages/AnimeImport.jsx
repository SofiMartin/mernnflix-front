import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimeContext } from '../context/AnimeContext';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const AnimeImport = () => {
  const { searchExternalAPI, importFromExternalAPI } = useContext(AnimeContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error('Ingresa un término de búsqueda');
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchExternalAPI(searchTerm);
      setSearchResults(results || []);
      
      if (results.length === 0) {
        toast.info('No se encontraron resultados para esta búsqueda');
      }
    } catch (error) {
      console.error('Error al buscar animes:', error);
      toast.error('Error al buscar en la API externa');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleImport = async (externalId) => {
    if (!externalId) return;
    
    setIsImporting(true);
    
    try {
      const importedAnime = await importFromExternalAPI(externalId);
      toast.success('¡Anime importado con éxito!');
      navigate(`/animes/${importedAnime.id || importedAnime._id}`);
    } catch (error) {
      console.error('Error al importar anime:', error);
      toast.error('Error al importar el anime');
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleSelectAnime = (anime) => {
    setSelectedAnime(anime);
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-24 pb-16`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Importar Anime desde API Externa
              </span>
            </h1>
            <Link 
              to="/animes" 
              className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } rounded-lg transition-colors flex items-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al catálogo
            </Link>
          </div>
          
          {/* Formulario de búsqueda */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 mb-8 border`}>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Busca un anime para importar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-3 w-full ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                  isSearching 
                    ? 'bg-purple-800 text-purple-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                } transition-all duration-300`}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Buscar
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Resultados de búsqueda o detalle del anime seleccionado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lista de resultados */}
            <div className={`md:col-span-${selectedAnime ? '1' : '3'}`}>
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border h-full`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Resultados de búsqueda</h2>
                
                {isSearching ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-6`}>
                    {searchTerm ? 'No se encontraron resultados' : 'Busca un anime para importar'}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {searchResults.map((anime) => (
                      <div 
                        key={anime.externalId} 
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                          selectedAnime?.externalId === anime.externalId
                            ? 'bg-purple-900/30 border-purple-800'
                            : isDarkMode 
                              ? 'hover:bg-gray-700/50 border-gray-700' 
                              : 'hover:bg-gray-100 border-gray-200'
                        }`}
                        onClick={() => handleSelectAnime(anime)}
                      >
                        <div className={`w-16 h-20 flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded overflow-hidden`}>
                          <img 
                            src={anime.imageUrl} 
                            alt={anime.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/160x200?text=No+disponible';
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium line-clamp-1`}>{anime.title}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {anime.genres.slice(0, 2).map((genre, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-0.5 bg-purple-900/40 text-purple-200 text-xs rounded-full"
                              >
                                {genre}
                              </span>
                            ))}
                            {anime.genres.length > 2 && (
                              <span className={`px-2 py-0.5 ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                              } text-xs rounded-full`}>
                                +{anime.genres.length - 2}
                              </span>
                            )}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            {anime.releaseYear} • {anime.episodeCount} episodios
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Detalle del anime seleccionado */}
            {selectedAnime && (
              <div className="md:col-span-2">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border h-full`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagen */}
                    <div className="w-full md:w-40 flex-shrink-0">
                      <div className={`aspect-[3/4] rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <img 
                          src={selectedAnime.imageUrl} 
                          alt={selectedAnime.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x600?text=No+disponible';
                          }}
                        />
                      </div>
                      
                      <button
                        onClick={() => handleImport(selectedAnime.externalId)}
                        disabled={isImporting}
                        className={`w-full mt-4 px-4 py-3 rounded-lg font-medium flex items-center justify-center ${
                          isImporting 
                            ? 'bg-purple-800 text-purple-200 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                        } transition-all duration-300`}
                      >
                        {isImporting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Importando...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                            Importar Anime
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Información */}
                    <div className="flex-grow">
                      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{selectedAnime.title}</h2>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          selectedAnime.status === 'Finalizado' 
                            ? 'bg-blue-900/80 text-blue-200' 
                            : 'bg-green-900/80 text-green-200'
                        }`}>
                          {selectedAnime.status}
                        </span>
                        <span className={`px-2 py-1 ${
                          isDarkMode ? 'bg-gray-700/60 text-gray-200' : 'bg-gray-200 text-gray-700'
                        } rounded-full text-xs`}>
                          {selectedAnime.releaseYear}
                        </span>
                        <span className="px-2 py-1 bg-purple-900/60 text-purple-200 rounded-full text-xs">
                          {selectedAnime.contentRating || 'PG-13'}
                        </span>
                        <span className="px-2 py-1 bg-yellow-900/60 text-yellow-200 rounded-full text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {selectedAnime.rating.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedAnime.genres.map((genre, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-purple-900/40 text-purple-200 text-xs rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mb-4">
                        <div className={`flex justify-between text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } mb-2`}>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            <span>{selectedAnime.seasonCount} {selectedAnime.seasonCount === 1 ? 'Temporada' : 'Temporadas'}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                            </svg>
                            <span>{selectedAnime.episodeCount} {selectedAnime.episodeCount === 1 ? 'Episodio' : 'Episodios'}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <span>{selectedAnime.studio}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-200'} rounded-lg p-4 border`}>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Sinopsis</h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                          {selectedAnime.synopsis || 'No hay sinopsis disponible para este anime.'}
                        </p>
                      </div>
                      
                      <div className={`mt-4 ${
                        isDarkMode 
                          ? 'bg-green-900/20 border-green-800/30' 
                          : 'bg-green-100 border-green-200'
                      } rounded-lg p-4 border`}>
                        <h3 className={`text-sm font-semibold ${
                          isDarkMode ? 'text-green-400' : 'text-green-700'
                        } mb-2`}>ID Externo</h3>
                        <div className={`${
                          isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                        } px-3 py-2 rounded text-xs font-mono break-all`}>
                          {selectedAnime.externalId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeImport;