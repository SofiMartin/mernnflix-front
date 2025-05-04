import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AnimeContext } from '../context/AnimeContext';
import { ProfileContext } from '../context/ProfileContext';
import { AuthContext } from '../context/authContext';
import WatchlistButton from '../components/WatchlistButton';
import Swal from 'sweetalert2';

const AnimeDetail = () => {
  const { id } = useParams();
  const { getAnimeById, deleteAnime } = useContext(AnimeContext);
  const { currentProfile } = useContext(ProfileContext);
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        console.log('Buscando anime con ID:', id);
        const data = await getAnimeById(id);
        console.log('Datos del anime recibidos:', data);
        setAnime(data);
      } catch (error) {
        console.error('Error al obtener el anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id, getAnimeById]);

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar "${anime?.title}"?`,
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
        const success = await deleteAnime(id);
        if (success) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El anime ha sido eliminado correctamente.',
            icon: 'success',
            iconColor: '#9333ea',
            confirmButtonColor: '#9333ea',
            background: '#111827',
            color: '#f9fafb'
          });
          navigate('/animes');
        }
      }
    });
  };

  // Verificar si el contenido es apropiado para el perfil
  const isContentAppropriate = () => {
    if (!anime || !currentProfile) return true;

    // Jerarquía de clasificaciones
    const ratingHierarchy = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
    const profileMaxRatingIndex = ratingHierarchy.indexOf(currentProfile.maxContentRating);
    const animeRatingIndex = ratingHierarchy.indexOf(anime.contentRating);
    
    return animeRatingIndex <= profileMaxRatingIndex;
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

  if (!anime) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-10 text-center max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Anime no encontrado</h3>
            <p className="text-gray-400 mb-6">
              El anime que estás buscando no existe o ha sido eliminado.
            </p>
            <Link 
              to="/animes" 
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si el contenido no es apropiado para el perfil, mostrar advertencia
  if (isAuthenticated && currentProfile && !isContentAppropriate()) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-10 text-center max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Contenido no disponible</h3>
            <p className="text-gray-300 mb-6">
              Este contenido no está disponible para perfiles infantiles debido a las restricciones de edad.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/animes" 
                className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver al catálogo
              </Link>
              <Link 
                to="/profiles" 
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Cambiar perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      {/* Hero section con imagen de fondo */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        {/* Imagen de fondo con efecto blur */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: `url(${anime.imageUrl})`,
            filter: 'brightness(0.3) saturate(1.2)',
            transform: 'scale(1.1)'
          }}
        ></div>
        
        <div className="container mx-auto px-4 h-full flex items-end">
          <div className="flex flex-col md:flex-row items-start md:items-end pb-6 relative z-10">
            {/* Imagen de portada */}
            <div className="w-32 h-48 md:w-48 md:h-72 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700 -mt-16 md:mt-0 bg-gray-800 flex-shrink-0">
              <img 
                src={anime.imageUrl} 
                alt={anime.title} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+disponible';
                  setImageLoaded(true);
                }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {/* Información básica */}
            <div className="md:ml-6 mt-4 md:mt-0 flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  anime.status === 'Finalizado' 
                    ? 'bg-blue-900/80 text-blue-200' 
                    : 'bg-green-900/80 text-green-200'
                }`}>
                  {anime.status}
                </span>
                <span className="px-3 py-1 bg-gray-700/60 text-gray-200 rounded-full text-xs">
                  {anime.releaseYear}
                </span>
                <span className="px-3 py-1 bg-purple-900/60 text-purple-200 rounded-full text-xs">
                  {anime.contentRating || 'PG-13'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{anime.title}</h1>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="text-white font-bold">{anime.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm ml-1">/ 10</span>
                </div>
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <span className="text-white">{anime.seasonCount}</span>
                  <span className="text-gray-400 text-sm ml-1">
                    {anime.seasonCount === 1 ? 'Temporada' : 'Temporadas'}
                  </span>
                </div>
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                  </svg>
                  <span className="text-white">{anime.episodeCount}</span>
                  <span className="text-gray-400 text-sm ml-1">
                    {anime.episodeCount === 1 ? 'Episodio' : 'Episodios'}
                  </span>
                </div>
              </div>
              
              <div className="hidden md:flex flex-wrap gap-2 mt-4">
                {anime.genres.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-purple-900/40 text-purple-200 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Acciones (visible solo en desktop) */}
<div className="hidden md:flex md:flex-col gap-2 ml-auto">
  {isAuthenticated && currentProfile ? (
    <>
      <WatchlistButton animeId={anime._id} />
      
      {/* Mostrar botones de editar/eliminar solo a administradores */}
      {currentUser && currentUser.isAdmin && (
        <>
          <Link 
            to={`/animes/${id}/edit`} 
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Editar
          </Link>
          <button 
            onClick={handleDelete} 
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Eliminar
          </button>
        </>
      )}
    </>
  ) : (
    <>
      <Link 
        to="/login" 
        className="px-6 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-600 transition-colors flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
        </svg>
        Iniciar sesión
      </Link>
      <Link 
        to="/register" 
        className="px-6 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
        Crear cuenta
      </Link>
    </>
  )}
</div>
          </div>
        </div>
      </div>
      
      {/* Géneros (visible solo en móvil) */}
      <div className="md:hidden container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {anime.genres.map((genre, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-purple-900/40 text-purple-200 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      
      {/* Acciones (visible solo en móvil) */}
<div className="md:hidden container mx-auto px-4 py-4">
  <div className="flex gap-2">
    {isAuthenticated && currentProfile ? (
      <>
        <WatchlistButton animeId={anime._id} />
        
        {/* Mostrar botones de editar/eliminar solo a administradores en móvil */}
        {currentUser && currentUser.isAdmin && (
          <>
            <Link 
              to={`/animes/${id}/edit`} 
              className="flex-1 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </Link>
            <button 
              onClick={handleDelete} 
              className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Eliminar
            </button>
          </>
        )}
      </>
    ) : (
      <>
        <Link 
          to="/login" 
          className="flex-1 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          Iniciar sesión
        </Link>
        <Link 
          to="/register" 
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          Crear cuenta
        </Link>
      </>
    )}
  </div>
</div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {/* Sinopsis */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {anime.synopsis}
              </p>
            </div>
            
            {/* Información de producción */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Información</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex border-b border-gray-700 pb-3">
                  <span className="text-gray-400 w-32">Estudio</span>
                  <span className="text-white font-medium">{anime.studio}</span>
                </div>
                <div className="flex border-b border-gray-700 pb-3">
                  <span className="text-gray-400 w-32">Año</span>
                  <span className="text-white font-medium">{anime.releaseYear}</span>
                </div>
                <div className="flex border-b border-gray-700 pb-3">
                  <span className="text-gray-400 w-32">Temporadas</span>
                  <span className="text-white font-medium">{anime.seasonCount}</span>
                </div>
                <div className="flex border-b border-gray-700 pb-3">
                  <span className="text-gray-400 w-32">Episodios</span>
                  <span className="text-white font-medium">{anime.episodeCount}</span>
                </div>
                <div className="flex border-b border-gray-700 pb-3">
                  <span className="text-gray-400 w-32">Estado</span>
                  <span className={`font-medium ${
                    anime.status === 'Finalizado' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {anime.status}
                  </span>
                </div>
                <div className="flex border-b border-gray-700 pb-3">
                  <span className="text-gray-400 w-32">Calificación</span>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-white font-medium">{anime.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm ml-1">/ 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna lateral */}
          <div>
            {/* Tarjeta de información */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-6">
              <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">Géneros</h3>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {anime.genres.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-purple-900/30 text-purple-200 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            {/* Navegación */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">Acciones</h3>
              </div>
              <div className="p-4">
                <Link
                  to="/animes" 
                  className="flex items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors w-full mb-2"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Volver al catálogo
                </Link>
                
                {isAuthenticated && currentUser && currentUser.isAdmin && (
                  <Link 
                    to="/animes/create" 
                    className="flex items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors w-full"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Agregar nuevo anime
                  </Link>
                )}
                
                {isAuthenticated && currentProfile && (
                  <Link 
                    to="/watchlist" 
                    className="flex items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors w-full mt-2"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Ver mi lista
                  </Link>
                )}
                
                {!isAuthenticated && (
                  <div className="mt-4 p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg text-center">
                    <p className="text-sm text-gray-300 mb-3">
                      Inicia sesión para añadir este anime a tu lista y acceder a más funciones
                    </p>
                    <div className="flex space-x-2">
                      <Link 
                        to="/login" 
                        className="flex-1 py-2 px-3 bg-purple-700 hover:bg-purple-600 text-white text-sm rounded-md transition-colors"
                      >
                        Iniciar sesión
                      </Link>
                      <Link 
                        to="/register" 
                        className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                      >
                        Registrarse
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recomendado para ti - Solo visible para usuarios autenticados */}
            {isAuthenticated && currentProfile && (
              <div className="mt-6 bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 border-b border-gray-700">
                  <h3 className="text-lg font-bold text-white">Recomendado para ti</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-4">
                    Basado en tus gustos y este anime, podrían interesarte:
                  </p>
                  <div className="space-y-3">
                    {/* Aquí podrías mostrar animes recomendados basados en géneros similares */}
                    <p className="text-gray-300 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                      </svg>
                      Explora más animes del género {anime.genres[0]}
                    </p>
                    <p className="text-gray-300 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                      </svg>
                      Más animes del estudio {anime.studio}
                    </p>
                    <p className="text-gray-300 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                      </svg>
                      Animes del año {anime.releaseYear}
                    </p>
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

export default AnimeDetail;