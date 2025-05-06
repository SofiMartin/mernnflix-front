import { Link } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { AnimeContext } from '../context/AnimeContext';
import { AuthContext } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { animes, getRandomAnimes } = useContext(AnimeContext);
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [trendingAnimes, setTrendingAnimes] = useState([]);
  const [heroAnimes, setHeroAnimes] = useState([]);
  const [featuredAnimes, setFeaturedAnimes] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for scroll animations
  const trendingSectionRef = useRef(null);
  const featuredSectionRef = useRef(null);
  const newReleasesSectionRef = useRef(null);
  
  useEffect(() => {
    // Fetch all anime data
    const fetchAnimeData = async () => {
      setLoading(true);
      try {
        if (animes.length > 0) {
          // For hero carousel - select top 5 highest rated animes
          const topRatedForHero = animes
            .filter(anime => anime.rating >= 8.5)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
          
          setHeroAnimes(topRatedForHero);
          
          // For trending section - high rated animes
          const highRatedAnimes = animes
            .filter(anime => anime.rating >= 8.0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
          
          setTrendingAnimes(highRatedAnimes);
          
          // Featured animes - good ratings with some randomization
          const featured = animes
            .filter(anime => anime.rating >= 7.5)
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
          setFeaturedAnimes(featured);
          
          // New releases - latest by year
          const newAnimes = [...animes]
            .sort((a, b) => b.releaseYear - a.releaseYear)
            .slice(0, 10);
          setNewReleases(newAnimes);
        } else {
          // If no animes loaded, get random ones
          const randomAnimes = await getRandomAnimes({ count: 6 });
          setTrendingAnimes(randomAnimes || []);
          setHeroAnimes(randomAnimes?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnimeData();
    
    // Setup intersection observers for scroll animations
    const setupScrollObservers = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };
      
      const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      };
      
      const observer = new IntersectionObserver(handleIntersection, observerOptions);
      
      if (trendingSectionRef.current) observer.observe(trendingSectionRef.current);
      if (featuredSectionRef.current) observer.observe(featuredSectionRef.current);
      if (newReleasesSectionRef.current) observer.observe(newReleasesSectionRef.current);
      
      return () => observer.disconnect();
    };
    
    // Delay observer setup slightly to ensure refs are populated
    const timer = setTimeout(setupScrollObservers, 500);
    return () => clearTimeout(timer);
  }, [animes, getRandomAnimes]);
  
  // Hero carousel auto-rotation
  useEffect(() => {
    if (heroAnimes.length === 0) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentHeroIndex(prevIndex => (prevIndex + 1) % heroAnimes.length);
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }, 500);
    }, 6000); // Change hero every 6 seconds
    
    return () => clearInterval(interval);
  }, [heroAnimes]);
  
  // Hero carousel component
  const HeroCarousel = () => {
    if (!heroAnimes.length) return null;
    
    const currentAnime = heroAnimes[currentHeroIndex];
    
    return (
      <div className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            style={{ 
              backgroundImage: `url('${currentAnime?.imageUrl || 'https://wallpaperaccess.com/full/5932634.jpg'}')`,
              filter: isDarkMode ? "brightness(0.2)" : "brightness(0.3)"
            }}
          ></div>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/80' : 'bg-gradient-to-t from-gray-900 via-gray-900/40 to-gray-900/80'}`}></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className={`max-w-3xl transition-all duration-1000 ${isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-1 bg-indigo-500"></div>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-purple-400'} uppercase tracking-wider`}>
                Destacado {currentHeroIndex + 1}/{heroAnimes.length}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-2 leading-tight">
              {currentAnime?.title || "ANIMEVERSE"}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {currentAnime?.genres && currentAnime.genres.slice(0, 4).map((genre, index) => (
                <span 
                  key={index} 
                  className={`text-xs px-3 py-1 ${isDarkMode ? 'bg-indigo-900/80 text-indigo-200' : 'bg-purple-900/80 text-purple-200'} rounded-full`}
                >
                  {genre}
                </span>
              ))}
              
              {currentAnime && (
                <span className="text-xs px-3 py-1 bg-amber-600/80 text-amber-100 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {currentAnime.rating?.toFixed(1)}
                </span>
              )}
            </div>
            
            <p className={`text-xl md:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-300'} mb-8 line-clamp-3`}>
              {currentAnime?.synopsis || "Descubre, colecciona y comparte tus animes favoritos en una experiencia inmersiva."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {currentAnime && (
                <Link 
                  to={`/animes/${currentAnime.id}`} 
                  className={`px-8 py-3 rounded-full ${isDarkMode 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'} 
                    text-white font-medium hover:shadow-lg ${isDarkMode 
                      ? 'hover:shadow-indigo-500/20' 
                      : 'hover:shadow-purple-500/20'} 
                    transform hover:-translate-y-1 transition-all duration-300 flex items-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                  </svg>
                  Ver Detalles
                </Link>
              )}
              
              {!isAuthenticated ? (
                <Link 
                  to="/register" 
                  className={`px-8 py-3 rounded-full bg-transparent border-2 ${isDarkMode 
                    ? 'border-indigo-500 hover:bg-indigo-900/30' 
                    : 'border-purple-500 hover:bg-purple-900/30'} 
                    text-white font-medium transform hover:-translate-y-1 transition-all duration-300`}
                >
                  Crear Cuenta
                </Link>
              ) : (
                <Link 
                  to="/watchlist" 
                  className={`px-8 py-3 rounded-full bg-transparent border-2 ${isDarkMode 
                    ? 'border-indigo-500 hover:bg-indigo-900/30' 
                    : 'border-purple-500 hover:bg-purple-900/30'} 
                    text-white font-medium transform hover:-translate-y-1 transition-all duration-300 flex items-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                  Mi Lista
                </Link>
              )}
            </div>
          </div>
          
          {/* Hero carousel indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroAnimes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentHeroIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }, 500);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentHeroIndex 
                    ? `${isDarkMode ? 'bg-indigo-500' : 'bg-purple-500'} w-6` 
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Trending Anime Card Component with animation
  const TrendingAnimeCard = ({ anime, index }) => (
    <Link 
      to={`/animes/${anime.id}`}
      className="group flex-shrink-0 w-64 md:w-72 overflow-hidden rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="relative h-96">
        <img 
          src={anime.imageUrl} 
          alt={anime.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450?text=Imagen+no+disponible';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center`}>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              {anime.rating.toFixed(1)}
            </div>
            <div className={`px-2 py-1 ${isDarkMode ? 'bg-gray-800/60' : 'bg-gray-900/60'} text-gray-300 rounded text-xs`}>
              {anime.releaseYear}
            </div>
            <div className={`px-2 py-1 rounded text-xs text-white ${
              anime.status === 'Finalizado' 
                ? `${isDarkMode ? 'bg-blue-800/60' : 'bg-blue-900/60'}` 
                : `${isDarkMode ? 'bg-green-800/60' : 'bg-green-900/60'}`
            }`}>
              {anime.status}
            </div>
          </div>
          <h3 className={`text-white font-bold text-lg tracking-wide group-hover:${isDarkMode ? 'text-indigo-300' : 'text-purple-300'} transition-colors`}>
            {anime.title}
          </h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres && anime.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 ${isDarkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-purple-900/50 text-purple-200'} rounded-full backdrop-blur-sm`}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
  
  // Grid Card Component with animation
  const AnimeGridCard = ({ anime, index }) => (
    <Link 
      to={`/animes/${anime.id}`}
      className="group block relative rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`aspect-[3/4] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} relative`}>
        <img 
          src={anime.imageUrl} 
          alt={anime.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450?text=Imagen+no+disponible';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute top-2 right-2 bg-black/70 text-amber-500 font-bold px-2 py-1 rounded text-sm backdrop-blur-sm">
          {anime.rating.toFixed(1)}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className={`text-white font-bold mb-1 truncate group-hover:${isDarkMode ? 'text-indigo-300' : 'text-purple-300'} transition-colors`}>{anime.title}</h3>
          <div className="flex flex-wrap gap-1">
            {anime.genres && anime.genres.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 ${isDarkMode ? 'bg-indigo-900/80 text-indigo-200' : 'bg-purple-900/80 text-purple-200'} rounded-full backdrop-blur-sm`}
              >
                {genre}
              </span>
            ))}
            {anime.genres && anime.genres.length > 2 && (
              <span className={`text-xs px-2 py-1 ${isDarkMode ? 'bg-gray-900/80' : 'bg-gray-800/80'} text-gray-200 rounded-full backdrop-blur-sm`}>
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
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'} flex items-center justify-center`}>
        <div className="relative">
          <div className={`w-16 h-16 border-4 ${isDarkMode ? 'border-indigo-600' : 'border-purple-600'} border-t-transparent rounded-full animate-spin`}></div>
          <div className={`w-16 h-16 border-4 ${isDarkMode ? 'border-violet-500' : 'border-pink-500'} border-b-transparent rounded-full animate-spin absolute top-0 left-0`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className={`${isDarkMode ? 'text-indigo-300' : 'text-purple-300'} ml-4 text-lg`}>Cargando tu experiencia anime...</p>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'} text-white overflow-hidden`}>
      {/* Hero Carousel Section */}
      <HeroCarousel />
      
      {/* Add a key visual section - a common element on anime sites */}
      <div className={`py-8 bg-gradient-to-b ${isDarkMode ? 'from-gray-950 to-gray-900' : 'from-gray-900 to-gray-800'} relative`}>
        <div className="container mx-auto px-4">
          <div className="rounded-xl overflow-hidden relative shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-indigo-900/80 via-violet-900/40' : 'from-purple-900/80 via-pink-900/40'} to-transparent z-10`}></div>
            <img 
              src={heroAnimes[0]?.imageUrl || "https://wallpaperaccess.com/full/5932634.jpg"} 
              alt="Key visual" 
              className="w-full h-40 md:h-64 object-cover object-center"
            />
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-20">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                ANIMEVERSE
              </h2>
              <p className="text-white/90 text-sm md:text-base max-w-md">
                Temporada Primavera 2025: Nuevos animes cada semana
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trending Anime Section */}
      <div 
        ref={trendingSectionRef} 
        className={`py-16 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'} relative opacity-0 transition-opacity duration-1000`}
      >
        <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${isDarkMode ? 'from-gray-900' : 'from-gray-800'} to-transparent z-10`}></div>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center">
              <span className={`w-1 h-8 ${isDarkMode ? 'bg-indigo-500' : 'bg-red-500'} mr-3`}></span>
              <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
                En Tendencia
              </span>
            </h2>
            <Link 
              to="/animes" 
              className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-400 hover:text-purple-300'} font-medium flex items-center group`}
            >
              Ver Todo
              <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          {/* Auto-scrolling Trending anime container */}
          <div className="overflow-x-auto pb-6 -mx-4 px-4">
            <div className="flex space-x-6">
              {trendingAnimes.length > 0 ? (
                trendingAnimes.map((anime, index) => (
                  <TrendingAnimeCard key={anime.id} anime={anime} index={index} />
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
      <div 
        ref={featuredSectionRef}
        className={`py-16 bg-gradient-to-b ${isDarkMode ? 'from-gray-950 to-gray-950/90' : 'from-gray-900 to-gray-900/90'} opacity-0 transition-opacity duration-1000`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center">
              <span className={`w-1 h-8 ${isDarkMode ? 'bg-indigo-500' : 'bg-purple-500'} mr-3`}></span>
              <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
                Destacados
              </span>
            </h2>
            <Link 
              to="/animes" 
              className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-400 hover:text-purple-300'} font-medium flex items-center group`}
            >
              Ver Todo
              <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredAnimes.length > 0 ? (
              featuredAnimes.slice(0, 10).map((anime, index) => (
                <AnimeGridCard key={anime.id} anime={anime} index={index} />
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
      <div 
        ref={newReleasesSectionRef}
        className={`py-16 bg-gradient-to-b ${isDarkMode ? 'from-gray-950/90 to-gray-950' : 'from-gray-900/90 to-gray-900'} opacity-0 transition-opacity duration-1000`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center">
              <span className={`w-1 h-8 ${isDarkMode ? 'bg-violet-500' : 'bg-pink-500'} mr-3`}></span>
              <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
                Nuevos Lanzamientos
              </span>
            </h2>
            <Link 
              to="/animes" 
              className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-400 hover:text-purple-300'} font-medium flex items-center group`}
            >
              Ver Todo
              <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {newReleases.length > 0 ? (
              newReleases.map((anime, index) => (
                <AnimeGridCard key={anime.id} anime={anime} index={index} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p>No hay nuevos lanzamientos para mostrar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
       {/* Seasonal Chart - New professional section */}
       <div className={`py-16 bg-gradient-to-r ${isDarkMode ? 'from-indigo-900/20 to-violet-900/20' : 'from-purple-900/20 to-pink-900/20'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
                Calendario de Temporada
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Mantente al día con los estrenos semanales y nunca te pierdas un episodio de tus series favoritas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => (
              <div key={index} className={`p-4 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-800/50'} rounded-lg backdrop-blur-sm ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-800'} transition-colors`}>
                <h3 className={`text-lg font-bold text-center mb-3 ${isDarkMode ? 'text-indigo-300' : 'text-purple-300'}`}>{day}</h3>
                <div className="space-y-3">
                  {(index === 0 || index === 5 || index === 6) && trendingAnimes.length > 0 ? (
                    trendingAnimes.slice(0, 2).map((anime, animeIndex) => (
                      <Link key={animeIndex} to={`/animes/${anime.id}`} className={`flex items-center p-2 ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-700/50'} rounded transition-colors`}>
                        <img 
                          src={anime.imageUrl} 
                          alt={anime.title} 
                          className="w-10 h-10 object-cover rounded-full mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{anime.title}</p>
                          <p className="text-xs text-gray-400">EP. {Math.floor(Math.random() * 12) + 1} • {(Math.floor(Math.random() * 12) + 12)}:00</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">No hay estrenos</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/schedule" 
              className={`inline-flex items-center px-6 py-3 rounded-full ${isDarkMode ? 'bg-indigo-900/50 hover:bg-indigo-900/80' : 'bg-purple-900/50 hover:bg-purple-900/80'} text-white transition-colors`}
            >
              Ver calendario completo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* CTA Section with professional animation */}
      <div className={`py-20 bg-gradient-to-r ${isDarkMode ? 'from-indigo-900/30 via-violet-900/30 to-indigo-900/30' : 'from-purple-900/30 via-pink-900/30 to-purple-900/30'} relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-20 -left-20 w-64 h-64 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-purple-500/10'} rounded-full blur-3xl animate-blob`}></div>
          <div className={`absolute top-40 -right-20 w-80 h-80 ${isDarkMode ? 'bg-violet-500/10' : 'bg-pink-500/10'} rounded-full blur-3xl animate-blob`} style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
          <div className={`absolute bottom-10 left-1/4 w-72 h-72 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/10'} rounded-full blur-3xl animate-blob`} style={{ animationDelay: '4s', animationDuration: '12s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Únete a la comunidad de anime</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Crea tu cuenta ahora para guardar tus animes favoritos, recibir recomendaciones personalizadas y conectar con otros fans.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-white/5 transform hover:-translate-y-1"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="px-8 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
              >
                Crear Cuenta Gratis
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/profiles" 
                className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-white/5 transform hover:-translate-y-1"
              >
                Gestionar Perfiles
              </Link>
              {currentUser && currentUser.isAdmin ? (
                <Link 
                  to="/animes/create" 
                  className="px-8 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
                >
                  Añadir Anime
                </Link>
              ) : (
                <Link 
                  to="/animes" 
                  className="px-8 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
                >
                  Explorar Animes
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section with modern design */}
      {!isAuthenticated && (
        <div className={`py-16 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
                Una experiencia completamente inmersiva
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-800/50'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-800' : 'border-gray-700'} text-center ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-800'} transition-colors transform hover:-translate-y-2 duration-300 hover:shadow-xl ${isDarkMode ? 'hover:shadow-indigo-500/5' : 'hover:shadow-purple-500/5'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-indigo-900/30' : 'bg-purple-900/30'} flex items-center justify-center`}>
                  <svg className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-indigo-300' : 'text-purple-300'}`}>Colección Completa</h3>
                <p className="text-gray-400 mb-4">Explora nuestra extensa biblioteca con información detallada sobre cada título, desde clásicos hasta los estrenos más recientes.</p>
                <Link to="/animes" className={`inline-flex items-center ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-400 hover:text-purple-300'}`}>
                  Explorar catálogo
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
              
              {/* Feature 2 */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-800/50'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-800' : 'border-gray-700'} text-center ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-800'} transition-colors transform hover:-translate-y-2 duration-300 hover:shadow-xl ${isDarkMode ? 'hover:shadow-indigo-500/5' : 'hover:shadow-purple-500/5'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-indigo-900/30' : 'bg-purple-900/30'} flex items-center justify-center`}>
                  <svg className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-indigo-300' : 'text-purple-300'}`}>Perfiles Personalizados</h3>
                <p className="text-gray-400 mb-4">Crea perfiles para cada miembro de la familia con control parental y recomendaciones adaptadas a cada edad y gusto.</p>
                <Link to="/register" className={`inline-flex items-center ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-400 hover:text-purple-300'}`}>
                  Crear perfil
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
              
              {/* Feature 3 */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-800/50'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-800' : 'border-gray-700'} text-center ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-800'} transition-colors transform hover:-translate-y-2 duration-300 hover:shadow-xl ${isDarkMode ? 'hover:shadow-indigo-500/5' : 'hover:shadow-purple-500/5'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-indigo-900/30' : 'bg-purple-900/30'} flex items-center justify-center`}>
                  <svg className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-indigo-300' : 'text-purple-300'}`}>Listas Personalizadas</h3>
                <p className="text-gray-400 mb-4">Organiza tus animes en categorías como "Vistos", "En progreso" o "Pendientes" y lleva un seguimiento de tus favoritos.</p>
                <Link to="/register" className={`inline-flex items-center ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-400 hover:text-purple-300'}`}>
                  Crear mi lista
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* App Promo Section */}
      <div className={`py-20 bg-gradient-to-b ${isDarkMode ? 'from-gray-950 to-gray-900' : 'from-gray-900 to-gray-800'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
                  Lleva tu anime a todas partes
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Descarga nuestra aplicación móvil para disfrutar de tu colección de anime en cualquier lugar. Recibe notificaciones de nuevos episodios y mantén sincronizado tu progreso.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <a href="#" className={`block p-1 bg-gradient-to-r ${isDarkMode ? 'from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600' : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} rounded-xl transition-all transform hover:-translate-y-1 duration-300`}>
                  <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'} px-5 py-2 rounded-lg flex items-center space-x-2`}>
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5640023,0 L6.43599772,0 C6.43599772,0 0,0 0,6.43599772 L0,17.5640023 C0,17.5640023 0,24 6.43599772,24 L17.5640023,24 C17.5640023,24 24,24 24,17.5640023 L24,6.43599772 C24,6.43599772 24,0 17.5640023,0 Z M5.12931442,7.5 L8.37597284,7.5 L8.37597284,16.875 L5.12931442,16.875 L5.12931442,7.5 Z M6.75264363,6.11801547 C5.74250442,6.11801547 4.92527926,5.30152803 4.92527926,4.29426094 C4.92527926,3.28699386 5.74250442,2.47050642 6.75264363,2.47050642 C7.76278284,2.47050642 8.580008,3.28699386 8.580008,4.29426094 C8.580008,5.30152803 7.76206356,6.11801547 6.75264363,6.11801547 Z M18.2261384,16.875 L14.9802516,16.875 L14.9802516,12.42174 C14.9802516,10.5724547 14.2649812,10.1255587 13.3497301,10.1255587 C12.3980732,10.1255587 11.4628414,10.7746587 11.4628414,12.5 L11.4628414,16.875 L8.21618296,16.875 L8.21618296,7.5 L11.3335693,7.5 L11.3335693,8.86425781 C11.3335693,8.86425781 12.2967239,7.29296875 14.2235316,7.29296875 C16.150339,7.29296875 18.2268577,8.33789062 18.2268577,11.25 L18.2261384,16.875 Z" />
                    </svg>
                    <div>
                      <div className="text-xs text-gray-400">Disponible en</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </div>
                </a>
                
                <a href="#" className={`block p-1 bg-gradient-to-r ${isDarkMode ? 'from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600' : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} rounded-xl transition-all transform hover:-translate-y-1 duration-300`}>
                  <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'} px-5 py-2 rounded-lg flex items-center space-x-2`}>
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.0781176,15.4814316 L20.3301176,12.498799 C20.3930706,12.3527158 20.3835118,12.1875591 20.3050824,12.0499147 C20.2266529,11.9122704 20.0883118,11.8183364 19.9321176,11.7954316 L17.7191176,11.4334316 C17.3981176,11.3714316 17.1091176,11.1014316 17.0161176,10.7284316 C16.4401176,8.43943158 15.3701176,6.29943158 13.8731176,4.37943158 C13.6591176,4.09943158 13.6271176,3.70343158 13.8031176,3.40343158 L15.0441176,1.19243158 C15.1218,1.05459533 15.145825,0.894361688 15.1105118,0.742126019 C15.0751985,0.589890351 14.9828118,0.457384396 14.8521176,0.37243158 C13.1261176,-0.64156842 11.1671176,-0.12056842 9.26111761,0.64743158 C4.94511761,2.39143158 1.42211761,7.18543158 1.42211761,12.0194316 C1.42211761,16.8844316 4.98511761,22.0034316 11.0121176,23.8184316 C11.1547647,23.8625978 11.3077647,23.8494619 11.441353,23.7812316 C11.5749412,23.7130013 11.6797647,23.5949158 11.7341176,23.4514316 L12.5371176,21.4654316 C12.6471176,21.1814316 12.5671176,20.8524316 12.3471176,20.6374316 C11.0221176,19.3444316 10.1741176,17.6404316 9.92211761,15.7774316 C9.87611761,15.4044316 10.0661176,15.0374316 10.3881176,14.8764316 L12.4001176,13.8734316 C12.5444,13.8064351 12.7126588,13.7961463 12.8665176,13.8446245 C13.0203765,13.8931026 13.1464,13.9965755 13.2161176,14.1334316 L15.9381176,19.5994316 C15.9999529,19.7220933 16.1082,19.814978 16.2392059,19.8582833 C16.3702118,19.9015885 16.5141765,19.8916933 16.6361176,19.8314316 C17.9431176,19.1394316 19.0291176,17.6544316 19.0781176,15.4814316 Z" />
                    </svg>
                    <div>
                      <div className="text-xs text-gray-400">Disponible en</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img src="https://randomuser.me/api/portraits/women/79.jpg" className={`w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-gray-800'}`} alt="User" />
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" className={`w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-gray-800'}`} alt="User" />
                  <img src="https://randomuser.me/api/portraits/women/42.jpg" className={`w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-gray-800'}`} alt="User" />
                </div>
                <div className="text-sm text-gray-400">
                  Únete a +10,000 fans del anime que ya usan nuestra app
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDarkMode ? 'from-indigo-500 to-violet-500' : 'from-purple-500 to-pink-500'} rounded-2xl blur`}></div>
                <img 
                  src="https://placehold.co/600x400/3a1c71/ffffff?text=App+Screenshot" 
                  alt="App Screenshot" 
                  className="relative rounded-xl w-full z-10"
                />
              </div>
              <div className={`absolute -bottom-10 -right-10 w-64 h-64 ${isDarkMode ? 'bg-indigo-600/10' : 'bg-purple-600/10'} rounded-full blur-3xl`}></div>
              <div className={`absolute -top-10 -left-10 w-64 h-64 ${isDarkMode ? 'bg-violet-600/10' : 'bg-pink-600/10'} rounded-full blur-3xl`}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
              Lo que dicen nuestros usuarios
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Valeria Soto",
                avatar: "https://randomuser.me/api/portraits/women/32.jpg",
                text: "Animeverse es la mejor plataforma que he usado para organizar mi colección de anime. Las recomendaciones son siempre acertadas.",
                rating: 5
              },
              {
                name: "Carlos Mendez",
                avatar: "https://randomuser.me/api/portraits/men/54.jpg",
                text: "Me encanta la función de calendario de lanzamientos. Nunca me pierdo los nuevos episodios de mis series favoritas.",
                rating: 4
              },
              {
                name: "Sofia Herrera",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                text: "La interfaz es hermosa y muy fácil de usar. He descubierto muchos animes que de otra forma no hubiera conocido.",
                rating: 5
              }
            ].map((review, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} border ${isDarkMode ? 'border-gray-800' : 'border-gray-700'} shadow-lg ${isDarkMode ? 'hover:shadow-indigo-500/5' : 'hover:shadow-purple-500/5'} transition-shadow`}
              >
                <div className="flex items-center mb-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                         <svg 
                         key={i} 
                         className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-600'}`} 
                         fill="currentColor" 
                         viewBox="0 0 20 20"
                       >
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                       </svg>
                     ))}
                   </div>
                 </div>
               </div>
               <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-300'} italic`}>"{review.text}"</p>
             </div>
           ))}
         </div>
       </div>
     </div>
     
     {/* Newsletter Section */}
     <div className={`py-16 bg-gradient-to-r ${isDarkMode ? 'from-indigo-900/20 via-violet-900/20 to-indigo-900/20' : 'from-purple-900/20 via-pink-900/20 to-purple-900/20'} relative overflow-hidden`}>
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
       
       <div className="container mx-auto px-4 relative z-10">
         <div className="max-w-3xl mx-auto text-center">
           <h2 className="text-3xl font-bold mb-4">
             <span className={`bg-gradient-to-r ${isDarkMode ? 'from-indigo-400 to-violet-500' : 'from-purple-400 to-pink-500'} text-transparent bg-clip-text`}>
               Mantente informado
             </span>
           </h2>
           <p className="text-lg text-gray-300 mb-8">
             Suscríbete a nuestro newsletter para recibir notificaciones sobre nuevos lanzamientos, eventos especiales y contenido exclusivo.
           </p>
           
           <form className="flex flex-col sm:flex-row gap-3 mx-auto max-w-xl">
             <input 
               type="email" 
               placeholder="Tu correo electrónico" 
               className={`flex-1 px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-800 border-gray-700'} border text-white focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-indigo-500' : 'focus:ring-purple-500'}`}
             />
             <button 
               type="submit" 
               className={`px-6 py-3 rounded-lg bg-gradient-to-r ${isDarkMode ? 'from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700' : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white font-medium transition-all`}
             >
               Suscribirme
             </button>
           </form>
           
           <p className="text-sm text-gray-400 mt-4">
             No te preocupes, respetamos tu privacidad y no compartiremos tu información.
           </p>
         </div>
       </div>
     </div>
     
     {/* CSS animations */}
     <style jsx>{`
       @keyframes blob {
         0% {
           transform: translate(0px, 0px) scale(1);
         }
         33% {
           transform: translate(30px, -50px) scale(1.1);
         }
         66% {
           transform: translate(-20px, 20px) scale(0.9);
         }
         100% {
           transform: translate(0px, 0px) scale(1);
         }
       }
       
       .animate-blob {
         animation: blob 7s infinite alternate;
       }
       
       .animate-fade-in {
         animation: fadeIn 0.6s ease-out forwards;
       }
       
       .animate-fade-in-up {
         animation: fadeInUp 0.8s ease-out forwards;
       }
       
       @keyframes fadeIn {
         from {
           opacity: 0;
         }
         to {
           opacity: 1;
         }
       }
       
       @keyframes fadeInUp {
         from {
           opacity: 0;
           transform: translateY(20px);
         }
         to {
           opacity: 1;
           transform: translateY(0);
         }
       }
     `}</style>
   </div>
 );
};

export default Home;