import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Rutas protegidas
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Páginas
import Home from '../pages/Home';
import AnimeList from '../pages/AnimeList';
import AnimeDetail from '../pages/AnimeDetail';
import AnimeCreate from '../pages/AnimeCreate';
import AnimeEdit from '../pages/AnimeEdit';
import AnimeImport from '../pages/AnimeImport'; // Nueva importación
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
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          } />
          
          <Route path="/register" element={
            <>
              <Navbar />
              <Register />
              <Footer />
            </>
          } />
          
          {/* Ruta principal - accesible para todos */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          
          {/* Ruta de exploración - accesible para todos */}
          <Route path="/animes" element={
            <>
              <Navbar />
              <AnimeList />
              <Footer />
            </>
          } />
          
          {/* Ruta de detalle de anime - accesible para todos */}
          <Route path="/animes/:id" element={
            <>
              <Navbar />
              <AnimeDetail />
              <Footer />
            </>
          } />
          
          {/* Ruta de selección de perfiles - requiere auth pero no perfil */}
          <Route path="/profiles" element={
            <ProtectedRoute requireAuth={true} requireProfile={false}>
              <Profiles />
            </ProtectedRoute>
          } />
          
          {/* Rutas que requieren autenticación y perfil seleccionado */}
          <Route path="/animes/create" element={
            <AdminRoute>
              <Navbar />
              <AnimeCreate />
              <Footer />
            </AdminRoute>
          } />
          
          {/* Nueva ruta para importar animes */}
          <Route path="/animes/import" element={
            <AdminRoute>
              <Navbar />
              <AnimeImport />
              <Footer />
            </AdminRoute>
          } />
          
          <Route path="/animes/:id/edit" element={
            <AdminRoute>
              <Navbar />
              <AnimeEdit />
              <Footer />
            </AdminRoute>
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