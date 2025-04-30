import { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ProfileContext } from '../context/ProfileContext';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const { currentProfile, profiles, selectProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const profileMenuRef = useRef(null);
  
  // Controlar scroll para cambiar apariencia de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Cerrar menú de perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Cerrar menú de perfil si está abierto
    if (isProfileMenuOpen) {
      setIsProfileMenuOpen(false);
    }
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  const handleChangeProfile = async (profileId) => {
    try {
      await selectProfile(profileId);
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Error al cambiar de perfil:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleManageProfiles = () => {
    navigate('/profiles');
  };
  
  // Clase CSS para el estado actual de la navbar
  const navClass = scrolled 
    ? 'fixed top-0 w-full z-50 bg-black bg-opacity-90 backdrop-blur-md shadow-lg transition-all duration-300'
    : 'absolute top-0 w-full z-50 bg-gradient-to-b from-black to-transparent transition-all duration-300';
  
  return (
    <nav className={navClass}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white font-extrabold text-lg tracking-widest hidden md:block">
                ANIMEVERSE
              </span>
            </div>
          </Link>
          
          {/* Links para desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `relative px-4 py-2 font-medium text-sm transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              {({ isActive }) => (
                <>
                  <span>INICIO</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></span>
                  )}
                </>
              )}
            </NavLink>
            
            <NavLink 
              to="/animes" 
              className={({ isActive }) => 
                `relative px-4 py-2 font-medium text-sm transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              {({ isActive }) => (
                <>
                  <span>EXPLORAR</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></span>
                  )}
                </>
              )}
            </NavLink>
            
            <NavLink 
              to="/watchlist" 
              className={({ isActive }) => 
                `relative px-4 py-2 font-medium text-sm transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              {({ isActive }) => (
                <>
                  <span>MI LISTA</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></span>
                  )}
                </>
              )}
            </NavLink>
            
            <NavLink 
              to="/animes/create" 
              className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              onClick={closeMenu}
            >
              AGREGAR
            </NavLink>
          </div>
          
          {/* Perfil y menú de usuario (visible en desktop) */}
          <div className="hidden md:flex items-center ml-4">
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-full pr-3 pl-1 py-1 transition-colors"
              >
                <img 
                  src={currentProfile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentProfile?.name}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-700"
                />
                <span className="text-sm font-medium text-gray-300">{currentProfile?.name}</span>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {/* Menú desplegable para perfiles */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-700">
                  <div className="py-1">
                    {profiles.map(profile => (
                      <button
                        key={profile._id}
                        onClick={() => handleChangeProfile(profile._id)}
                        className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors ${
                          currentProfile?._id === profile._id ? 'bg-gray-700/50' : ''
                        }`}
                      >
                        <img 
                          src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
                          alt={profile.name} 
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-300">{profile.name}</span>
                        {currentProfile?._id === profile._id && (
                          <svg className="w-4 h-4 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-700 py-1">
                    <button
                      onClick={handleManageProfiles}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Gestionar perfiles
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-200 focus:outline-none"
            >
              {!isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil desplegable con animación */}
      <div 
        className={`md:hidden absolute w-full bg-black bg-opacity-95 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-2 space-y-2">
          {/* Perfil actual (móvil) */}
          {currentProfile && (
            <div className="border-b border-gray-700 pb-3 mb-3">
              <div className="flex items-center space-x-3 px-4 py-2">
                <img 
                  src={currentProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentProfile.name}`} 
                  alt={currentProfile.name} 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-white font-medium">{currentProfile.name}</p>
                  <p className="text-xs text-gray-400">
                    {currentProfile.type === 'kid' ? 'Perfil infantil' : 
                      currentProfile.type === 'teen' ? 'Perfil adolescente' : 'Perfil adulto'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleManageProfiles}
                className="w-full mt-2 text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Cambiar perfil
              </button>
            </div>
          )}
          
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `block px-4 py-3 border-l-4 rounded-r-md transition-all ${
                isActive 
                  ? 'border-purple-500 bg-purple-900 bg-opacity-40 text-white' 
                  : 'border-transparent text-gray-300 hover:bg-gray-900 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            INICIO
          </NavLink>
          <NavLink 
            to="/animes" 
            className={({ isActive }) => 
              `block px-4 py-3 border-l-4 rounded-r-md transition-all ${
                isActive 
                  ? 'border-purple-500 bg-purple-900 bg-opacity-40 text-white' 
                  : 'border-transparent text-gray-300 hover:bg-gray-900 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            EXPLORAR
          </NavLink>
          <NavLink 
            to="/watchlist" 
            className={({ isActive }) => 
              `block px-4 py-3 border-l-4 rounded-r-md transition-all ${
                isActive 
                  ? 'border-purple-500 bg-purple-900 bg-opacity-40 text-white' 
                  : 'border-transparent text-gray-300 hover:bg-gray-900 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            MI LISTA
          </NavLink>
          <NavLink 
            to="/animes/create" 
            className={({ isActive }) => 
              `block px-4 py-3 border-l-4 rounded-r-md transition-all ${
                isActive 
                  ? 'border-purple-500 bg-purple-900 bg-opacity-40 text-white' 
                  : 'border-transparent text-gray-300 hover:bg-gray-900 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            AGREGAR ANIME
          </NavLink>
          
          {/* Cerrar sesión (móvil) */}
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 border-l-4 border-transparent text-gray-300 hover:bg-gray-900 hover:text-white rounded-r-md transition-all mt-4"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              CERRAR SESIÓN
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;