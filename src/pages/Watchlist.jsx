import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { WatchlistContext } from '../context/watchlistContext';
import { ProfileContext } from '../context/ProfileContext';
import Swal from 'sweetalert2';

const WatchlistPage = () => {
  const { watchlist, favorites, stats, loading, removeFromWatchlist, toggleFavorite, updateWatchlistEntry } = useContext(WatchlistContext);
  const { currentProfile } = useContext(ProfileContext);
  
  const [activeTab, setActiveTab] = useState('all');
  const [filteredList, setFilteredList] = useState([]);
  
  // Filtrar la lista según la pestaña activa
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredList(watchlist);
    } else if (activeTab === 'favorites') {
      setFilteredList(favorites);
    } else {
      // Filtrar por estado (watching, completed, etc.)
      setFilteredList(watchlist.filter(item => item.status === activeTab));
    }
  }, [watchlist, favorites, activeTab]);
  
  // Manejar cambio de estado de un anime
  const handleChangeStatus = async (entry, newStatus) => {
    try {
      await updateWatchlistEntry(entry._id, { status: newStatus });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };
  
  // Manejar eliminación de un anime de la watchlist
  const handleRemove = (entry) => {
    Swal.fire({
      title: '¿Eliminar de la lista?',
      text: `¿Estás seguro de eliminar "${entry.anime.title}" de tu lista?`,
      icon: 'warning',
      iconColor: '#9333ea',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#1f2937',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#111827',
      color: '#f9fafb'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeFromWatchlist(entry._id);
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El anime ha sido eliminado de tu lista.',
            icon: 'success',
            iconColor: '#9333ea',
            confirmButtonColor: '#9333ea',
            background: '#111827',
            color: '#f9fafb'
          });
        } catch (error) {
          console.error('Error al eliminar:', error);
        }
      }
    });
  };
  
  // Manejar marcar/desmarcar como favorito
  const handleToggleFavorite = async (entry) => {
    try {
      await toggleFavorite(entry._id, !entry.isFavorite);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Determinar el nombre del estado para visualización
  const getStatusName = (status) => {
    switch (status) {
      case 'plan_to_watch': return 'Por ver';
      case 'watching': return 'Viendo';
      case 'completed': return 'Completado';
      case 'dropped': return 'Abandonado';
      default: return status;
    }
  };
  
  // Obtener el color de badge según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'plan_to_watch': return 'bg-blue-900/60 text-blue-200';
      case 'watching': return 'bg-green-900/60 text-green-200';
      case 'completed': return 'bg-purple-900/60 text-purple-200';
      case 'dropped': return 'bg-gray-700/60 text-gray-300';
      default: return 'bg-gray-800/60 text-gray-300';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">Mi Lista</h1>
            {currentProfile && (
              <p className="text-gray-400">
                Perfil: <span className="text-white">{currentProfile.name}</span>
              </p>
            )}
          </div>
          
          {/* Estadísticas */}
          {stats && (
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-gray-800/80 rounded-lg flex flex-col items-center shadow-md">
                <span className="text-lg font-bold text-white">{stats.total}</span>
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <div className="px-4 py-2 bg-yellow-900/20 border border-yellow-800/30 rounded-lg flex flex-col items-center shadow-md">
                <span className="text-lg font-bold text-yellow-400">{stats.favorites}</span>
                <span className="text-xs text-gray-400">Favoritos</span>
              </div>
              <div className="px-4 py-2 bg-green-900/20 border border-green-800/30 rounded-lg flex flex-col items-center shadow-md">
                <span className="text-lg font-bold text-green-400">{stats.watching}</span>
                <span className="text-xs text-gray-400">Viendo</span>
              </div>
              <div className="px-4 py-2 bg-purple-900/20 border border-purple-800/30 rounded-lg flex flex-col items-center shadow-md">
                <span className="text-lg font-bold text-purple-400">{stats.completed}</span>
                <span className="text-xs text-gray-400">Completados</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Tabs de filtrado */}
        <div className="mb-6 border-b border-gray-800">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`mr-2 inline-block py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'text-purple-500 border-purple-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('all')}
            >
              Todos
            </button>
            <button
              className={`mr-2 inline-block py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'favorites'
                  ? 'text-yellow-400 border-yellow-400'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              Favoritos
            </button>
            <button
              className={`mr-2 inline-block py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'watching'
                  ? 'text-green-400 border-green-400'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('watching')}
            >
              Viendo
            </button>
            <button
              className={`mr-2 inline-block py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'text-purple-400 border-purple-400'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completados
            </button>
            <button
              className={`mr-2 inline-block py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'plan_to_watch'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('plan_to_watch')}
            >
              Por ver
            </button>
            <button
              className={`mr-2 inline-block py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'dropped'
                  ? 'text-gray-400 border-gray-400'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('dropped')}
            >
              Abandonados
            </button>
          </div>
        </div>
        
        {/* Lista de animes */}
        {filteredList.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-10 text-center shadow-lg">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No hay animes en esta lista</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'all' 
                ? "Aún no has agregado animes a tu watchlist" 
                : activeTab === 'favorites'
                  ? "No tienes animes marcados como favoritos"
                  : `No tienes animes con estado "${getStatusName(activeTab)}"`
              }
            </p>
            <Link 
              to="/animes" 
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Explorar animes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map(entry => (
              <div key={entry._id} className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors shadow-md">
                <div className="w-24 md:w-36 flex-shrink-0">
                  <img 
                    src={entry.anime.imageUrl} 
                    alt={entry.anime.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+disponible';
                    }}
                  />
                </div>
                <div className="flex-grow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <h3 className="text-lg font-bold text-white">{entry.anime.title}</h3>
                      {entry.isFavorite && (
                        <svg className="w-5 h-5 text-yellow-400 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm ${getStatusColor(entry.status)}`}>
                        {getStatusName(entry.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 my-2">
                    {entry.anime.genres && entry.anime.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-400">
                      {entry.anime.releaseYear && <span className="mr-2">{entry.anime.releaseYear}</span>}
                      {entry.anime.studio && <span>{entry.anime.studio}</span>}
                    </div>
                    
                    {/* Controles */}
                    <div className="flex space-x-2">
                      {/* Selector de estado */}
                      <select
                        value={entry.status}
                        onChange={(e) => handleChangeStatus(entry, e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="plan_to_watch">Por ver</option>
                        <option value="watching">Viendo</option>
                        <option value="completed">Completado</option>
                        <option value="dropped">Abandonado</option>
                      </select>
                      
                      {/* Botón de favorito */}
                      <button
                        onClick={() => handleToggleFavorite(entry)}
                        className={`p-1 rounded-full ${
                          entry.isFavorite 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-gray-700 text-gray-400 hover:text-yellow-400'
                        }`}
                        aria-label={entry.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                      
                      {/* Botón de eliminar */}
                      <button
                        onClick={() => handleRemove(entry)}
                        className="p-1 bg-gray-700 text-gray-400 hover:text-red-400 rounded-full"
                        aria-label="Eliminar de la lista"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      
                      {/* Enlace de detalles */}
                      <Link
                        to={`/animes/${entry.anime._id}`}
                        className="p-1 bg-gray-700 text-gray-400 hover:text-white rounded-full"
                        aria-label="Ver detalles"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;