import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ProfileContext } from '../context/ProfileContext';

const ProtectedRoute = ({ children, requireAuth = true, requireProfile = false }) => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { currentProfile, loading: profileLoading } = useContext(ProfileContext);
  const location = useLocation();
  
  // Si está cargando, mostrar un spinner
  if (authLoading || (requireProfile && profileLoading)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Si requiere autenticación y no está autenticado, redirigir a login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si requiere perfil y no hay perfil seleccionado, redirigir a selección de perfiles
  if (requireProfile && !currentProfile) {
    return <Navigate to="/profiles" state={{ from: location }} replace />;
  }
  
  // Si está autenticado pero va a login o registro, redirigir a home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;