import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Rutas protegidas
import ProtectedRoute from './ProtectedRoute';

// Páginas
import Home from '../pages/Home';
import AnimeList from '../pages/AnimeList';
import AnimeDetail from '../pages/AnimeDetail';
import AnimeCreate from '../pages/AnimeCreate';
import AnimeEdit from '../pages/AnimeEdit';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profiles from '../pages/Profiles';
import NotFound from '../pages/NotFound';
import Watchlist from '../pages/Watchlist';

// Componentes
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          
          <Route path="/register" element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          } />
          
          {/* Ruta de selección de perfiles - requiere auth pero no perfil */}
          <Route path="/profiles" element={
            <ProtectedRoute requireAuth={true} requireProfile={false}>
              <Profiles />
            </ProtectedRoute>
          } />
          
          {/* Rutas que requieren autenticación y perfil seleccionado */}
          <Route path="/" element={
            <ProtectedRoute requireAuth={true} requireProfile={true}>
              <Navbar />
              <Home />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/animes" element={
            <ProtectedRoute requireAuth={true} requireProfile={true}>
              <Navbar />
              <AnimeList />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/animes/:id" element={
            <ProtectedRoute requireAuth={true} requireProfile={true}>
              <Navbar />
              <AnimeDetail />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/animes/create" element={
            <ProtectedRoute requireAuth={true} requireProfile={true}>
              <Navbar />
              <AnimeCreate />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/animes/:id/edit" element={
            <ProtectedRoute requireAuth={true} requireProfile={true}>
              <Navbar />
              <AnimeEdit />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/watchlist" element={
            <ProtectedRoute requireAuth={true} requireProfile={true}>
              <Navbar />
              <Watchlist />
              <Footer />
            </ProtectedRoute>
          } />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{ 
            background: '#1f2937', 
            color: '#f3f4f6',
            borderLeft: '4px solid #9333ea'
          }}
        />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;