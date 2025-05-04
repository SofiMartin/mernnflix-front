import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { AuthContext } from '../context/authContext';

const Footer = () => {
  const { currentProfile } = useContext(ProfileContext);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <footer className="bg-black py-12 border-t border-gray-800">
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
            <p className="text-gray-400 text-sm mb-4">
              Tu plataforma definitiva para descubrir, coleccionar y compartir tus animes favoritos.
            </p>
            {currentProfile && (
              <div className="mb-4 p-3 bg-gray-800/60 rounded-lg flex items-center space-x-3">
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
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/animes" className="text-gray-400 hover:text-white transition-colors">Explorar</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/watchlist" className="text-gray-400 hover:text-white transition-colors">Mi Lista</Link>
                  </li>
                  <li>
                    <Link to="/profiles" className="text-gray-400 hover:text-white transition-colors">Perfiles</Link>
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
                    <Link to="/profiles" className="text-gray-400 hover:text-white transition-colors">Gestionar Perfiles</Link>
                  </li>
                  <li>
                    <Link to="/watchlist" className="text-gray-400 hover:text-white transition-colors">Mi Watchlist</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Iniciar Sesión</Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-400 hover:text-white transition-colors">Crear Cuenta</Link>
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
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                React
              </a>
              <a 
                href="https://vitejs.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                Vite
              </a>
              <a 
                href="https://tailwindcss.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                TailwindCSS
              </a>
              <a 
                href="https://nodejs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                Node.js
              </a>
              <a 
                href="https://expressjs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                Express
              </a>
              <a 
                href="https://www.mongodb.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                MongoDB
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ANIMEVERSE. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.7.71-1.17 1.5-1.17 3.08h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.7.71-1.17 1.5-1.17 3.08h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;