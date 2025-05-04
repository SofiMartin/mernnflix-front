import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AnimeContext } from '../context/AnimeContext';
import { AuthContext } from '../context/authContext';

const Home = () => {
  const { animes, getRandomAnimes } = useContext(AnimeContext);
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [trendingAnimes, setTrendingAnimes] = useState([]);
  const [heroBackdrop, setHeroBackdrop] = useState('');
  const [featuredAnimes, setFeaturedAnimes] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Para obtener animes en tendencia ordenados por rating
    const fetchTrendingAnimes = async () => {
      setLoading(true);
      try {
        // Obtener animes aleatorios con alto rating
        if (animes.length > 0) {
          const highRatedAnimes = animes
            .filter(anime => anime.rating >= 8.0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
          
          setTrendingAnimes(highRatedAnimes);
          
          // Seleccionar un anime aleatorio para el hero backdrop
          if (highRatedAnimes.length > 0) {
            const randomIndex = Math.floor(Math.random() * highRatedAnimes.length);
            setHeroBackdrop(highRatedAnimes[randomIndex].imageUrl);
          }
        } else {
          // Si no hay animes cargados, intentar obtener de forma aleatoria
          const randomAnimes = await getRandomAnimes({ count: 6 });
          setTrendingAnimes(randomAnimes || []);
          
          if (randomAnimes && randomAnimes.length > 0) {
            setHeroBackdrop(randomAnimes[0].imageUrl);
          }
        }
        
        // Obtener animes para las otras secciones
        if (animes.length > 0) {
          // Destacados: animes con buenas calificaciones
          const featured = animes
            .filter(anime => anime.rating >= 7.5)
            .sort(() => 0.5 - Math.random())
            .slice(0, 8);
          setFeaturedAnimes(featured);
          
          // Nuevos lanzamientos: ordenados por año de lanzamiento descendente
          const newAnimes = [...animes]
            .sort((a, b) => b.releaseYear - a.releaseYear)
            .slice(0, 8);
          setNewReleases(newAnimes);
        }
      } catch (error) {
        console.error('Error al obtener animes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingAnimes();
  }, [animes, getRandomAnimes]);
  
  // Componente para mostrar un anime en la sección de tendencias
  const TrendingAnimeCard = ({ anime }) => (
    <Link 
      to={`/animes/${anime.id}`}
      className="group flex-shrink-0 w-64 md:w-72 overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
    >
      <div className="relative h-96">
        <img 
          src={anime.imageUrl} 
          alt={anime.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450?text=Imagen+no+disponible';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              {anime.rating.toFixed(1)}
            </div>
            <div className="px-2 py-1 bg-gray-900/60 text-gray-300 rounded text-xs">
              {anime.releaseYear}
            </div>
            <div className={`px-2 py-1 rounded text-xs text-white ${
              anime.status === 'Finalizado' 
                ? 'bg-blue-900/60' 
                : 'bg-green-900/60'
            }`}>
              {anime.status}
            </div>
          </div>
          <h3 className="text-white font-bold text-lg tracking-wide group-hover:text-purple-300 transition-colors">
            {anime.title}
          </h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres && anime.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-purple-900/50 text-purple-200 rounded-full backdrop-blur-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
  
  // Componente para mostrar un anime en grilla 
  const AnimeGridCard = ({ anime }) => (
    <Link 
      to={`/animes/${anime.id}`}
      className="group block relative rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[3/4] bg-gray-800 relative">
        <img 
          src={anime.imageUrl} 
          alt={anime.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450?text=Imagen+no+disponible';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute top-2 right-2 bg-black/70 text-yellow-500 font-bold px-2 py-1 rounded text-sm backdrop-blur-sm">
          {anime.rating.toFixed(1)}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold mb-1 truncate">{anime.title}</h3>
            <div className="flex flex-wrap gap-1">
              {anime.genres && anime.genres.slice(0, 2).map((genre, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-1 bg-purple-900/80 text-purple-200 rounded-full backdrop-blur-sm"
                >
                  {genre}
                </span>
              ))}
              {anime.genres && anime.genres.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-800/80 text-gray-200 rounded-full backdrop-blur-sm">
                  +{anime.genres.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
    </Link>
  );
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${heroBackdrop || 'https://wallpaperaccess.com/full/5932634.jpg'}')`,
              filter: "brightness(0.3)"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-gray-900/70"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              ANIMEVERSE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Descubre, colecciona y comparte tus animes favoritos en una experiencia inmersiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/animes" 
                className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Explorar Animes
              </Link>
              {!isAuthenticated ? (
                <Link 
                  to="/register" 
                  className="px-8 py-3 rounded-full bg-transparent border-2 border-purple-500 text-white font-medium hover:bg-purple-900/30 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Crear Cuenta
                </Link>
              ) : (
                <Link 
                  to="/watchlist" 
                  className="px-8 py-3 rounded-full bg-transparent border-2 border-purple-500 text-white font-medium hover:bg-purple-900/30 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Mi Lista
                </Link>
              )}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Trending Anime Section */}
      <div className="py-16 bg-gray-900 relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent z-10"></div>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                En Tendencia
              </span>
            </h2>
            <Link 
              to="/animes" 
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center group"
            >
              Ver Todo
              <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          {/* Trending Scroll Container */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-6">
              {trendingAnimes.length > 0 ? (
                trendingAnimes.map(anime => (
                  <TrendingAnimeCard key={anime.id} anime={anime} />
                ))
              ) : (
                <div className="w-full py-12 text-center text-gray-500">
                  <p>No hay animes en tendencia para mostrar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Anime Section */}
      <div className="py-16 bg-gradient-to-b from-gray-900 to-gray-900/90">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Destacados
              </span>
            </h2>
            <Link 
              to="/animes" 
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center group"
            >
              Ver Todo
              <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredAnimes.length > 0 ? (
              featuredAnimes.slice(0, 10).map(anime => (
                <AnimeGridCard key={anime.id} anime={anime} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p>No hay animes destacados para mostrar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* New Releases Section */}
      <div className="py-16 bg-gradient-to-b from-gray-900/90 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Nuevos Lanzamientos
              </span>
            </h2>
            <Link 
              to="/animes" 
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center group"
            >
              Ver Todo
              <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {newReleases.length > 0 ? (
              newReleases.slice(0, 5).map(anime => (
                <AnimeGridCard key={anime.id} anime={anime} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p>No hay nuevos lanzamientos para mostrar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Únete a la comunidad</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Crea tu cuenta ahora para guardar tus animes favoritos, personalizar tu experiencia y mucho más.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-all"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="px-8 py-3 rounded-full bg-white text-purple-900 font-bold hover:bg-purple-100 transition-all"
              >
                Crear Cuenta
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/profiles" 
                className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-all"
              >
                Gestionar Perfiles
              </Link>
              {currentUser && currentUser.isAdmin ? (
                <Link 
                  to="/animes/create" 
                  className="px-8 py-3 rounded-full bg-white text-purple-900 font-bold hover:bg-purple-100 transition-all"
                >
                  Añadir Anime
                </Link>
              ) : (
                <Link 
                  to="/animes" 
                  className="px-8 py-3 rounded-full bg-white text-purple-900 font-bold hover:bg-purple-100 transition-all"
                >
                  Explorar Animes
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section - para usuarios no logueados */}
      {!isAuthenticated && (
        <div className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Características principales
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-center hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Colección completa</h3>
                <p className="text-gray-400">Organiza y explora una amplia colección de animes con información detallada.</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-center hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Perfiles personalizados</h3>
                <p className="text-gray-400">Crea perfiles personalizados con restricciones de edad para toda la familia.</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-center hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Listas personalizadas</h3>
                <p className="text-gray-400">Crea tu watchlist personal con animes para ver, en progreso y completados.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;