import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Verificar si el usuario está autenticado y es administrador
  if (!isAuthenticated || !currentUser?.isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

export default AdminRoute;