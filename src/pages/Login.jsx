import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';

// Esquema de validación con Yup
const schema = yup.object({
  email: yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const from = location.state?.from?.pathname || '/profiles';
  
  // React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Manejar envío del formulario
  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError(null);
    
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-20`}>
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Decoración de fondo */}
          <div className={`absolute top-0 -mt-16 left-0 right-0 h-64 bg-gradient-to-b ${
            isDarkMode ? 'from-purple-900/30' : 'from-purple-600/20'
          } to-transparent -z-10`}></div>
          
          <div className={`relative ${
            isDarkMode ? 'bg-gray-800/60' : 'bg-white/80'
          } backdrop-blur-sm rounded-xl shadow-2xl p-8 border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {/* Logo y encabezado */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
              </div>
              <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Bienvenido de nuevo
              </h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Inicia sesión para acceder a tu cuenta
              </p>
            </div>
            
            {/* Mensaje de error */}
            {loginError && (
              <div className={`mb-6 p-4 ${
                isDarkMode ? 'bg-red-900/40 border-red-800' : 'bg-red-100 border-red-300'
              } border rounded-lg ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  {loginError}
                </p>
              </div>
            )}
            
            {/* Formulario de login */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Correo electrónico
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`appearance-none block w-full pl-10 px-3 py-3 border ${
                      errors.email ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    } rounded-lg ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                    } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                    placeholder="usuario@ejemplo.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
              
              {/* Contraseña */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Contraseña
                  </label>
                  <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={`appearance-none block w-full pl-10 px-3 py-3 border ${
                      errors.password ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    } rounded-lg ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                    } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>
              
              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    loading
                      ? 'bg-purple-800 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                  } transition-colors duration-300`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : 'Iniciar sesión'}
                </button>
              </div>
              
              {/* Footer */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>¿No tienes cuenta?</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/register"
                    className={`w-full flex justify-center py-3 px-4 border ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    } rounded-lg shadow-sm text-sm font-medium ${
                      isDarkMode ? 'text-gray-300 bg-transparent hover:bg-gray-700' : 'text-gray-700 bg-white hover:bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300`}
                  >
                    Crear cuenta
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;