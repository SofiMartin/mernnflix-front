import { useState, useEffect, useContext } from 'react';
import { WatchlistContext } from '../context/watchlistContext';
import { AuthContext } from '../context/authContext';
import { ProfileContext } from '../context/ProfileContext';

const WatchlistButton = ({ animeId, size = 'normal', iconOnly = false }) => {
  const { isInWatchlist, addToWatchlist, removeAnimeFromWatchlist } = useContext(WatchlistContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { currentProfile } = useContext(ProfileContext);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!isAuthenticated || !currentProfile) {
        console.log('No hay autenticación o perfil seleccionado - omitiendo verificación de watchlist');
        setLoading(false);
        return;
      }
      
      if (!animeId) {
        console.log('No se proporcionó animeId - omitiendo verificación de watchlist');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log('Verificando si el anime está en watchlist:', {
          profileId: currentProfile._id,
          animeId: animeId
        });
        const result = await isInWatchlist(animeId);
        console.log('Resultado de verificación de watchlist:', result);
        setInWatchlist(!!result);
      } catch (error) {
        console.error('Error al comprobar watchlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (animeId) {
      checkWatchlist();
    }
  }, [animeId, isAuthenticated, currentProfile, isInWatchlist]);
  
  const handleToggleWatchlist = async () => {
    if (!isAuthenticated || !currentProfile) {
      // Podrías mostrar un mensaje o redireccionar al login
      return;
    }
    
    setLoading(true);
    try {
      if (inWatchlist) {
        await removeAnimeFromWatchlist(animeId);
        setInWatchlist(false);
      } else {
        await addToWatchlist(animeId);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Error al actualizar watchlist:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Si no hay usuario o perfil autenticado, no mostrar el botón
  if (!isAuthenticated || !currentProfile) {
    return null;
  }
  
  // Determinar clases según el tamaño
  const sizeClasses = size === 'small' 
    ? 'px-2 py-1 text-xs' 
    : size === 'large'
      ? 'px-6 py-3 text-base'
      : 'px-4 py-2 text-sm';
  
  // Determinar clases según si está en la watchlist
  const stateClasses = inWatchlist
    ? 'bg-green-700 hover:bg-green-800 text-white'
    : 'bg-purple-700 hover:bg-purple-800 text-white';
  
  return (
    <button
      onClick={handleToggleWatchlist}
      disabled={loading}
      className={`flex items-center justify-center rounded-md transition-colors ${sizeClasses} ${stateClasses} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      title={inWatchlist ? 'Quitar de mi lista' : 'Añadir a mi lista'}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : inWatchlist ? (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {!iconOnly && 'En mi lista'}
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {!iconOnly && 'Añadir a mi lista'}
        </>
      )}
    </button>
  );
};

export default WatchlistButton;