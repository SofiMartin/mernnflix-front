import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { AuthContext } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { currentProfile } = useContext(ProfileContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { isDarkMode } = useTheme();

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-black'} py-12 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-700'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white font-extrabold text-lg tracking-widest">
                ANIMEVERSE
              </span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} text-sm mb-4`}>
              Tu plataforma definitiva para descubrir, coleccionar y compartir tus animes favoritos.
            </p>
            {currentProfile && (
              <div className={`mb-4 p-3 ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-800/60'} rounded-lg flex items-center space-x-3`}>
                <img 
                  src={currentProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentProfile.name}`} 
                  alt={currentProfile.name} 
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm text-white font-medium">{currentProfile.name}</p>
                  <Link 
                    to="/profiles" 
                    className="text-purple-400 hover:text-purple-300 text-xs"
                  >
                    Cambiar perfil
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Inicio</Link>
              </li>
              <li>
                <Link to="/animes" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Explorar</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/watchlist" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Mi Lista</Link>
                  </li>
                  <li>
                    <Link to="/profiles" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Perfiles</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Cuenta</h3>
            <ul className="space-y-2">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/profiles" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Gestionar Perfiles</Link>
                  </li>
                  <li>
                    <Link to="/watchlist" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Mi Watchlist</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Iniciar Sesión</Link>
                  </li>
                  <li>
                    <Link to="/register" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} hover:text-white transition-colors`}>Crear Cuenta</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Tecnologías</h3>
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://reactjs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-full text-sm transition-colors`}
              >
                React
              </a>
              <a 
                href="https://vitejs.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-full text-sm transition-colors`}
              >
                Vite
              </a>
              <a 
                href="https://tailwindcss.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-full text-sm transition-colors`}
              >
                TailwindCSS
              </a>
              <a 
                href="https://nodejs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-full text-sm transition-colors`}
              >
                Node.js
              </a>
              <a 
                href="https://expressjs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-full text-sm transition-colors`}
              >
                Express
              </a>
              <a 
                href="https://www.mongodb.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-full text-sm transition-colors`}
              >
                MongoDB
              </a>
            </div>
          </div>
        </div>
        
        <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-800'} flex flex-col md:flex-row justify-between items-center`}>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4 md:mb-0`}>
            &copy; {new Date().getFullYear()} ANIMEVERSE. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            {/* Nuevo icono - GitHub */}
            <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-white'} transition-colors`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            {/* Nuevo icono - Twitter/X */}
            <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-white'} transition-colors`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            {/* Nuevo icono - Discord */}
            <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-white'} transition-colors`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3857-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;