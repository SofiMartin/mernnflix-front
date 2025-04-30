import { Link } from 'react-router-dom';
import { useState } from 'react';

const AnimeCard = ({ anime }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determinar el color de fondo para el estado del anime
  const statusBgColor = anime.status === 'Finalizado' 
    ? 'bg-blue-900/80 text-blue-200' 
    : 'bg-green-900/80 text-green-200';
  
  // Animar entrada de la tarjeta cuando la imagen está cargada
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <div 
      className={`group rounded-lg overflow-hidden bg-gray-800 border border-gray-700 shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
        imageLoaded ? 'opacity-100' : 'opacity-70'
      }`}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        {/* Overlay de gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-10 group-hover:opacity-90 transition-opacity"></div>
        
        {/* Imagen */}
        <img 
          src={anime.imageUrl} 
          alt={anime.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onLoad={handleImageLoad}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450?text=No+disponible';
            setImageLoaded(true);
          }}
        />
        
        {/* Badge de rating */}
        <div className="absolute top-2 right-2 z-20 flex items-center space-x-1 bg-black/70 text-yellow-400 font-bold px-2 py-1 rounded backdrop-blur-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span>{anime.rating.toFixed(1)}</span>
        </div>
        
        {/* Badge de estado */}
        <div className={`absolute top-2 left-2 z-20 px-2 py-1 text-xs rounded-full backdrop-blur-sm ${statusBgColor}`}>
          {anime.status}
        </div>
        
        {/* Año y estudio */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex flex-col space-y-1">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{anime.title}</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">{anime.releaseYear}</span>
            <span className="text-gray-300 text-sm truncate max-w-[140px]">{anime.studio}</span>
          </div>
        </div>
      </div>
      
      {/* Información */}
      <div className="p-4 bg-gray-800">
        {/* Géneros */}
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres.slice(0, 3).map((genre, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-purple-900/40 text-purple-200 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
          {anime.genres.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              +{anime.genres.length - 3}
            </span>
          )}
        </div>
        
        {/* Temporadas y episodios */}
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span>{anime.seasonCount} {anime.seasonCount === 1 ? 'Temporada' : 'Temporadas'}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
            </svg>
            <span>{anime.episodeCount} {anime.episodeCount === 1 ? 'Episodio' : 'Episodios'}</span>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-between">
          <Link 
            to={`/animes/${anime.id}`} 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors flex-grow text-center mr-2"
          >
            Detalles
          </Link>
          <Link 
            to={`/animes/${anime.id}/edit`} 
            className="p-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
            aria-label="Editar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;