import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const [count, setCount] = useState(10);
  
  useEffect(() => {
    // Redirección automática después de 10 segundos
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full relative">
        {/* Decoración de fondo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
        
        <div className="relative bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg">
            <span className="text-white text-3xl font-extrabold transform -rotate-12">404</span>
          </div>
          
          <div className="text-center pt-10">
            <h1 className="text-3xl font-bold text-white mb-4">Página no encontrada</h1>
            <p className="text-gray-300 mb-8">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
              Serás redirigido a la página principal en <span className="text-purple-400 font-bold">{count}</span> segundos.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link 
                to="/" 
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Ir a la página principal
              </Link>
              <Link 
                to="/animes" 
                className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Ver catálogo de animes
              </Link>
            </div>
          </div>
          
          {/* Línea de progreso */}
          <div className="mt-8">
            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${(count/10) * 100}%`, transition: 'width 1s linear' }}
              ></div>
            </div>
          </div>
          
          {/* Elemento decorativo */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-gray-600 text-5xl">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;