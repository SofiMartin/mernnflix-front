import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar usuario desde localStorage al inicio
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Error al inicializar autenticación:', err);
        authService.logout();
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
      toast.success('Inicio de sesión exitoso');
      return data;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
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
      toast.success('Registro exitoso');
      return data;
    } catch (err) {
      setError(err.message || 'Error al registrarse');
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
    toast.info('Sesión cerrada');
  };
  
  // Método para refrescar el token
  const refreshToken = async () => {
    try {
      const updatedUser = await authService.refreshToken();
      if (updatedUser) {
        setCurrentUser(updatedUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error al refrescar token:', err);
      setCurrentUser(null);
      return false;
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!currentUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};