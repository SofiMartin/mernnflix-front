import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Cargar usuario desde localStorage al inicio
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true); 
        } else {
          setIsAuthenticated(false); 
        }
      } catch (err) {
        console.error('Error al inicializar autenticación:', err);
        authService.logout();
        setIsAuthenticated(false); 
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Método para iniciar sesión
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(credentials);
      setCurrentUser(data);
      setIsAuthenticated(true); 
      toast.success('Inicio de sesión exitoso');
      return data;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setIsAuthenticated(false); 
      toast.error(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Método para registrarse
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.register(userData);
      setCurrentUser(data);
      setIsAuthenticated(true); 
      toast.success('Registro exitoso');
      return data;
    } catch (err) {
      setError(err.message || 'Error al registrarse');
      setIsAuthenticated(false); 
      toast.error(err.message || 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Método para cerrar sesión
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false); 
    toast.info('Sesión cerrada');
  };
  
  // Método para refrescar el token
  const refreshToken = async () => {
    try {
      const updatedUser = await authService.refreshToken();
      if (updatedUser) {
        setCurrentUser(updatedUser);
        setIsAuthenticated(true); 
        return true;
      }
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error('Error al refrescar token:', err);
      setCurrentUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };
  
  // Creamos un objeto con todos los valores que queremos exponer en el contexto
  const contextValue = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated 
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};