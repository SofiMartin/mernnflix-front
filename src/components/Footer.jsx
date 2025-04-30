import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

const Footer = () => {
  const { currentProfile } = useContext(ProfileContext);

  return (
    <footer className="bg-black py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white font-extrabold text-lg tracking-widest">
                ANIMEVERSE
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Tu plataforma de gestión de anime
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            {currentProfile && (
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  Perfil activo: <span className="text-white font-medium">{currentProfile.name}</span>
                </p>
                <Link 
                  to="/profiles" 
                  className="text-purple-400 hover:text-purple-300 text-xs"
                >
                  Cambiar perfil
                </Link>
              </div>
            )}
            <p className="text-gray-400 text-sm mb-2">
              Desarrollado con React + Vite + TailwindCSS
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://reactjs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="React"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 100-4.278zm-5.992 6.394a1.5 1.5 0 10-2.6 1.5 1.5 1.5 0 002.6-1.5zm3.816 1.35a1.5 1.5 0 10-2.6 1.5 1.5 1.5 0 002.6-1.5zm5.344 1.5a1.5 1.5 0 102.6-1.5 1.5 1.5 0 00-2.6 1.5zM13.5 2.25a1.5 1.5 0 00-3 0v1.5a1.5 1.5 0 003 0v-1.5zM12 14.861a2.139 2.139 0 100-4.278 2.139 2.139 0 000 4.278zm-8.846-2.639a1.5 1.5 0 00-2.6-1.5 1.5 1.5 0 102.6 1.5zm14.292 1.5a1.5 1.5 0 102.6-1.5 1.5 1.5 0 00-2.6 1.5z" />
                </svg>
              </a>
              <a 
                href="https://vitejs.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Vite"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.987 14.138l-3.135 5.435a.5.5 0 01-.866-.5l3.135-5.435a.5.5 0 01.866.5zm2.017-3.5a.5.5 0 01.866-.5l6.134 10.625a.5.5 0 01-.866.5l-6.134-10.625zm-4.9-4.989l1.9 3.292a.5.5 0 11-.866.5L8.138 5.643a.5.5 0 01.866-.5zm-1.9 3.292a.5.5 0 01-.866.5L1.6 4.95a.5.5 0 01.866-.5l5.736 9.93z" />
                </svg>
              </a>
              <a 
                href="https://tailwindcss.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="TailwindCSS"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} ANIMEVERSE. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;