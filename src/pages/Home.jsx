import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AnimeContext } from '../context/AnimeContext';

const Home = () => {
  const { animes } = useContext(AnimeContext);
  const [featuredAnimes, setFeaturedAnimes] = useState([]);
  
  useEffect(() => {
    // Seleccionar 5 animes aleatorios con rating alto para destacar
    if (animes.length > 0) {
      const highRatedAnimes = animes
        .filter(anime => anime.rating >= 8.5)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      
      setFeaturedAnimes(highRatedAnimes);
    }
  }, [animes]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section con parallax */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('https://wallpaperaccess.com/full/5932634.jpg')",
              backgroundAttachment: "fixed",
              filter: "brightness(0.4)"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            ANIMEVERSE
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Descubre, colecciona y comparte tus animes favoritos en una experiencia inmersiva.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link 
              to="/animes" 
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Explorar Animes
            </Link>
            <Link 
              to="/animes/create" 
              className="px-8 py-3 rounded-full bg-transparent border-2 border-purple-500 text-white font-medium hover:bg-purple-900/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              Agregar Nuevo
            </Link>
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
      
      {/* Trending Anime Section */}
      <div className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Destacados
              </span>
            </h2>
            <Link 
              to="/animes" 
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center"
            >
              Ver Todo
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {featuredAnimes.map(anime => (
              <Link 
                key={anime.id} 
                to={`/animes/${anime.id}`}
                className="group block relative rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
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
                      {anime.genres.slice(0, 2).map((genre, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-1 bg-purple-900/80 text-purple-200 rounded-full backdrop-blur-sm"
                        >
                          {genre}
                        </span>
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-800/80 text-gray-200 rounded-full backdrop-blur-sm">
                          +{anime.genres.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Tu experiencia anime
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-center hover:bg-gray-800 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Gestión completa</h3>
              <p className="text-gray-400">Organiza tu colección personal con un sistema CRUD intuitivo y potente.</p>
            </div>
            
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-center hover:bg-gray-800 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Información detallada</h3>
              <p className="text-gray-400">Explora datos completos sobre cada anime, desde sinopsis hasta estadísticas.</p>
            </div>
            
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-center hover:bg-gray-800 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-16 0V5a2 2 0 012-2h12a2 2 0 012 2v2m-16 0h16M7 11h2m-2 4h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Personalización total</h3>
              <p className="text-gray-400">Añade tus propios animes y actualiza la información según tus preferencias.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-t border-purple-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Explora nuestra extensa colección de animes o contribuye agregando tus series favoritas a nuestra base de datos.
          </p>
          <Link 
            to="/animes" 
            className="px-8 py-3 rounded-full bg-white text-purple-900 font-bold hover:bg-purple-100 transform hover:-translate-y-1 transition-all duration-300"
          >
            Comenzar Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;